import datetime
from flask import Blueprint, request, Response,json,jsonify,current_app
from .models import Job_packages,Jobs,Item_data,Location_data,Log, Reception_Bascket,location_array,Picking_items,Picking_list,User
from bcrypt import checkpw, gensalt, hashpw
from functools import wraps
import jwt
process = Blueprint('process',__name__)




def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        # 
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]
        
        if not token:
            
            return jsonify({'message': 'Token is missing!'}), 401
        
        try:
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = data['username']
            
        except Exception as e:
            
            return jsonify({'message': 'Token is invalid!'}), 401
        
        return f(current_user, *args, **kwargs)
    
    return decorated

def admin_token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        # 
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]
        
        if not token:
            
            return jsonify({'message': 'Token is missing!'}), 401
        
        try:
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = data['username']
            if data['role'] != 'admin':
                return jsonify({'message': 'Token is not an admin!'}), 401
        except Exception as e:
            
            return jsonify({'message': 'Token is invalid!'}), 401
        
        return f(current_user, *args, **kwargs)
    
    return decorated


@process.route('/jobs', methods=['GET','DELETE','POST'])
@token_required
def search_result(current_user, *args, **kwargs):
    
    if request.method == 'GET':
        params = request.args
       
        
        jobCodes = []
        if 'sku' in params and params['sku'] != '':
            jobCodes.extend(Job_packages.get_job_codes_by_item_sku(params['sku']))
        if 'jobId' in params and params['jobId'] != '':
            jobCodes.extend([params['jobId']])
        if 'supplier' in params and params['supplier'] != '':
            jobCodes.extend(Jobs.find_by_supplier(params['supplier']))
        if 'pg' in params and params['pg'] != '':
            jobCodes.extend(Job_packages.get_job_codes_by_pg(params['pg']))
        
        if 'all' in params and params['all'] == 'true':
            jobCodes.extend(Jobs.get_all_jobs())
            jobs_data = []
            for job in jobCodes:
                job_data = {
                    "jobId": job.code,
                    "jobComment": job.descripcion,
                    "jobSize": job.size,
                    "jobSupplier": job.supplier,
                    "description": job.descripcion,
                    "closed": job.closed

                }
                jobs_data.append(job_data)
            return Response(json.dumps(jobs_data), mimetype='application/json', status=200)
            
        print("valor de jobCodes: ",jobCodes)
        jobs_data = []
        for jobCode in jobCodes:
            job = Jobs.find_by_code(jobCode)
            job_data = {
                "jobId": jobCode,
                "jobComment": job.descripcion,
                "jobSize": job.size,
                "jobSupplier": job.supplier,
                "closed": job.closed
            }
            jobs_data.append(job_data)
        
        
        
        
        return Response(json.dumps(jobs_data), mimetype='application/json', status=200)
    
    if request.method == 'POST':
        data = request.json
        
        if not data.get('jobId') or not data.get('jobComment') or not data.get('jobSize') or not data.get('jobSupplier'):
            return bad_request("Missing Data")
        
        if Jobs.objects(code=data['jobId']).count() > 0:
            return bad_request("Job already exists.")
        
        job = Jobs()
        job.code = data['jobId']
        job.descripcion = data['jobComment']
        job.size = data['jobSize']
        job.supplier = data['jobSupplier']
        job.save()
        
        return Response(json.dumps({"message": "Job created successfully"}), mimetype='application/json', status=201)


        
@process.route('/packages', methods=['GET'])
@token_required
def getJobPackages(current_user, *args, **kwargs):
    params = request.args   
    jobs_data = []
    gotResult=False
    
    
    
    
    #get jobPackages via PG and jobID
    if 'pg' in params and params['pg'] != '' and 'jobId' in params and params['jobId'] != '':
        
        
        
        jobPackages = Job_packages.get_package_by_pg_and_job_code(params['pg'],params['jobId'])
        
        
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
        
        
        
        jobPackages = Job_packages.get_package_by_job_code(params['jobId'])
        
        
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
@token_required
def getLocationItems(current_user, *args, **kwargs):
    params = request.args
    
    locations_data=[]
    if 'location' in params and params['location'] != '':
        
       
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
@token_required
def getLocationBySKU(current_user, *args, **kwargs):
    
    
    params = request.args
    locations_data=[]
    if 'itemSKU' in params and params['itemSKU'] != '':
        
        item=Item_data.get_product_locations_by_sku(params['itemSKU'])
        if item:
            locations=item.locations
            
            
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
@token_required
def getLog(current_user, *args, **kwargs):
    # Retrieve the 'limit' parameter from the query string, defaulting to 10 if not provided
    limit = int(request.args.get('limit', 10))
    action=request.args.get('action')
    
    
    logs_data = []

    if action=="all":   
        logs = Log.objects().order_by('-time').limit(limit)
        for log in logs:
           
            log_data = {
                "user_code": log.user_code,
                "action": log.action,
                "time": log.time        }
            # Dynamically add optional fields if they exist
            for field in ['item_SKU', 'quantity', 'package_code']:
                if hasattr(log, field):
                    # 
                    log_data[field] = getattr(log, field)
            
            logs_data.append(log_data)

    else:
    # Query logs, order them by 'time' in descending order, and limit the results
        logs = Log.objects(action=action).order_by('-time').limit(limit)

        for log in logs:
       
            log_data = {
                "user_code": log.user_code,
                "action": log.action,
                "time": log.time        }
            # Dynamically add optional fields if they exist
            for field in ['item_SKU', 'quantity', 'package_code']:
                if hasattr(log, field):
                    # 
                    log_data[field] = getattr(log, field)
            
            logs_data.append(log_data)
        
    return Response(json.dumps(logs_data), mimetype='application/json', status=200)
        
                
@process.route('/reception',methods=['POST'])
@token_required
def postReception(current_user, *args, **kwargs):
    data = request.json
    
    


    log_data={"item_SKU":data['sku'],"quantity":data['quantity'],"package_code":data['pg'],"jobId":data['jobId']}
    create_log(current_user,"Reception",log_data)
    
    receptioNBasket = Reception_Bascket()
    receptioNBasket.item_SKU = data['sku']
    receptioNBasket.quantity = data['quantity']
    receptioNBasket.jobId = data['jobId']
    receptioNBasket.PG = data['pg']
    receptioNBasket.save()
    
    
    jobPacakge = Job_packages.get_package_by_pg_and_job_code(data['pg'],data['jobId'])
    
    
    

    updatedQuantity=int(jobPacakge[0].received_quantity)+int(data['quantity'])
    jobPacakge.update(received_quantity=str(updatedQuantity))
    
    

    return Response(json.dumps({"message": "Log created successfully"}), mimetype='application/json', status=201)
          
        
        
        
@process.route('/reception_bascket',methods=['GET'])
@token_required
def getReceptionBasketBySKU(current_user, *args, **kwargs):
    
    
    sku=request.args.get('sku')
   
    receptionBasket = Reception_Bascket.getReceptionBascketBySKU(sku)
    
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
@token_required
def postPlacement(current_user, *args, **kwargs):
    
    data=request.json
    
    
    
    pg=data['PG']
    itemSKU=data['item_SKU']
    location=data['location']
    quantity=data['quantity']
    jobId=data['jobId']
    Reception_Bascket.removeOneReceptionBascketByParams(itemSKU, jobId, pg, quantity)
    
    # log=Log()
    # log.user_code=current_user
    # log.action="placement"
    # log.time=str(datetime.datetime.now())
    # log.item_SKU=itemSKU
    # log.quantity=quantity
    # log.location=location
    # log.save()
    
    log_data={"item_SKU":itemSKU,"quantity":data['quantity'], "location":location}
    create_log(current_user,"Placement",log_data)
    
    #store item into location
    if(Location_data.objects(location=location).count()==0):
        locationData=Location_data()
        locationData.location=location
        item_data_instance = location_array(SKU=itemSKU, quantity=quantity)
        locationData.item_data=[item_data_instance]
        locationData.save()
        
    else:
        
        locationData=Location_data.get_items_by_location(location)
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

    jobPacakge = Job_packages.get_package_by_pg_and_job_code(pg,jobId)
  
    updatedQuantity=int(jobPacakge[0].located_quantity)+int(data['quantity'])
    jobPacakge.update(located_quantity=str(updatedQuantity))
    
   
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
@token_required
def postTransfer(current_user, *args, **kwargs):
    
    data=request.json
    
    
    
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
            
            
            if item.quantity > 0:
                item_data_aux.append(item)
                
        else:
            item_data_aux.append(item)
    
        
 
    locationData.update(item_data=item_data_aux)
    
    log_data={"itemSKU":itemSKU,"quantity":quantity,"origin":origin,"destination":destination}
    create_log(current_user,"Transfer",log_data)
    # log=Log()
    # log.user_code=current_user
    # log.action="transfer"
    # log.time=str(datetime.datetime.now())
    # log.item_SKU=itemSKU
    # log.quantity=quantity
    # log.origin=origin
    # log.destination=destination
    # log.save()
    
    return ""
    
@process.route('/picking', methods=['GET', 'POST'])
@token_required
def picking_operation(current_user, *args, **kwargs):
    if request.method == 'GET':
        params = request.args
        if 'code' in params and params['code'] != '':
            picking_list = Picking_list.objects(code=params['code']).first()
            if picking_list:
                items = []
                for item in picking_list.items:
                    items.append({
                        "SKU": str(item.SKU),
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
        if (params.get('status')== 'Completed'):#completar picking
            
            Picking_list.set_picking_list_status(params['code'], 'Completed')
            
            return Response(json.dumps(params), mimetype='application/json', status=200)
        else:
            
            Picking_list.set_picked_status(params['code'], params['SKU'], params['location'], params['quantity'])
            Picking_list.check_picking_list_status(params['code'])

            Location_data.update_location(params['location'], params['SKU'], params['quantity'],"delete")
            log_data={"item_SKU":params['SKU'],"quantity":params['quantity'],"location":params['location']}
            create_log(current_user,"Picking",log_data)
            return Response(json.dumps(params), mimetype='application/json', status=200)


    return bad_request("Invalid request method")
        
        
        
        
@process.route('/shipping', methods=['GET','POST']) 
@token_required
def shipping_operations(current_user, *args, **kwargs):


    if request.method == 'GET':
        
        
        lista=Picking_list.get_completed_lists()
        items_list = []
        order_list=[]
        for completed_list in lista:
            for item in completed_list['items']:
                items_list.append({
                    "SKU": item['SKU'],
                    "location": item['location'],
                    "quantity": item['quantity'],
                    "picked": item['picked'],
                    "packed": item['packed'],
                   
                })
        
            order_list.append({
                "code": completed_list['code'],
                "items": items_list
            })
            items_list = []
        
        return Response(json.dumps(order_list), mimetype='application/json', status=200)
    
    if request.method == 'POST':
        params = request.json
        
        
        
        
        if(params.get('operation')=='delete' and params.get('code')):
            
            log_data={"code":params['code'],"items":Picking_list.get_items_by_code(params['code'])}
            create_log(current_user,"Shipping_Completed",log_data)
            Picking_list.delete_picking_list(params['code'])
           
            return Response(json.dumps(params), mimetype='application/json', status=200)
        
        if params.get('code') and params.get('SKU') :
            
            Picking_list.set_picking_list_item_packed(params['code'], params['SKU'], 1)
            return Response(json.dumps(params), mimetype='application/json', status=200)

        
        
        
        
        
        

@process.route('/stat', methods=['GET'])
@token_required
def getStat(current_user, *args, **kwargs):
    params = request.args
    
    if(params.get('action')=="totalObjects"):
        
        return Response(json.dumps({"quantity":Location_data.get_total_quantity_all_locations()}), mimetype='application/json', status=200)
    
    if(params.get('action')=="totalUsers"):
        
        return Response(json.dumps({"quantity":User.get_all_users_number()}), mimetype='application/json', status=200)
    
    if(params.get('action')=="totalLocations"):
        
        return Response(json.dumps({"quantity":Location_data.get_all_locations_number()}), mimetype='application/json', status=200)
    
    if(params.get('action')=="pendingRequests"):
        
        return Response(json.dumps({"quantity":Picking_list.get_pending_lists_number()}), mimetype='application/json', status=200)
    return ""

def create_log(user,action,param):


    
    
    
    
    log=Log()
    log.user_code=user
    log.action=action
    log.time=str(datetime.datetime.now())
    if(param.get('item_SKU')):
        log.item_SKU=param.get('item_SKU')
    if(param.get('quantity')):
        log.quantity=param.get('quantity')
    if(param.get('origin')):
        log.origin=param.get('origin')
    if(param.get('destination')):
        log.destination=param.get('destination')
    if(param.get('jobId')):
        log.jobId=param.get('jobId')
    if(param.get('package_code')):
        log.package_code=param.get('package_code')
    if(param.get('location')):
        log.location=param.get('location')  
    if(param.get('code')):
        log.code=param.get('code')
    if(param.get('items')):
        log.items=param.get('items')
    log.save()
        

@process.route('/users', methods=['GET','POST','DELETE'])
@admin_token_required
def users(current_user, *args, **kwargs):  
    if request.method=='POST':

        data = request.json
        
        if not data.get('code') or not data.get('password') or not data.get('role') or not data.get('dni') or not data.get('name'): 
            return bad_request("Missing Data")
        
        if User.objects(code=data['code']).count() > 0:
            return bad_request("User already exists.")
        
        user = User()
        user.code = data['code']
        user.password = hashpw(data['password'].encode('utf-8'), gensalt()).decode('utf-8')
        user.role = data['role']
        user.DNI = data['dni']
        user.name = data['name']
        user.save()

        return Response(json.dumps({"message": "User created successfully"}), mimetype='application/json', status=201)
    if request.method == 'GET':
        
        users = User.objects()
        users_data = []
        for user in users:
            user_data = {
                "code": user.code,
            }
            users_data.append(user_data)
        return Response(json.dumps(users_data), mimetype='application/json', status=200)

    if request.method == 'DELETE':
        
        code = request.args.get('code')
        
        if not code:
            return Response(json.dumps({"message": "Code parameter is required"}), mimetype='application/json', status=400)
        
        user = User.objects(code=code).first()
        if not user:
            return Response(json.dumps({"message": "User not found"}), mimetype='application/json', status=404)
        
        user.delete()
        return Response(json.dumps({"message": "User deleted successfully"}), mimetype='application/json', status=200)
    
    
    return bad_request("Invalid request method")



@process.route('/jobDelete', methods=['DELETE'])
@admin_token_required
def deleteJob(current_user, *args, **kwargs):
  if request.method == 'DELETE':
        params = request.args
        code=request.args.get('jobId')
        print("====================================")
        print("dentro de delete con code: ",code)
        if not code:
            return Response(json.dumps({"message": "Job ID parameter is required"}), mimetype='application/json', status=400)
        job=Jobs.objects(code=code).first()
        if not job:
            return Response(json.dumps({"message": "Job not found"}), mimetype='application/json', status=404)
        Job_packages.delete_job_packages_by_job_code(code)
        job.delete()
        return Response(json.dumps({"message": "Job deleted successfully"}), mimetype='application/json', status=200)
  


        
@process.route('/jobClose', methods=['PUT'])
@admin_token_required
def closeJob(current_user, *args, **kwargs):
    if request.method == 'PUT':
        print("====================================")
        print("====================================")
        print("====================================")
        print("dentro de put")
        print("valor de request: ",request.args)
        cod=request.args.get('jobId')
        print("valor de code: ",cod)
        if not cod:
            return bad_request("Missing Data")
        job = Jobs.objects(code=cod).first()
        if not job:
            return not_found("Job not found")
        job.update(closed=not job.closed)
        return Response(json.dumps({"message": "Job closed successfully"}), mimetype='application/json', status=200)
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