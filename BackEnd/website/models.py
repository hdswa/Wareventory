from . import mongo

from mongoengine import StringField,IntField,ListField,FloatField,ReferenceField,\
    ComplexDateTimeField,EmbeddedDocumentField,PULL, EmbeddedDocument,DynamicDocument,DateTimeField,BooleanField
from mongoengine import Document,EmbeddedDocument
from mongoengine import connect,ValidationError
import json

connect(db='Wareventory', uuidRepresentation='standard')

class User(Document):
    code = StringField(required=True)
    password = StringField(required=True)
    role= StringField(required=True)
    DNI= StringField(required=True)
    name= StringField(required=True)
    
    #db collection name
    meta = {'collection': 'User'}
    
    @classmethod
    def find_by_code(cls, code):
        return cls.objects(code=code).first()
    
    @classmethod
    def get_all_users_number(cls):
        return cls.objects().count()
    @property
    def is_active(self):
        # Implement your logic to determine if the user is active
        # For example, you can return True if the user is active
        return True
    
    

class Jobs(Document):
    code = StringField(required=True)
    supplier = StringField(required=True)
    size = IntField(required=True)
    arrival_method = StringField(required=True)
    descripcion = StringField(required=True)
    closed = BooleanField(default=False)
    
    #db collection name
    meta = {'collection': 'Jobs'}
    
    @classmethod
    def find_by_code(cls, code):
        return cls.objects(code=code).first()
    @classmethod
    def last_jobs(cls, n):
        return cls.objects().order_by('-date').limit(n)
    @classmethod
    def find_by_supplier(cls, supplier):
        job_packages = cls.objects(supplier=supplier)
        job_codes = [job_package.code for job_package in job_packages]
        return job_codes
    @classmethod
    def get_all_jobs(cls):
        return cls.objects().all()
    
    @classmethod
    def delete_job(cls, code):
        job = cls.objects(code=code).first()
        if job:
            job.delete()
            return True
        return False

    
class Job_packages(Document):

    job_code = StringField(required=True)
    PG = StringField(required=True)
    item_SKU = StringField(required=True)
    expected_quantity = StringField(required=True)
    received_quantity = StringField(required=True)
    located_quantity = StringField(required=True)
    #db collection name
    meta = {'collection': 'Job_packages'}
    
    @classmethod
    def get_package_by_job_code(cls, job_code):
        return cls.objects.filter(job_code=job_code).all()
    @classmethod
    def get_job_codes_by_item_sku(cls, item_sku):
        print("Inside the function===================================")
        
        # Print the input item_sku
        print(f"Input item_sku: {item_sku}")
        
        # Perform the query
        job_packages = cls.objects(item_SKU=item_sku)
        
        # Print the raw query result
        print("Raw query result:", job_packages)
        
        # Check if any job packages were found
        if not job_packages:
            print("No job packages found for the given item_sku.")
        
        # Iterate through the job packages and print details
        for job_package in job_packages:
            print(f"Comparing item_SKU: {job_package.item_SKU} with input item_sku: {item_sku}")
        
        # Extract job codes
        job_codes = [job_package.job_code for job_package in job_packages]
        
        # Print the extracted job codes
        print(f"Extracted job codes: {job_codes}")
        
        return job_codes
    @classmethod
    def get_job_codes_by_pg(cls, pg):
        job_packages = cls.objects(PG=pg)
        job_codes = [job_package.job_code for job_package in job_packages]
        return job_codes
    
    @classmethod
    def get_package_by_pg_and_job_code(cls, pg, job_code):
        return cls.objects.filter(PG=pg,job_code=job_code).all()
    @classmethod
    def delete_job_packages_by_job_code(cls, code):
        job_packages = cls.objects(job_code=code)
        for job_package in job_packages:
            job_package.delete()
        return True
        
class Item_data(Document):
    
    SKU=StringField(required=True)
    locations=ListField(StringField())
    image=StringField(required=True,default="")
    height=IntField(required=True,default=0)
    width=IntField(required=True,default=0)
    length=IntField(required=True,default=0)
    weight=FloatField(required=True,default=0)
    #db collection name
    meta = {'collection': 'Item_data'}
    @classmethod
    def get_product_locations_by_sku(cls, sku):
        return cls.objects(SKU=sku).first()


class location_array(EmbeddedDocument):  # Changed from Document to EmbeddedDocument
    SKU = StringField(required=True)
    quantity = IntField(required=True)
    
class Location_data(DynamicDocument):
    location = StringField(required=True)
    item_data = ListField(EmbeddedDocumentField(location_array))  # Refer to the corrected class name
    meta = {'collection': 'Location_data'}
    
    @classmethod
    def get_items_by_location(cls, location):
        return cls.objects.filter(location=location).all()
    
    @classmethod 
    def update_location(cls, location, sku, quantity, operation):
        if operation == "delete":
            location_data = cls.objects(location=location).first()
            for item in location_data.item_data:
                if str(item.SKU) == str(sku):
                    print("item correcto")
                    item.quantity -= int(quantity)
                    print(f"Updated item: SKU={item.SKU}, quantity={item.quantity}")
                    
                    # Ensure SKU is a string before saving
                    for item in location_data.item_data:
                        if not isinstance(item.SKU, str):
                            item.SKU = str(item.SKU)
                        print(f"Type of SKU: {type(item.SKU)}, Type of quantity: {type(item.quantity)}")
                    
                    location_data.save()
                    return True
        return False
    @classmethod
    def get_total_quantity(cls, location, sku):
        location_data = cls.objects(location=location).first()
        for item in location_data.item_data:
            if str(item.SKU) == str(sku):
                return item.quantity
        return 0

    @classmethod
    def get_total_quantity_all_locations(cls):
        total_quantity = 0
        all_locations = cls.objects()
        for location_data in all_locations:
            for item in location_data.item_data:
                total_quantity += item.quantity
        return total_quantity
    
    @classmethod
    def get_all_locations_number(cls):
        return cls.objects().count()

class Log(DynamicDocument):
    user_code = StringField(required=True)
    action = StringField(required=True)
    time = DateTimeField(required=True)
    meta = {'collection': 'Log'}
    
   
   
class Reception_Bascket(DynamicDocument):
    item_SKU = StringField(required=True)
    quantity = IntField(required=True)
    jobId = StringField(required=True)
    PG= StringField(required=True)
    meta = {'collection': 'Reception_bascket'}    

    @classmethod
    def getReceptionBascketBySKU(cls, sku):
        return cls.objects.filter(item_SKU=sku).all()
    
    @classmethod
    def removeOneReceptionBascketByParams(cls, sku, jobId, PG,quantity):
        bascket = cls.objects(item_SKU=sku,jobId=jobId,PG=PG,quantity=quantity).first()
        if bascket:
            bascket.delete()
            return True  # Indicate success
        return False  # Indicate failure (no such bascket found)
        

class Picking_items(EmbeddedDocument):
    SKU = StringField(required=True)
    location = StringField(required=True)
    quantity = IntField(required=True)
    picked = BooleanField(default=False)
    packed=BooleanField(default=False)

class Picking_list(Document):
    code = StringField(required=True)
    items = ListField(EmbeddedDocumentField(Picking_items))
    status = StringField(required=True)
    meta = {'collection': 'Picking_list'}

    @classmethod
    def get_all_codes(cls):
        print("getting all the code and status")
        return [{'code': obj.code, 'status': obj.status} for obj in cls.objects.only('code', 'status')]

    @classmethod
    def set_picked_status(cls, code, sku, location, quantity):
        picking_list = cls.objects(code=code).first()
        if picking_list:
            print("valores de parametros")
            print(f"code: {code}, sku: {sku}, location: {location}, quantity: {quantity}")
            for item in picking_list.items:
                # print(f"Checking item - SKU: {item.SKU}, location: {item.location}, quantity: {item.quantity}, picked: {item.picked}")
                if str(item.SKU) == str(sku) and item.location == location and int(item.quantity) == int(quantity):
                    item.picked = True
                    print("Item matched and set to picked")
            # Ensure all SKUs are strings before saving
            for item in picking_list.items:
                item.SKU = str(item.SKU)
            picking_list.save()
            return True  # Indicate success
        print("No matching item found or picking list not found")
        return False  # Indicate failure (no such item found)
    
    @classmethod
    def check_picking_list_status(cls, code):
       
        picking_list = cls.objects(code=code).first()
        if picking_list:
            for item in picking_list.items:
                print("valor de picked:",item.picked)
                if not item.picked:
                    return False
                if item.picked:
                    picking_list.status = "In Progress"
                    picking_list.save()

            picking_list.status = "Picked"
            picking_list.save()
            return True
        return False
    @classmethod
    def set_picking_list_status(cls, code, status):
        picking_list = cls.objects(code=code).first()
        if picking_list:
            picking_list.status = status
            picking_list.save()
            return True
        return False
    
    @classmethod 
    def set_picking_list_item_packed(cls, code, sku, quantity):
        print("dentro de la funcion")
        picking_list = cls.objects(code=code).first()
        if picking_list:
            for item in picking_list.items:
                if str(item.SKU) == str(sku):
                    item.quantity-=quantity
                    if item.quantity==0:
                        item.packed = True
           
            for item in picking_list.items:
                item.SKU = str(item.SKU)
            picking_list.save()
            return True

    @classmethod
    def get_pending_lists_number(cls):
        return cls.objects(status='Pending').count()   
    @classmethod
    def get_completed_lists(cls):
        return [{'code': obj.code, 'items': obj.items} for obj in cls.objects.filter(status='Completed').only('code', 'items')]
    @classmethod
    def delete_picking_list(cls, code):
        print("entrando en borrar")
        picking_list = cls.objects(code=code).first()
        if picking_list:
            picking_list.delete()
            return True
        return False

    @classmethod
    def get_items_by_code(cls, code):
        picking_list = cls.objects(code=code).first()
        if picking_list:
            items = picking_list.items
            item_list = []
            for item in items:
                item_list.append({'SKU': item.SKU, 'location': item.location})    
            return json.dumps(item_list)

        return None

class Shipping_item(Document):
    code = StringField(required=True)

class Shipping_item(Document):
    code= StringField(required=True)
class Shipping_Order(Document):
    code= StringField(required=True)
