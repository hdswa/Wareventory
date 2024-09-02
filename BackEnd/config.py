import os

class Config:
    # CONFIG FOR CUSTOM OAUTH SERVER
    SECRET_KEY = "faCUVYkuKTURYhSvaWQs"
    # MONGO_URI = os.getenv('MONGO_URI')
    ALGORITHM = "HS256"
    MONGO_URI="mongodb://localhost:27017"
    # ALGORITHM = os.getenv('ALGORITHM')
    # SESSION_TYPE = os.getenv('SESSION_TYPE')

    # CONFIG FOR MYSQL
    # DEBUG = os.getenv('DEBUG')
    # MYSQL_HOST = os.getenv('MYSQL_HOST')
    # MYSQL_PORT = os.getenv('MYSQL_PORT')
    # MYSQL_USER = os.getenv('MYSQL_USER')
    # MYSQL_PASSWORD = os.getenv('MYSQL_PASSWORD')
    # MYSQL_DB = os.getenv('MYSQL_DB')
    # SQLALCHEMY_DATABASE_URI = "{}://{}:{}@{}:{}/{}".format("mysql", MYSQL_USER, MYSQL_PASSWORD,
    #                                                        MYSQL_HOST, MYSQL_PORT, MYSQL_DB)


# dicicionario apuntando a la clase para coger la informacion de ella  
config = {
        'development': Config
}