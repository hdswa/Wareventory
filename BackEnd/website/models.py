from . import mongo

from mongoengine import StringField,IntField,ListField,FloatField,ReferenceField,\
    ComplexDateTimeField,EmbeddedDocumentField,PULL, EmbeddedDocument,DynamicDocument,DateTimeField
from mongoengine import Document,EmbeddedDocument
from mongoengine import connect,ValidationError

connect(db='Wareventory', uuidRepresentation='standard')

class User(Document):
    code = StringField(required=True)
    password = StringField(required=True)
    rol= StringField(required=True)
    DNI= StringField(required=True)
    name= StringField(required=True)
    
    #db collection name
    meta = {'collection': 'User'}
    
    @classmethod
    def find_by_code(cls, code):
        return cls.objects(code=code).first()

class Jobs(Document):
    code = StringField(required=True)
    supplier = StringField(required=True)
    size = IntField(required=True)
    arrival_method = StringField(required=True)
    descripcion = StringField(required=True)
    closed = StringField(required=True)
    
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
    
class Job_packages(Document):

    job_code = StringField(required=True)
    PG = StringField(required=True)
    item_SKU = IntField(required=True)
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
        job_packages = cls.objects(item_SKU=item_sku)
        job_codes = [job_package.job_code for job_package in job_packages]
        return job_codes
    @classmethod
    def get_job_codes_by_pg(cls, pg):
        job_packages = cls.objects(PG=pg)
        job_codes = [job_package.job_code for job_package in job_packages]
        return job_codes
    
    @classmethod
    def get_package_by_pg_and_job_code(cls, pg, job_code):
        return cls.objects.filter(PG=pg,job_code=job_code).all()
    
        
class Item_data(Document):
    
    SKU=IntField(required=True)
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
    SKU = IntField(required=True)
    quantity = IntField(required=True)
    
class Location_data(Document):  # Class names should follow CamelCase convention
    location = StringField(required=True)
    item_data = ListField(EmbeddedDocumentField(location_array))  # Refer to the corrected class name
    meta = {'collection': 'Location_data'}
    @classmethod
    def get_items_by_location(cls, location):
        return cls.objects.filter(location=location).all()
    

class Log(DynamicDocument):
    user_code = StringField(required=True)
    action = StringField(required=True)
    time = DateTimeField(required=True)
    meta = {'collection': 'Log'}
    
   
   
class Reception_Bascket(DynamicDocument):
    item_SKU = IntField(required=True);
    quantity = IntField(required=True);
    jobId = StringField(required=True);
    PG= StringField(required=True);
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
        