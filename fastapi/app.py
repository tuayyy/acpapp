# app.py

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import asyncpg
from database import connect_db

app = FastAPI()

# Allow CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Replace with frontend URL if different
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

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
        # Establish connection to the database
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
            new_total_price = existing_order['price'] * new_quantity
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
