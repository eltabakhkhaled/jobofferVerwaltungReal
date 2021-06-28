
from flask import Flask, render_template, request, Response, jsonify
from flaskext.mysql import MySQL
from flask_cors import CORS
import json
import requests as request_currency

api_key="85aa5a4fb3533fbae7223f74ccb1befb"
url = "http://data.fixer.io/api/latest?access_key=" +api_key


app = Flask(__name__)
CORS(app)
mysql = MySQL()
app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = ''
app.config['MYSQL_DATABASE_DB'] = 'joboffer'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
mysql.init_app(app)


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/card')
def get_card():
    return render_template('card.html')


@app.route('/product_details')
def product_details():
    return render_template('product-detail.html')


@app.route('/products')
def get_products():
    return render_template('products.html')


@app.route('/profile')
def get_profile():
    return render_template('profile.html')

@app.route('/userload')
def userload():
    return render_template('user_index.html')

@app.route('/useredit')
def get_useredit():
    return render_template('u_edit.html')

@app.route('/currency')
def currency():
    return render_template('currency.html')

@app.route('/user/delete/<u_id>', methods=['DELETE'])
def delete_user(u_id):
    cursor = mysql.connect().cursor()
    cursor.execute("DELETE FROM u_user WHERE u_id = " + u_id)
    cursor.connection.commit()
    deleted_row_count = cursor.rowcount
    cursor.close()
    if deleted_row_count == 1:
        json_dict = {
            'success': True,
            'message': 'User with id ' + u_id + ' deleted'
        }
        json_object = json.dumps(json_dict)
        return Response(json_object, status=200, mimetype='application/json')

    elif deleted_row_count == 0:
        json_dict = {
            'success': False,
            'message': 'There is no User with id ' + u_id
        }
        json_object = json.dumps(json_dict)
        return Response(json_object, status=404, mimetype='application/json')
    else:
        json_dict = {
            'success': False,
            'message': 'More than one User affected'
        }
        json_object = json.dumps(json_dict)
        return Response(json_object, status=400, mimetype='application/json')

@app.route('/login', methods=['GET'])
def check_login():
    username = request.args.get("username")
    password = request.args.get("password")
    cursor = mysql.connect().cursor()
    sqlcommand = "SELECT * FROM u_user WHERE u_username =  '%s' AND u_password = '%s';" % (
        username, password)
    print(sqlcommand)
    cursor.execute(sqlcommand)
    user_row_count = cursor.rowcount

    if user_row_count == 1:
        json_dict = {
            'success': True,
            'message': 'Username and Password accepted'
        }
        json_object = json.dumps(json_dict)
        return Response(json_object, status=200, mimetype='application/json')
    elif user_row_count == 0:
        json_dict = {
            'success': False,
            'message': 'There is no User with given Username and Password: ' + username
        }
        json_object = json.dumps(json_dict)
        return Response(json_object, status=404, mimetype='application/json')
    else:
        json_dict = {
            'success': False,
            'message': 'More than one User has the same Username and Password'
        }
        json_object = json.dumps(json_dict)
        return Response(json_object, status=400, mimetype='application/json')


@app.route('/register', methods=['POST'])
def check_register():
    content = json.loads(request.data)
    cursor = mysql.connect().cursor()
    sqlcommand = "INSERT INTO u_user (u_username,u_password, u_mail) VALUES ('%s', '%s', '%s');" % (
        content["username"], content["password"], content["email"])
    print(sqlcommand)
    cursor.execute(sqlcommand)
    cursor.connection.commit()
    return Response({}, status=200, mimetype='application/json')



@app.route('/user/edit/<id>', methods=['PUT'])
def edit_user(id):
    content = json.loads(request.data)
    cur = mysql.connect().cursor()
    cur.execute(
        "UPDATE u_user SET u_username = %s, u_mail = %s, u_password = %s WHERE u_id = %s",
        (content["username"], content["email"], content["password"], id))
    cur.connection.commit()

    json_dict = {
        'success': True,
        'message': 'User with id ' + id + ' updated'
    }
    json_object = json.dumps(json_dict)
    return Response(json_object, status=200, mimetype='application/json')

@app.route("/currency",methods=['POST','GET'])
def currency_index():
    if request.method == "POST":
        fistCurrency = request.form.get("firstCurrency")
        secondCurrency = request.form.get("secondCurrency")
        amount = request.form.get("amount")
        response = request_currency.get(url)
        app.logger.info(response)
        infos = response.json()
        firstValue = infos["rates"][fistCurrency]
        secondValue = infos["rates"][secondCurrency]
        result = (secondValue/firstValue)*float(amount)
        currencyInfo = dict()
        currencyInfo["firstCurrency"] = fistCurrency
        currencyInfo["secondCurrency"] = secondCurrency
        currencyInfo["amount"] = amount
        currencyInfo["result"] = result
        return render_template("currency.html", info=currencyInfo)
    else:
        return render_template("currency.html")


if __name__ == '__main__':
    app.run()
