from . import mongo

class User:
    def __init__(self, code, password, rol, DNI, Name):
        self.code = code
        self.password = password
        self.rol = rol
        self.DNI = DNI
        self.Name = Name

    def save(self):
        user_data = {
            'code': self.code,
            'password': self.password,
            'rol': self.rol,
            'DNI': self.DNI,
            'Name': self.Name
        }
        mongo.db.users.insert_one(user_data)

    @classmethod
    def find_by_code(cls, code):
        user_data = mongo.db.users.find_one({'code': code})
        if user_data:
            return cls(
                code=user_data['code'],
                password=user_data['password'],
                rol=user_data['rol'],
                DNI=user_data['DNI'],
                Name=user_data['Name']
            )
        return None
