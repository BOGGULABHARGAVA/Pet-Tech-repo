from flask import Flask, render_template, request, jsonify
import os
import requests
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import base64



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
    

@app.route("/upload", methods=['POST'])
def upload_image():
    FASTAPI_URL = "http://127.0.0.1:20000/upload"
    if 'file' not in request.files:
        return jsonify({"success": False, "error": "No file provided"}), 400

    file = request.files['file']

    # Forward the image as FormData to FastAPI
    files = {'file': (file.filename, file.stream, file.mimetype)}
    response = requests.post(FASTAPI_URL, files=files)

    if response.status_code == 200:
        return jsonify(response.json())  # Return FastAPI response
    else:
        return jsonify({"success": False, "error": "Failed to process the image"}), 400
    
@app.route('/book_appointment', methods=['POST'])
def book_appointment():
    url =  'http://127.0.0.1:20000/save_appointment/'
    try:
        data = request.json  # Get appointment data
        name = data.get('name')
        email = data.get('email')
        mobile = data.get('mobile')
        date = data.get('date')
        time = data.get('time')
        message = data.get('message')

        # Generate a unique appointment ID
        appointment_id = f"APT-{hash(name + email + date + time) % 10000:04d}"
        
        # Send confirmation email
        send_email(email, name, date, time, appointment_id)
        request_data={
            "name": name,
            "email": email,
            "mobile": mobile,
            "date": date,
            "time": time,
            "message": message,
            "appointment_id": appointment_id
        }

        # Send appointment details to FastAPI for database storage
        response = post_api_function(url,request_data )

        # Check if FastAPI saved the data successfully
        if response and response.status_code == 200:
            response_data = response.json()
            return jsonify(response_data)
        else:
            return jsonify({"success": False, "error": "Failed to save appointment in database."})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

def send_email(to_email, name, date, time, appointment_id):
    sender_email = "boggulabhargavateja2004@gmail.com"  
    sender_password = "hjaw sxwe qjaq qlcq"  # Use an App Password if using Gmail

    subject = "Appointment Confirmation"
    body = f"""
    Hello {name},

    Your appointment has been successfully booked.

    📅 Date: {date}  
    🕒 Time: {time}  
    📌 Appointment ID: {appointment_id}  

    Please arrive 10 minutes before your scheduled time.  

    Best Regards,  
    Your Appointment Team
    """

    # Setup email message
    msg = MIMEMultipart()
    msg["From"] = sender_email
    msg["To"] = to_email
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain"))

    try:
        # Connect to SMTP server
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, to_email, msg.as_string())
        server.quit()
        print("Email sent successfully!")
    except Exception as e:
        print("Error sending email:", str(e))

if __name__ == "__main__":
    app.run(debug=True,port=5000)
