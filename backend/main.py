from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import util

# Initialize the FastAPI app
app = FastAPI()

# Configure CORS so React can communicate with this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for local development
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],
)

# Load the model and columns exactly once when the file runs
util.load_saved_artifacts()

# Define the exact structure of data we expect from React
class PriceRequest(BaseModel):
    total_sqft: float
    location: str
    bhk: int
    bath: int

# Route 1: Send the list of locations to React for the dropdown menu
@app.get("/get_location_names")
def get_locationss_names():
    return {
        'locations': util.get_locations_names()
    }

# Route 2: Receive data from React and return the predicted price
@app.post("/predict_home_price")
def predict_home_price(request: PriceRequest):
    estimated_price = util.get_estimated_price(
        request.location,
        request.total_sqft,
        request.bath,
        request.bhk
    )
    return {'estimated_price': estimated_price}