from flask import Flask, render_template, request, jsonify
import os
import requests

app = Flask(__name__)

@app.route('/')
def homePage():
    return render_template('homePage.html')

@app.route('/loginPage', methods=['GET', 'POST'])
def loginPage():
    if request.method == 'POST':
        # Handle the POST request here
        return "POST request received at loginPage"
    return render_template('loginPage.html')  # Render the login page for GET requests


@app.route('/verification')
def verification():
    return render_template('verification.html')

@app.route('/aboutPage')
def aboutPage():
    return render_template('aboutPage.html')  # Add this route for the About page
@app.route('/contact')
def contact():
    return render_template('contact.html')



@app.route('/suggestions')
def suggestions():
    return render_template('suggestions.html')

def post_api_function(url, data):
    response = ''
    try:
        response = requests.post(url, json=data)
        print(response)
    except Exception as e:
        print('An exception', e,'Occured')
    return response

def get_api_function(url):
    response = ''
    try:
        response = requests.get(url)
        print(response)
    except Exception as e:
        print('An exception', e,'Occured')
    return response
@app.route('/user_registration', methods=['POST'])
def user_registration():
    if request.is_json:
        request_data = request.get_json()  # Get the JSON data sent in the request
        url = 'http://localhost:20000/save_user_registration_details'
        
        # Forward the data to the FastAPI backend
        response = post_api_function(url, request_data)
        if response and response.status_code == 200:
            response_data = response.json()

            registration_details = response_data.get("details", None)
            registration_number=registration_details["registration_number"]

            if registration_number:
                return jsonify({"success": True, "registration_number": registration_number})
            else:
                return jsonify({"success": False, "error": "Registration successful but missing registration number"}), 400
        else:
            return jsonify({"success": False, "error": "Failed to save data"}), 400
    else:
        return jsonify({"success": False, "error": "Request must be in JSON format"}), 400

@app.route("/verify_login",methods=['post'])
def verify_login_details():
    if request.is_json:
        request_data = request.get_json()  # Get the JSON data sent in the request
        url = 'http://localhost:20000/verify_login'
        
        # Forward the data to the FastAPI backend
        response = post_api_function(url, request_data)
        if response and response.status_code == 200:
            response_data = response.json()

            login_details1 = response_data.get("details", None)
            login_details=login_details1["details"]
            owner_name=login_details["owner_name"]

            if login_details:
                return jsonify({"success": True, "owner_name": owner_name})
            else:
                return jsonify({"success": False, "error": "login successful but missing owner_name "}), 400
        else:
            return jsonify({"success": False, "error": "Failed to save data"}), 400
    else:
        return jsonify({"success": False, "error": "Request must be in JSON format"}), 400

if __name__ == "__main__":
    app.run(debug=True,port=5000)
