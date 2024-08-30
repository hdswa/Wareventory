from flask import Flask
from flask_pymongo import PyMongo
from config import config
from flask_cors import CORS

mongo=PyMongo()

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY']=config['development'].SECRET_KEY
    app.config['MONGO_URI']=config['development'].MONGO_URI
    app.config['ALGORITHM']=config['development'].ALGORITHM
    
    mongo.init_app(app)
    
    from .views import views
    from .auth import auth
    from .process import process
    
    app.register_blueprint(views,url_prefix='/')
    CORS(app)
    app.register_blueprint(auth,url_prefix='/')
    CORS(app)
    app.register_blueprint(process,url_prefix='/')

    CORS(app)
    
    return app