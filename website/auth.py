from flask import Blueprint, render_template, request, flash,session
from .models import User
from bcrypt import checkpw, gensalt, hashpw
auth = Blueprint('auth',__name__)


@auth.route('/login',methods=['GET','POST'])
def login():
    error = None
    user_code = None
    if request.method == 'POST':
        user_code = request.form.get('user')
        password = request.form.get('password')
    
        user = User.find_by_code(user_code)
        if user is not None:
            password_to_check = password.encode('utf-8')  # Convert the password to bytes
            if checkpw(password_to_check, user.password.encode('utf-8')):
                return "<p>Logged in</p>"
            else:
                error = "Invalid password"
        else:
            error = "Invalid user"
        
    return render_template("login.html", error=error, user_code=user_code)

@auth.route('/logout')
def logout():
    return "<p>logout</p>"

@auth.route('/sign_up')
def sign_up():
    return render_template("sign_up.html")

