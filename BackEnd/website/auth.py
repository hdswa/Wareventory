from flask import Blueprint,Flask, render_template, request, Response,session,redirect,url_for,json,current_app
from flask_cors import cross_origin,CORS 
from .models import User
from bcrypt import checkpw, gensalt, hashpw
from datetime import datetime as dt, timedelta
import jwt

auth = Blueprint('auth',__name__)

@auth.route('/login',methods=['POST'])
@cross_origin()
def login():
    error = None
    user_code = None
    if request.method == 'POST':
        
        user_code = request.json.get('username')
        password = request.json.get('password')
        
        user = User.find_by_code(user_code)
        
        print(user);
        if user is not None:
            password_to_check = password.encode('utf-8')  # Convert the password to bytes
            if checkpw(password_to_check, user.password.encode('utf-8')):
                session['user'] = user_code
                
                # print("secret key")
                # print(current_app.config['SECRET_KEY'])
                token_info = generate_jwt({
                            "user": user.name,
                            "user-role": user.rol,
                            "curr_time": dt.now().strftime("%y-%m-%d %H:%M:%S"),
                            "exp_time": (dt.now() + timedelta(minutes=30)).strftime("%y-%m-%d %H:%M:%S")
                        })
                return Response(json.dumps({
                    "message": "Login successful",
                    "token":token_info
                }), status=200)
            
            else:
                return forbidden()
        else:
           return not_found()
        
    return bad_request()




def generate_jwt(payload):
    print("======================================")
    print(current_app.config['SECRET_KEY']," ",current_app.config['ALGORITHM'])
    jwt_str = jwt.encode(payload, current_app.config['SECRET_KEY'],current_app.config['ALGORITHM'] )
    if type(jwt_str) is not str: 
        jwt_str = jwt_str.decode()
    return jwt_str

def decode_jwt(token: str):
    return jwt.decode(token, app.config['SECRET_KEY'], algorithms=app.config['ALGORITHM'] )




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

