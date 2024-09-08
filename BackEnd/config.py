import os

class Config:

    SECRET_KEY = "faCUVYkuKTURYhSvaWQs"
    ALGORITHM = "HS256"
    MONGO_URI="mongodb://localhost:27017"



# dicicionario apuntando a la clase para coger la informacion de ella  
config = {
        'development': Config
}