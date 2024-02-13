from flask import Blueprint, render_template, request, flash
from .models import User
auth = Blueprint('auth',__name__)

@auth.route('/login',methods=['GET','POST'])
def login():
    if request.method == 'POST':
        user = request.form.get('user')
        password = request.form.get('password')
        
        if User.find_by_code(user) is not None:
            print("I've found a user with the code:",user)
            print("And the data is",User.find_by_code(user))
            
            user_attributes = vars(User.find_by_code(user))  # Get the attributes and their values as a dictionary
            for attribute, value in user_attributes.items():
                print(f"{attribute.capitalize()}: {value}")
                
        else:
            print("The user you are tying to find doesnt exist")
        
        
    return render_template("login.html")

@auth.route('/logout')
def logout():
    return "<p>logout</p>"

@auth.route('/sign_up')
def sign_up():
    return render_template("sign_up.html")

