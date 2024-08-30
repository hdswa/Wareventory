import pymongo
import random
import bcrypt
from datetime import datetime, timedelta

client = pymongo.MongoClient("mongodb://localhost:27017") 
db = client['Wareventory']  


fictional_companies = ["StellarSoft Technologies","Quantum Innovations","DreamWorks Solutions","Phoenix Industries","Aurora Innovations","Galactic Systems","Nova Enterprises","Infinity Dynamics","Nexus Innovations","FusionTech Solutions","Titan Innovators","Astral Technologies","Celestial Ventures","Orion Industries","Nebula Systems","Zenith Innovations","Pinnacle Creations","Horizon Solutions","Elysian Enterprises","Paragon Innovators"]
fictional_addresses = ["123 Main Street, Suite 100, City, State, ZIP","456 Elm Avenue, Building A, Town, State, ZIP","789 Oak Road, Floor 2, Village, State, ZIP","101 Sun Lane, Unit 42, Metropolis, State, ZIP","222 Star Boulevard, Room 5, Urban, State, ZIP","333 Space Street, Block C, Mega City, State, ZIP","444 Comet Lane, Office 7, Suburb, State, ZIP","555 Universe Road, Tower 9, Outskirts, State, ZIP","666 Black Hole Avenue, Suite 33, Downtown, State, ZIP","777 Nebula Street, Lab 6, Capital, State, ZIP","888 Planet Drive, Unit 21, Borough, State, ZIP","999 Starship Road, Building 4, District, State, ZIP","111 Galaxy Avenue, Floor 3, Hamlet, State, ZIP","222 Meteor Lane, Office 12, Town Center, State, ZIP","333 Comet Court, Block B, Village, State, ZIP","444 Aurora Avenue, Room 2, Metropolis, State, ZIP","555 Constellation Road, Suite 55, Capital, State, ZIP","666 Eclipse Street, Tower 11, City, State, ZIP","777 Nebula Lane, Lab 3, Downtown, State, ZIP","888 Star Avenue, Suite 18, Suburb, State, ZIP",]
companies_code=[]
NUM_COMPANIES=5
selected_companies = random.sample(fictional_companies,NUM_COMPANIES)
selected_address=random.sample(fictional_addresses,NUM_COMPANIES)


shipment_methods= [
    "Truck Transportation",
    "Railway Transportation",
    "Maritime Transportation",
    "Air Transportation"
]

collections = db.list_collection_names()
# Iterate through the collections and drop them
for collection in collections:
    db[collection].drop()
    
      
def user_generation():
    password = "felipe78".encode('utf-8')  # Convert the password to bytes
    salt = bcrypt.gensalt()  # Generate a salt
    hashed_password = bcrypt.hashpw(password, salt)

    new_user_data = {
    "code":"ESJ75089",
    "password":hashed_password,
    "rol":"admin",
    "DNI":"02767994J",
    "name":"Felipe Ye Chen"
    }
    db_users = db['User'] 
    db_users.insert_one(new_user_data)#usuario


    password="felipe78".encode('utf-8')  # Convert the password to bytes
    salt = bcrypt.gensalt()  # Generate a salt
    hashed_password = bcrypt.hashpw(password, salt)

    aux_user_data={
        "code":"aaa",
        "password":hashed_password,
        "rol":"basic",
        "DNI":"02767994J",
        "name":"Felipe Ye Chen"
    }

    db_users.insert_one(aux_user_data)#usuario
    print("Generated Users")
    
    return True

def normal_user_generation():
    password = "felipe78".encode('utf-8')  # Convert the password to bytes
    salt = bcrypt.gensalt()  # Generate a salt
    hashed_password = bcrypt.hashpw(password, salt)

    for i in range(5):
        code="ESJ75089"+str(i)
        new_user_data = {
        "code":code,
        "password":hashed_password,
        "rol":"basic",
        "DNI":"02767994J",
        "name":"Felipe Ye Chen"
        }
        db_users = db['User'] 
        db_users.insert_one(new_user_data)#usuario
     
    print("Generated Normal Users")
    return True
def clients_generation(n):
    
    db_clients=db['Client']
    for i in range(n):
        code="ES"+str(random.randint(10000,20000))
        name=selected_companies[i]
        phone_number=random.randint(600000000,699999999)
        email=name+"@gmail.com"
        address=selected_address[i]
        new_client_data={
            "code":code,
            "name":name,
            "phone_number":phone_number ,
            "email":email ,
            "address":address
        }
        companies_code.append(code)
        db_clients.insert_one(new_client_data)
        
    print("Generated Clients")
    return True

def delivery_generation():
    db_delivery_companies=db['Delivery_company']
    new_delivery_company={
    "code":"SE01",
    "name":"SEUR",
    "phone_number":"+34668678698",
    "email":"SEUR@gmail.com",
    "address":"C. Gamonal, 6, 28031 Madrid"
    }
    inserted_delivery_companies = db_delivery_companies.insert_one(new_delivery_company)
    print("Generated delivery companies")
    
    return True
   

def jobs_generations(n):
    db_jobs=db['Jobs']
   
    for i in range(n):
        code="ICES"+str(random.randint(100_000_000,200_000_000))
        supplier=companies_code[random.randint(0,len(companies_code)-1)]
        size=random.randint(1,100)
        arrival_method=shipment_methods[random.randint(0,len(shipment_methods)-1)]
        closed=False
        new_job={
            "code":code,
            "supplier":supplier,
            "size":size,
            "arrival_method":arrival_method,
            "descripcion":"Job description",
            "closed":closed
        }
        db_jobs.insert_one(new_job)
    print("Generated jobs")
    return True

def job_packages_generation():
    
    jobs_collection=db['Jobs']
    db_job_packages=db['Job_packages']
    
    for job in jobs_collection.find({"code": {"$exists": True}}):
        
        job_code=job['code']
      
        for i in range(job['size']):
            PG="PG"+str(random.randint(1_000_000,9_999_999))
            item_SKU=random.randint(1_000_000,9_999_999_999)
            expected_quantity=random.randint(1,1500)
            received_quantity=0
            located_quantity=0
            
            new_job_package={
            "job_code":job_code,
            "PG":PG,
            "item_SKU":item_SKU,
            "expected_quantity":expected_quantity,
            "received_quantity":received_quantity,
            "located_quantity":located_quantity
            }          
            db_job_packages.insert_one(new_job_package)
    print("Generated job packages")
    return True

def generate_item_data(n):
    db_item_data=db['Item_data']
    for i in range(n):
        locations=[]
        SKU=random.randint(1_000_000,9_999_999_999)
        for j in range(random.randint(1,6)):
            locations.append(generate_locations())
        image="/"
        height=random.randint(3,30)
        length=random.randint(4,40)
        width=random.randint(5,50)
        weight=height*length*width/10000
        new_item_data={
        "SKU":SKU,
        "locations":locations,
        "image":image,
        "height":height,
        "width":width,
        "length":length,
        "weight":weight
        }
        db_item_data.insert_one(new_item_data)
    print("Generated item data")
    return True

def generate_locations():
    # Generate random numbers for each part
    first_part = f"{random.randint(0, 150):03d}"
    second_part = f"{random.randint(0, 25):02d}"
    third_part = f"{random.randint(0, 9)}"
    fourth_part = f"{random.randint(0, 9)}"

    formatted_number = f"{first_part}.{second_part}.{third_part}.{fourth_part}"
    return formatted_number
def generate_location_data():
    items_collection=db['Item_data']
    db_location_data=db['Location_data']
    new_location_data={
    "location":"042.05.3.3",
    "item_data":[{"SKU":"16698758632554","quantity":50},{"SKU":"1687845531","quantity":100}]
    }
    db_location_data.insert_one(new_location_data)#initial data for db creation
    for item in items_collection.find({"locations": {"$exists": True}}):
        locations=item['locations']
        
        for i in range(len(locations)):
            location=locations[i]
            if(db_location_data.find_one({"location":location})is not None):
                item_data=db_location_data['item_data']
                new_item_data={
                    "SKU":item['SKU'],
                    "quantity":random.randint(1,450)
                }
                filter = {"location":location}
                update = {"$push": {"item_data": new_item_data}}
                db_location_data.update_one(filter, update)
            else:
                item_data=[{"SKU":item['SKU'],"quantity":random.randint(1,450)}]
                new_location_data={
                    "location":location,
                    "item_data":item_data    
                }
                db_location_data.insert_one(new_location_data)
           
    
    print("Generated location data")
    return True

def log_reception_generation(): 
    db_users = db['User'] 
    db_job_packages=db['Job_packages']
    
    for package in db_job_packages.find({"PG": {"$exists": True}}):
        user_code=db_users.find_one({"rol":"basic"})['code']
        package_code=package['PG']
        quantity=package['expected_quantity']
        itemSKU=package['item_SKU']
        actionTime=generate_random_date();
        new_log={
            "user_code":user_code,
            "action":"Reception",
            "time":actionTime,
            "package_code":package_code,
            "item_SKU":itemSKU,
            "quantity":quantity
        }
        db['Log'].insert_one(new_log)
   
    print("Generated log reception") 
    return True



def generate_reception_bascket():
    db_bascket = db['Recetion_bascket'] 
    
    new_data={
        "item_SKU":10,
        "quantity":100,
        "jobId":"ICES127860356",
        "PG":"PG123456789"
    }
    db['Reception_bascket'].insert_one(new_data)
    print("Generated reception bascket")
    return True
    
def generate_random_date():
    # Define start and end dates for the range
    start_date = datetime(2023, 1, 1, 0, 0, 0)
    end_date = datetime(2024, 12, 31, 23, 59, 59)
    
    # Generate a random number of seconds to add to the start date
    seconds_between_dates = int((end_date - start_date).total_seconds())
    random_seconds = random.randint(0, seconds_between_dates)
    
    # Calculate the random date within the specified range
    random_date = start_date + timedelta(seconds=random_seconds)
    
    # Format the date as specified: dd/mm/yy hh:mm:ss
    return random_date.strftime('%d/%m/%y %H:%M:%S')



def generate_picking_list():
    db_item_data = db['Item_data']
    picking_list = []
    i=0
    # Define the number of random items you want to retrieve
    num_items = 50  # Change this number as needed

    # Retrieve random items from the Item_data collection
    random_items = db_item_data.aggregate([{"$sample": {"size": num_items}}])


    for item in random_items:
        # picking_list.append(item['SKU'])
        # print("valor de la primera ubicacion:",item['locations'][0])

        new_picking_item={
            "SKU":item['SKU'],
            "quantity":1,
            "location":item['locations'][0],
            "picked":False
        }
        picking_list.append(new_picking_item)
        i+=1
        if i>=random.randint(1,2):
            code="PL"+str(random.randint(1,100))
            new_shipping_order={
                "code":code,
                "items":picking_list,
                "status":"Pending"
            }
            db['Picking_list'].insert_one(new_shipping_order)
            i=0
            picking_list = []

        

    print("Generated Picking Lists")


    return True

# def generate_shipping_list():
#     db_item_data = db['Item_data']
#     shipping_list = []
#     i=0
#     # Define the number of random items you want to retrieve
#     num_items = 100  # Change this number as needed

#     # Retrieve random items from the Item_data collection
#     random_items = db_item_data.aggregate([{"$sample": {"size": num_items}}])


#     for item in random_items:
#         # shipping_list.append(item['SKU'])
#         # print("valor de la primera ubicacion:",item['locations'][0])

#         new_shipping_item={
#             "SKU":item['SKU'],
#             "quantity":1,
#             "location":item['locations'][0]
#         }
#         shipping_list.append(new_shipping_item)
#         i+=1
#         if i>=random.randint(1,5):
#             code="ES"+str(random.randint(10000,20000))
#             new_shipping_order={
#                 "code":code,
#                 "items":shipping_list,
#                 "client_code":companies_code[random.randint(0,len(companies_code)-1)],
#                 "delivery_company_code":"SE01",
#                 "status":"Pending"
#             }
#             db['Shipping_order'].insert_one(new_shipping_order)
#             i=0
#             shipping_list = []

        

#     print("Generated shipping orders")


#     return shipping_list



user_generation()
normal_user_generation()
clients_generation(5)
delivery_generation()
jobs_generations(50)
job_packages_generation()
generate_item_data(500)
generate_location_data()
log_reception_generation()
generate_reception_bascket()
generate_picking_list()
# generate_shipping_list()
client.close()