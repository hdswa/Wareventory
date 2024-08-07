import pymongo

client = pymongo.MongoClient("mongodb://localhost:27017") 
db = client['Wareventory']  

collections = db.list_collection_names()
# Iterate through the collections and drop them
for collection in collections:
    db[collection].drop()
    
# Choose the collection


# Insert a single document
new_user_data = {
    "code":"ESJ75089",
    "password":"felipe78",
    "rol":"admin",
    "DNI":"02767994J",
    "name":"Felipe Ye Chen"
}


new_client_data= {
    "code":"CN10482",
    "name":"SHUNFA",
    "phone_number":"+861402564874539" ,
    "email":"SHUNGA@netease.com"  ,
    "address":"BaiYun street, Guangzhou, Huadu"
}
new_delivery_company={
    "code":"SE01",
    "name":"SEUR",
    "phone_number":"+34668678698",
    "email":"SEUR@gmail.com",
    "address":"C. Gamonal, 6, 28031 Madrid"
}

new_job={
    "code":"ICCN154026845",
    "supplier":"CN10482",
    "size":60,
    "arrival_method":"Trailer_Truck",
    "closed":False
}

new_job_package={
    "job_code":"ICCN154026845",
    "PG":"PG144253486",
    "item_SKU":"16698758632554",
    "expected_quantity":100,
    "received_quantity":0,
    "located_quantity":0
}
new_item_data={
    "SKU":"16698758632554",
    "locations":["042.05.3.3","012.10.1.1"],
    "quantity":50,
    "image":"link",
    "height":10,
    "width":50,
    "depth":20,
    "weight":12
}

new_location_data={
    "location":"042.05.3.3",
    "item_data":[{"SKU":"16698758632554","quantity":50},{"SKU":"1687845531","quantity":100}]
}



db_users = db['users']  # Replace with your collection name
db_clients=db['clients']
db_delivery_companies=db['delivery_companies']
db_jobs=db['jobs']
db_job_packages=db['job_packages']
db_item_data=db['item_data']
db_location_data=db['location_data']




inserted_user = db_users.insert_one(new_user_data)

inserted_clients = db_clients.insert_one(new_client_data)

inserted_delivery_companies = db_delivery_companies.insert_one(new_delivery_company)

inserted_jobs = db_jobs.insert_one(new_job)

inserted_job_pakcages = db_job_packages.insert_one(new_job_package)

inserted_item_data = db_item_data.insert_one(new_item_data)

inserted_location = db_location_data.insert_one(new_location_data)

client.close()
