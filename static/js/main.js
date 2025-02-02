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