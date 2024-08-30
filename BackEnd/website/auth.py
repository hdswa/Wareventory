from flask import Blueprint, request, Response, json, current_app,Flask,session,jsonify
from bcrypt import checkpw
import jwt
import bcrypt
from flask_login import login_user
from .models import User  # Assuming you have a User model
from datetime import datetime, timedelta
from functools import wraps

auth = Blueprint('auth', __name__)


    

@auth.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

  
 
    if not username or not password:
        return bad_request("Username and password are required.")

    user = User.find_by_code(username)  # Assuming you have a method to find a user by username

    if user and bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
        print("valido")

        token = jwt.encode({
            'username': username,
            'expiration': str(datetime.now() + timedelta(days=1)) # Convert datetime to timestamp
        },
        current_app.config['SECRET_KEY'], 
        )

        

        return Response(json.dumps({'token':token}), status=200)
        # return Response(jsonify({'token':token}), status=200)
       
    else:
        return bad_request("Invalid username or password.")

# def generate_jwt(payload):
#     print("======================================")
#     print(current_app.config['SECRET_KEY']," ",current_app.config['ALGORITHM'])
#     jwt_str = jwt.encode(payload, current_app.config['SECRET_KEY'],current_app.config['ALGORITHM'] )
#     if type(jwt_str) is not str: 
#         jwt_str = jwt_str.decode()
#     return jwt_str

# def decode_jwt(token: str):
#     return jwt.decode(token, app.config['SECRET_KEY'], algorithms=app.config['ALGORITHM'] )


def token_required(func):
    @wraps(func)
    def decorated(*args,**kwargs):
        token=request.args.get('token')
        if not token:
            return jsonify({'Alert':'Token is missing'},403)
        try:
            payload=jwt.decode(token,current_app.config['SECRET_KEY'],algorithms=current_app.config['ALGORITHM'])
        except:
            return jsonify({'Alert':'Token is invalid'},403)
        return decorated


#===========================================================================================================================================
ERROR_400_DEFAULT_MSG = "The server cannot or will not process the request."
ERROR_403_DEFAULT_MSG = "You are not allowed to access to this endpoint."
ERROR_404_DEFAULT_MSG = "The requested URL was not found on the server. " \
                        "If you entered the URL manually please check your spelling and try again."
ERROR_429_DEFAULT_MSG = "You have sent too many requests in a given amount of time."
ERROR_500_DEFAULT_MSG = "Something was wrong, please try it again later. " \
                        "If the problem persists please contact with the service provider."
ERROR_504_DEFAULT_MSG = "The server did not get a response in time."

def bad_request(msg: str = ERROR_400_DEFAULT_MSG):
    return Response(json.dumps({
        "message": "{}".format(msg)
    }), status=400)


# 403-forbidden
def forbidden(msg: str = ERROR_403_DEFAULT_MSG):
    return Response(json.dumps({
        "title": "Forbidden",
        "message": "{}".format(msg)
    }), status=403)


# 404-not found
def not_found(msg: str = ERROR_404_DEFAULT_MSG):
    return Response(json.dumps({
        "title": "Not found",
        "message": "{}".format(msg)
    }), status=404)


# 429-Too many request
def too_many_request(msg: str = ERROR_429_DEFAULT_MSG):
    return Response(json.dumps({
        "title": "Too many request",
        "message": "{}".format(msg)
    }), status=429)


# 500-Internal server error
def internal_server_error(msg: str = ERROR_500_DEFAULT_MSG):
    return Response(json.dumps({
        "message": "{}".format(msg)
    }), status=500)


# 504 Gateway Timeout
def gateway_timeout(msg: str = ERROR_504_DEFAULT_MSG):
    return Response(json.dumps({
        "title": "Gateway Timeout",
        "message": "{}".format(msg)
    }), status=504)

