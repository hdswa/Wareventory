import datetime
from flask import Blueprint, request, Response,json
from .models import Job_packages,Jobs,Item_data,Location_data,Log, Reception_Bascket,location_array,Picking_items,Picking_list
from bcrypt import checkpw, gensalt, hashpw

process = Blueprint('process',__name__)



# @process.route('/login',methods=['POST'])
# def login():
#     print("dentro de login")
#     jobs_data = []
#     return Response(json.dumps(jobs_data), mimetype='application/json', status=200)

@process.route('/jobs', methods=['GET'])
def search_result():
   
    params = request.args
    print("======================Valor de params en path /jobs")
    print("params:",params)
    print("==================")
    jobCodes = []
    if 'sku' in params and params['sku'] != '':
        jobCodes.extend(Job_packages.get_job_codes_by_item_sku(params['sku']))
    if 'jobId' in params and params['jobId'] != '':
        jobCodes.extend([params['jobId']])
    if 'supplier' in params and params['supplier'] != '':
        jobCodes.extend(Jobs.find_by_supplier(params['supplier']))
    if 'pg' in params and params['pg'] != '':
        jobCodes.extend(Job_packages.get_job_codes_by_pg(params['pg']))
    
    

    jobs_data = []
    for jobCode in jobCodes:
        job = Jobs.find_by_code(jobCode)
        job_data = {
            "jobId": jobCode,
            "jobComment": job.descripcion,
            "jobSize": job.size,
            "jobSupplier": job.supplier
        }
        jobs_data.append(job_data)
    
    print("=========================")
    print(json.dumps(jobs_data))
    print("=========================")
    return Response(json.dumps(jobs_data), mimetype='application/json', status=200)
    

@process.route('/packages', methods=['GET'])
def getJobPackages():
    params = request.args   
    jobs_data = []
    gotResult=False
    
    
    print("valor de params en /packages GET:============ASD====\n")
    print("params:",params)
    #get jobPackages via PG and jobID
    if 'pg' in params and params['pg'] != '' and 'jobId' in params and params['jobId'] != '':
        print("=================================")
        print("dentro de pg y jobId existe")
        print("=================================")
        jobPackages = Job_packages.get_package_by_pg_and_job_code(params['pg'],params['jobId'])
        print("valor de jobpackages")
        
        for jobPackage in jobPackages:
            job_data={
                "jobId": jobPackage.job_code,
                "PG": jobPackage.PG,
                "itemSKU": jobPackage.item_SKU,
                "expectedQuantity": jobPackage.expected_quantity,
                "receivedQuantity": jobPackage.received_quantity,
                "locatedQuantity": jobPackage.located_quantity
            }
            jobs_data.append(job_data)
        gotResult=True
            
    #get jobPackages Via id
    if 'jobId' in params and params['jobId'] != '' and not gotResult:
        print("=================================")
        print("dentro de jobId existe")
        print("=================================")
        jobPackages = Job_packages.get_package_by_job_code(params['jobId'])
        print("valor de jobpackages")
        
        for jobPackage in jobPackages:
            job_data={
                "jobId": jobPackage.job_code,
                "PG": jobPackage.PG,
                "itemSKU": jobPackage.item_SKU,
                "expectedQuantity": jobPackage.expected_quantity,
                "receivedQuantity": jobPackage.received_quantity,
                "locatedQuantity": jobPackage.located_quantity
            }
            jobs_data.append(job_data)
    return Response(json.dumps(jobs_data), mimetype='application/json', status=200)


@process.route('/location', methods=['GET'])
def getLocationItems():
    params = request.args
    
    locations_data=[]
    if 'location' in params and params['location'] != '':
        print("===========================")
       
        locationData=Location_data.get_items_by_location(params['location'])
       
        data=locationData[0].item_data
        
        for item in data:
            location_data={
                "SKU": item.SKU,
                "quantity": item.quantity,
                "location": params['location']
            }
            locations_data.append(location_data)
        
        
    return Response(json.dumps(locations_data), mimetype='application/json', status=200)

@process.route('/itemSKU', methods=['GET'])
def getLocationBySKU():
    print("=======================")
    print("valor de args en /itemSKU GET:"+str(request.args))
    params = request.args
    locations_data=[]
    if 'itemSKU' in params and params['itemSKU'] != '':
        print("parametro:"+params['itemSKU'])
        item=Item_data.get_product_locations_by_sku(params['itemSKU'])
       
        locations=item.locations
        print("localizaciones",locations)
        
        for location in locations:
            locationData = Location_data.get_items_by_location(location)
            for item in locationData[0].item_data:
                item_sku = str(item.SKU).strip()  # Convert to string and strip whitespace
                param_sku = str(params['itemSKU']).strip()  # Convert to string and strip whitespace
                if item_sku == param_sku:
                    location_data={
                        "quantity": item.quantity,
                        "SKU": item.SKU,
                        "location":location
                    }
                    locations_data.append(location_data)
                
        return Response(json.dumps(locations_data), mimetype='application/json', status=200)


@process.route('/log',methods=['GET'])
def getLog():
    # Retrieve the 'limit' parameter from the query string, defaulting to 10 if not provided
    limit = int(request.args.get('limit', 10))
    action=request.args.get('action')
    
    accion="Reception"
    logs_data = []
    # Query logs, order them by 'time' in descending order, and limit the results
    logs = Log.objects(action=accion).order_by('-time').limit(limit)

    for log in logs:
        print(f"User Code: {log.user_code}, Action: {log.action}, Time: {log.time}")
        log_data = {
            "user_code": log.user_code,
            "action": log.action,
            "time": log.time        }
        # Dynamically add optional fields if they exist
        for field in ['item_SKU', 'quantity', 'package_code']:
            if hasattr(log, field):
                print(f"{field}: {getattr(log, field)}")
                log_data[field] = getattr(log, field)
        
        logs_data.append(log_data)
    
    return Response(json.dumps(logs_data), mimetype='application/json', status=200)
        
                
@process.route('/reception',methods=['POST'])
def postReception():
    data = request.json
    print("========================")
    print("data:",data)
    
    #meter en log
    #actualizar job packages
    
    
    
    log = Log()
    log.user_code = "admin"
    log.action = 'Reception'
    log.time = str(datetime.datetime.now())
    log.item_SKU = data['sku']
    log.quantity = data['quantity']
    log.package_code = data['pg']
    log.save()
    
    receptioNBasket = Reception_Bascket()
    receptioNBasket.item_SKU = data['sku']
    receptioNBasket.quantity = data['quantity']
    receptioNBasket.jobId = data['jobId']
    receptioNBasket.PG = data['pg']
    receptioNBasket.save()
    
    
    jobPacakge = Job_packages.get_package_by_pg_and_job_code(data['pg'],data['jobId'])
    print("===========================")
    print("valor de quantity en clase:",jobPacakge)
    print(jobPacakge[0].received_quantity)

    updatedQuantity=int(jobPacakge[0].received_quantity)+int(data['quantity'])
    jobPacakge.update(received_quantity=str(updatedQuantity))
    
    print("?===================")

    return Response(json.dumps({"message": "Log created successfully"}), mimetype='application/json', status=201)
          
        
        
        
@process.route('/reception_bascket',methods=['GET'])
def getReceptionBasketBySKU():
    
    
    sku=request.args.get('sku')
   
    
    try:
        sku_int = int(sku)  # Attempt to convert SKU to integer
    except ValueError:
        return Response("Invalid SKU format. SKU must be an integer.", status=400)
    
    
    receptionBasket = Reception_Bascket.getReceptionBascketBySKU(sku);
    
    basket_data = []
    for basket in receptionBasket: 
        newBasket = {
            "item_SKU": basket.item_SKU,
            "quantity": basket.quantity,
            "jobId": basket.jobId,
            "PG": basket.PG,
        }
        basket_data.append(newBasket)
        
    return Response(json.dumps(basket_data), mimetype='application/json', status=200)
    #meter en log
    #actualizar job packages

   
       
        
        
@process.route('/placement',methods=['POST'])
def postPlacement():
    
    data=request.json
    print("=============Valor de placement========")
    print(data)
    
    pg=data['PG']
    itemSKU=data['item_SKU']
    location=data['location']
    quantity=data['quantity']
    jobId=data['jobId']
    Reception_Bascket.removeOneReceptionBascketByParams(itemSKU, jobId, pg, quantity)
    
    log=Log()
    log.user_code="admin"
    log.action="placement"
    log.time=str(datetime.datetime.now())
    log.item_SKU=itemSKU
    log.quantity=quantity
    log.location=location
    log.save()
    
    
    #store item into location
    if(Location_data.objects(location=location).count()==0):
        locationData=Location_data()
        locationData.location=location
        item_data_instance = location_array(SKU=itemSKU, quantity=quantity)
        locationData.item_data=[item_data_instance]
        locationData.save()
        
    else:
        print("====================ELSE=====existe ubicacion===============")
        locationData=Location_data.get_items_by_location(location)
        item_data_back=locationData[0].item_data
        item_data_aux=[]
        
        foundItem=False
        for item in item_data_back:
            if item.SKU==itemSKU:
                print("item.SKU==itemSKU:"+str(item.SKU)+"=="+str(itemSKU))
                item.quantity+=quantity
                foundItem=True
            
        if not foundItem:
            item_data_instance = location_array(SKU=itemSKU, quantity=quantity)
            item_data_aux.append(item_data_instance)
            
        combined_data = item_data_back + item_data_aux
        print("valor de combined_data")
        for xd in combined_data:
            
            print("SKU:",xd.SKU)
            print("quantity:",xd.quantity)
        locationData.update(item_data=combined_data)
                
    
   
    #update itemData
    
    itemData=Item_data.get_product_locations_by_sku(itemSKU)
    if itemData:
        locations=itemData.locations
        if location not in locations:
            locations.append(location)
            itemData.update(locations=locations)
        else:
            itemData=Item_data()
            itemData.SKU=itemSKU
            itemData.locations=[location]
            itemData.save()
    else:
        itemData=Item_data()
        itemData.SKU=itemSKU
        itemData.locations=[location]   
        itemData.save()
            
        
    
 
    # jobPacakge = Job_packages.get_package_by_pg_and_job_code(pg,jobId)

    # updatedQuantity=int(jobPacakge[0].located_quantity)+int(quantity)
    # jobPacakge.update(located_quantity=str(updatedQuantity))
    
    return ""
        
        
        
        
@process.route('/transfer',methods=['POST'])
def postTransfer():
    
    data=request.json
    
    print("=============valor en transfer"+str(data))
    
    origin=data['location_origin']
    destination=data['location_destination']
    itemSKU=data['itemSKU']
    quantity=data['quantity']
    
    #comproabcion extra de que el objeto existe en origen
    
    if(Location_data.objects(location=origin).count()==0):
        return Response("Location origin not found", status=400)
    # if(Location_data.objects(location=destination).count()==0):
    #     return Response("Location destination not found", status=400)
    
    #UBICAICON final no existe creo una nueva
    if(Location_data.objects(location=destination).count()==0):
        locationNewData=Location_data()
        locationNewData.location=destination
        locationNewData.item_data=[location_array(SKU=itemSKU, quantity=quantity)]
        locationNewData.save()
    else:
        locationData=Location_data.get_items_by_location(destination)
        item_data_back=locationData[0].item_data
        item_data_aux=[]
        foundItem=False
        for item in item_data_back:
            if item.SKU==itemSKU:
                item.quantity+=quantity
                foundItem=True
            
        if not foundItem:
            item_data_instance = location_array(SKU=itemSKU, quantity=quantity)
            item_data_aux.append(item_data_instance)
            
        combined_data = item_data_back + item_data_aux
        locationData.update(item_data=combined_data)
        
    #borrar origen
    
    locationData = Location_data.get_items_by_location(origin)
    item_data_back = locationData[0].item_data
    item_data_aux = []
    
    for item in item_data_back:
        if item.SKU == itemSKU:
            item.quantity -= quantity
            # Only append the item if its quantity is not 0
            print("valor de itemSKU:"+str(item.SKU))
            print("valor de quantity:"+str(item.quantity))
            if item.quantity > 0:
                item_data_aux.append(item)
                
        else:
            item_data_aux.append(item)
    print("valor de itemDataaux:"+str(item_data_aux))
    
    for item in item_data_aux:
        print("SKU:",item.SKU)
        print("quantity:",item.quantity)
 
    locationData.update(item_data=item_data_aux)
    
    log=Log()
    log.user_code="admin"
    log.action="transfer"
    log.time=str(datetime.datetime.now())
    log.item_SKU=itemSKU
    log.quantity=quantity
    log.origin=origin
    log.destination=destination
    log.save()
    
    return ""
    
@process.route('/picking', methods=['GET', 'POST'])
def picking_operation():
    if request.method == 'GET':
        params = request.args
        if 'code' in params and params['code'] != '':
            picking_list = Picking_list.objects(code=params['code']).first()
            if picking_list:
                items = []
                for item in picking_list.items:
                    items.append({
                        "SKU": item.SKU,
                        "quantity": item.quantity,
                        "location": item.location,
                        "picked": item.picked
                    })
                return Response(json.dumps(items), mimetype='application/json', status=200)
            return not_found("Picking list not found")
        else:
            # Retrieve all picking lists if no 'code' parameter is provided
            return Response(json.dumps(Picking_list.get_all_codes()), mimetype='application/json', status=200)
        
    elif request.method == 'POST':
        params = request.json
        if (params.get('status')== 'Completed'):
            print("valores de param",params)
            Picking_list.set_picking_list_status(params['code'], 'Completed')
            return Response(json.dumps(params), mimetype='application/json', status=200)
        else:
            print("dentro de post picking")
            Picking_list.set_picked_status(params['code'], params['SKU'], params['location'], params['quantity'])
            Picking_list.check_picking_list_status(params['code'])

            Location_data.update_location(params['location'], params['SKU'], params['quantity'],"delete")

            return Response(json.dumps(params), mimetype='application/json', status=200)


    return bad_request("Invalid request method")
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        

ERROR_400_DEFAULT_MSG = "The server cannot or will not process the request."
ERROR_403_DEFAULT_MSG = "You are not allowed to access to this endpoint."
ERROR_404_DEFAULT_MSG = "The requested URL was not found on the server. " \
                        "If you entered the URL manually please check your spelling and try again."
ERROR_429_DEFAULT_MSG = "You have sent too many requests in a given amount of time."
ERROR_500_DEFAULT_MSG = "Something was wrong, please try it again later. " \
                        "If the problem persists please contact with the service provider."
ERROR_504_DEFAULT_MSG = "The server did not get a response in time."

def bad_request(msg: str = ERROR_400_DEFAULT_MSG):
    return Response(json.dumps({
        "message": "{}".format(msg)
    }), status=400)


# 403-forbidden
def forbidden(msg: str = ERROR_403_DEFAULT_MSG):
    return Response(json.dumps({
        "title": "Forbidden",
        "message": "{}".format(msg)
    }), status=403)


# 404-not found
def not_found(msg: str = ERROR_404_DEFAULT_MSG):
    return Response(json.dumps({
        "title": "Not found",
        "message": "{}".format(msg)
    }), status=404)


# 429-Too many request
def too_many_request(msg: str = ERROR_429_DEFAULT_MSG):
    return Response(json.dumps({
        "title": "Too many request",
        "message": "{}".format(msg)
    }), status=429)


# 500-Internal server error
def internal_server_error(msg: str = ERROR_500_DEFAULT_MSG):
    return Response(json.dumps({
        "message": "{}".format(msg)
    }), status=500)


# 504 Gateway Timeout
def gateway_timeout(msg: str = ERROR_504_DEFAULT_MSG):
    return Response(json.dumps({
        "title": "Gateway Timeout",
        "message": "{}".format(msg)
    }), status=504)




# @process.route('/product_search',methods=['GET','POST'])
# def search_result():
#     if request.method == 'POST':
#         item_SKU = request.form.get('item_SKU')
#         box_code = request.form.get('box_code')
#         location = request.form.get('location')
#         job_code = request.form.get('job_code')
#         supplier_code = request.form.get('supplier_code')
        
#         if item_SKU:
#             job_codes = Job_packages.get_job_codes_by_item_sku(item_SKU)
#             job_suppliers = []
#             for job_code in job_codes:
#                 job = Jobs.find_by_code(job_code)
#                 job_suppliers.append(job.supplier)
#             jobs = zip(job_codes, job_suppliers)
#             return render_template("search_result.html",item_SKU=item_SKU, jobs=jobs)
        
#         return render_template("search_result.html",item_SKU=item_SKU)
        
#     return render_template("product_search.html")