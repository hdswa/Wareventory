from flask import Flask
from flask_pymongo import PyMongo

mongo=PyMongo()

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY']='FAcuvYKUkTURYhSvaWQs'
    app.config['MONGO_URI']="mongodb://localhost:27017/Wareventory"
    
    mongo.init_app(app)
    
    from .views import views
    from .auth import auth
    
    app.register_blueprint(views,url_prefix='/')
    app.register_blueprint(auth,url_prefix='/')
    
    return app