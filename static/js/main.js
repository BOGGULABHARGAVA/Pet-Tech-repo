// Handle Patient Registration
function save_user_registration_details(request_data) {
    // Send data to the backend using AJAX
    $.ajax({
        url: '/user_registration',  // Backend URL to handle patient registration
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        accept: "application/json", 
        data: JSON.stringify(request_data),
        beforeSend: function () {
            // Optional: Add a loading spinner or disable inputs during the request
            alert("Processing registration...");
        },
        success: function (data, status, xhr) {
            if (data.success) {
                console.log("Registration successful!");
                alert(`Registration successful! Your registration number is: ${data.registration_number}`);
            } else {
                console.log("Registration failed:", data.error);
                alert(`Error: ${data.error}`);}
            },
        
        error: function (jqXhr, textStatus, errorMsg) {
            // Handle errors during the registration process
            alert('Error processing the registration. Please try again.');
            console.log(errorMsg);
        }
    });
}
function verify_login_details(login_data) {
    // Send data to the backend using AJAX
    $.ajax({
        url: '/verify_login',  // Backend URL to handle patient registration
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        accept: "application/json", 
        data: JSON.stringify(login_data),
        beforeSend: function () {
            // Optional: Add a loading spinner or disable inputs during the request
            alert("Processing login...");
        },
        success: function (data, status, xhr) {
            if (data.success) {
                console.log("login successful!");
        
                // Use SweetAlert2 for a styled alert
                Swal.fire({
                    title: `Hello ${data.owner_name}!`,
                    text: 'Login successful!',
                    icon: 'success',
                    confirmButtonText: 'Continue',
                    backdrop: true,  // Adds a dim background
                })
                window.location.href = "/verification";;
            } else {
                console.log("Login failed:", data.error);
        
                // Use SweetAlert2 for error
                Swal.fire({
                    title: 'Error',
                    text: data.error,
                    icon: 'error',
                    confirmButtonText: 'Retry',
                });
            }
        },
        
        error: function (jqXhr, textStatus, errorMsg) {
            // Handle errors during the registration process
            alert('Invalid credentials to login. Please try again.');
            console.log(errorMsg);
        }
    });
}

// Trigger registration on button click
document.getElementById("registrationSubmit").addEventListener("click", function(event) {
    event.preventDefault();  // Prevent default behavior (in case it's a form submission)

    // Collect form data
    var ownerName = $("#ownerName").val();
    var ownerEmail = $("#ownerEmail").val();
    var ownerMobile = $("#ownerMobile").val();
    var animalType = $("#animalType").val();
    var animalAge = $("#animalAge").val();
    var password = $("#password").val();



    var request_data = {
        owner_name: ownerName,
        owner_email: ownerEmail,
        owner_mobile: ownerMobile,
        animal_type: animalType,
        animal_age: animalAge,
        password: password
    }

    // Print request data to check it before sending
    console.log("Request Data: ", request_data);

    // Send the data to the server
    save_user_registration_details(request_data);
});



// Trigger login on button click
document.getElementById("loginSubmit").addEventListener("click", function(event) {
    event.preventDefault();  // Prevent default behavior (in case it's a form submission)
    
    // Collect login form data
    var ownerEmail = $("#loginEmail").val();  // Assuming this is the email field for login
    var password = $("#loginPassword").val();  // Assuming this is the password field for login

    // Create request data object
    var login_data = {
        owner_email: ownerEmail,
        password: password
    }

    // Print request data to check it before sending
    console.log("Login Request Data: ", login_data);
    // Send the data to the server
    verify_login_details(login_data);
});
// JavaScript for toggling between registration and login forms
document.getElementById("patientRegistrationTab").addEventListener("click", function(event) {
    event.preventDefault();
    document.getElementById("patientRegistrationTabContainer").style.display = "block";
    document.getElementById("patientLoginTabContainer").style.display = "none";
    document.getElementById("patientRegistrationTab").classList.add("active-tab");
    document.getElementById("patientLoginTab").classList.remove("active-tab");
});

document.getElementById("patientLoginTab").addEventListener("click", function(event) {
    event.preventDefault();
    document.getElementById("patientLoginTabContainer").style.display = "block";
    document.getElementById("patientRegistrationTabContainer").style.display = "none";
    document.getElementById("patientLoginTab").classList.add("active-tab");
    document.getElementById("patientRegistrationTab").classList.remove("active-tab");
});

function uploadPetImage(request_data, auth_token) {
    $.ajax({
        url: 'http://127.0.0.1:20000/upload',  // Flask server URL
        type: "POST",
        dataType: "json",
        contentType: false, // Required for FormData
        processData: false, // Prevent automatic data processing
        accept: "application/json",
        headers: {
            "Authorization": `Bearer ${auth_token}`  // Send the auth token
        },
        data: request_data,
        beforeSend: function () {
            alert("Uploading image...");
        },
        success: function (data, status, xhr) {
            if (data.image_path) {
                console.log("Upload successful!");
                alert(`Diagnosis: ${data.disease}`);
                $("#diagnosisResults").html(`
                    <p><strong>Diagnosis:</strong> ${data.disease}</p>
                    <p><strong>Explanation:</strong> ${data.explanation}</p>
                    <img src="${data.image_path}" width="200">
                `);
            } else {
                console.log("Upload failed:", data.error);
                alert(`Error: ${data.error}`);
            }
        },
        error: function (jqXhr, textStatus, errorMsg) {
            alert('Error processing the upload. Please try again.');
            console.log(errorMsg);
        }
    });
}

// Bind the function to form submission
$("#diseaseForm").submit(function(event) {
    event.preventDefault();

    let formData = new FormData();
    formData.append("file", $("#petImage")[0].files[0]);

    let auth_token = localStorage.getItem("authToken") || "token123";  // Retrieve auth token from storage
    uploadPetImage(formData, auth_token);
});


function book_appointment(request_data) {
    $.ajax({
        url: '/book_appointment',  // Flask backend URL
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        accept: "application/json",
        data: JSON.stringify(request_data),
        beforeSend: function () {
            alert("Processing your appointment...");
        },
        success: function (data) {
            if (data.success) {
                alert(`Appointment booked successfully! Your appointment ID is: ${data.appointment_id}`);
                $("#appointmentForm").hide();

                // Show "What You'll Get" section after booking
                $("#whatYouGetSection").show();

                
            } else {
                alert(`Error: ${data.error}`);
            }
        },
        error: function () {
            alert('Error processing the appointment. Please try again.');
        }
    });
}
// Trigger appointment booking on button click
document.getElementById("bookAppointmentButton").addEventListener("click", function(event) {
    event.preventDefault();  // Prevent default behavior (if inside a form)
    alert("Processing your appointment...");
    // Collect appointment form data
    var name = $("#name").val();
    var email = $("#email").val();
    var mobile = $("#mobile").val();
    var date = $("#date").val();
    var time = $("#time").val();
    var message = $("#message").val();

    var requestData = {
        name: name,
        email: email,
        mobile: mobile,
        date: date,
        time: time,
        message: message
    };

    // Print request data to check it before sending
    console.log("Appointment Request Data: ", requestData);

    // Send the data to the server
    book_appointment(requestData);
});
