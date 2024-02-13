from . import mongo

from mongoengine import StringField,IntField,ListField,FloatField,ReferenceField,\
    ComplexDateTimeField,EmbeddedDocumentField,PULL
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
    