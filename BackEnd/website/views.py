from flask import Blueprint, render_template,session,redirect,url_for
from.models import Jobs,Log
views = Blueprint('views',__name__)

# @views.route('/',methods=['GET','POST'])
# def home():
#     if 'user' in session:
#         return render_template("home.html")
#     else:
#         return redirect(url_for('auth.login'))



@views.route('/inventory',methods=['GET'])
def inventory():
    jobs=Jobs.objects()
    return render_template("inventory.html",jobs=jobs)

@views.route('/product_search',methods=['GET'])
def product_search():
    jobs=Jobs.last_jobs(20)
    return render_template("product_search.html",jobs=jobs)

