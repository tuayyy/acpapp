from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import asyncpg
from database import connect_db  # Assuming connect_db is defined in database.py to establish asyncpg connection

app = FastAPI()

# Allow CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Replace with frontend URL if different
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Pydantic models for incoming rating data
class McDonaldRatingData(BaseModel):
    restaurant_name: str
    rating: float  # Support float ratings (e.g., 1.5, 2.5)

class KfcRatingData(BaseModel):
    restaurant_name: str
    rating: float  # Support float ratings (e.g., 1.5, 2.5)

# Endpoint to handle McDonald's ratings
@app.post("/api/submit_mcdonald_rating")
async def submit_mcdonald_rating(data: McDonaldRatingData):
    """
    Endpoint to submit a rating for McDonald's restaurant.
    """
    try:
        # Establish connection to the database using the `connect_db()` function from `database.py`
        conn = await connect_db()
        if conn is None:
            raise HTTPException(status_code=500, detail="Database connection failed")

        # Insert the rating into the mcdonald_ratings table
        await conn.execute(
            """
            INSERT INTO mcdonald_ratings (restaurant_name, rating)
            VALUES ($1, $2)
            """,
            data.restaurant_name, data.rating  # Insert float rating value for McDonald's
        )

        # Close the database connection
        await conn.close()
        return {"message": "McDonald's rating submitted successfully."}

    except Exception as e:
        print(f"Error submitting McDonald's rating: {e}")
        raise HTTPException(status_code=500, detail="Failed to submit McDonald's rating.")

# Endpoint to handle KFC ratings
@app.post("/api/submit_kfc_rating")
async def submit_kfc_rating(data: KfcRatingData):
    """
    Endpoint to submit a rating for KFC restaurant.
    """
    try:
        # Establish connection to the database using the `connect_db()` function from `database.py`
        conn = await connect_db()
        if conn is None:
            raise HTTPException(status_code=500, detail="Database connection failed")

        # Insert the rating into the kfc_ratings table
        await conn.execute(
            """
            INSERT INTO kfc_ratings (restaurant_name, rating)
            VALUES ($1, $2)
            """,
            data.restaurant_name, data.rating  # Insert float rating value for KFC
        )

        # Close the database connection
        await conn.close()
        return {"message": "KFC rating submitted successfully."}

    except Exception as e:
        print(f"Error submitting KFC rating: {e}")
        raise HTTPException(status_code=500, detail="Failed to submit KFC rating.")

# Define the Pydantic model for incoming order data
class FoodInsert(BaseModel):
    restaurant_id: int
    menu_item: str
    quantity: int
    price: float
    total_price: float

@app.post("/api/add_order")
async def add_order(order: FoodInsert):
    """
    Endpoint to add or update a food order.
    """
    try:
        # Establish connection to the database using the `connect_db()` function from `database.py`
        conn = await connect_db()
        if conn is None:
            raise HTTPException(status_code=500, detail="Database connection failed")

        # Check if the item already exists in the database for this restaurant
        existing_order = await conn.fetchrow(
            "SELECT * FROM food_orders WHERE restaurant_id = $1 AND menu_item = $2",
            order.restaurant_id, order.menu_item
        )

        if existing_order:
            # If it exists, update the quantity and total price
            new_quantity = existing_order['quantity'] + order.quantity
            new_total_price = order.price * new_quantity  # Ensure you use the current price
            await conn.execute(
                """
                UPDATE food_orders
                SET quantity = $1, total_price = $2
                WHERE restaurant_id = $3 AND menu_item = $4
                """,
                new_quantity, new_total_price, order.restaurant_id, order.menu_item
            )
            message = f"Updated {order.menu_item} quantity to {new_quantity}"
        else:
            # If it doesn't exist, insert the new order
            await conn.execute(
                """
                INSERT INTO food_orders (restaurant_id, menu_item, quantity, price, total_price)
                VALUES ($1, $2, $3, $4, $5)
                """,
                order.restaurant_id, order.menu_item, order.quantity, order.price, order.total_price
            )
            message = f"Inserted {order.menu_item} with quantity {order.quantity}"

        # Close the database connection
        await conn.close()
        return {"message": message}

    except Exception as e:
        print(f"Error adding order: {e}")
        raise HTTPException(status_code=400, detail=f"Failed to add order: {e}")
