from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import schemas
import fsd_backend_db as fsd_db

# Initialize FastAPI application
app = FastAPI()

# Define allowed origins (you can adjust these based on your frontend's URL)
origins = [
    "http://localhost",  # Localhost for development
    "http://localhost:5000",  # Frontend running on port 3000 (React, Vue, etc.)
    # Add any other domains or ports that need to access the backend
]

# Add CORSMiddleware to the application
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allow all origins specified in the list
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

@app.post("/save_user_registration_details")
async def save_user_registration_details(reg_details: schemas.UserRegistration):
    """
    Handles the user registration by validating input data 
    and saving the details into the database.

    Args:
        reg_details (schemas.UserRegistration): Validated registration details from the request.

    Returns:
        dict: A success message with registration details or error message.
    """
    try:
        # Print received registration details (for debugging purposes)
        print(f"Received registration details: {reg_details}")

        # Save registration details to the database
        result = fsd_db.save_user_registration_details(reg_details)

        # Check if result is successful (optional, depending on your db function)
        if result:
            return {"message": "Registration successful", "details": result}
        else:
            raise HTTPException(status_code=400, detail="Failed to save registration details")

    except Exception as e:
        # Handle exceptions and return HTTP error with detailed message
        print(f"Error: {str(e)}")  # Logging the error for debugging
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

@app.post("/verify_login")
async def verify_login(login_data: schemas.LoginRequest):
    try:
        # Print received registration details (for debugging purposes)
        print(f"Received login details: {login_data}")

        # Save registration details to the database
        result = fsd_db.verify_user_login_details(login_data)

        # Check if result is successful (optional, depending on your db function)
        if result:
            return {"message": "login successful", "details": result}
        else:
            raise HTTPException(status_code=400, detail="Failed to save registration details")

    except Exception as e:
        # Handle exceptions and return HTTP error with detailed message
        print(f"Error: {str(e)}")  # Logging the error for debugging
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
