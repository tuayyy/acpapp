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

# Define the Pydantic model for incoming client registration data
class ClientRegistration(BaseModel):
    username: str
    password_hash: str
    email: str = None  # Email is optional

# Define the Pydantic model for login data
class ClientLogin(BaseModel):
    username: str
    password_hash: str


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


@app.post("/api/register")
async def register_client(client: ClientRegistration):
    """
    Endpoint to register a new client.
    Inserts the username, password_hash, and email into the client table.
    """
    try:
        # Establish connection to the database
        conn = await connect_db()
        if conn is None:
            raise HTTPException(status_code=500, detail="Database connection failed")

        # Check if the username already exists in the client table
        existing_client = await conn.fetchrow(
            "SELECT * FROM client WHERE username = $1",
            client.username
        )

        if existing_client:
            raise HTTPException(status_code=400, detail="Username already exists")

        # Insert the new client record into the client table
        await conn.execute(
            """
            INSERT INTO client (username, password_hash, email)
            VALUES ($1, $2, $3)
            """,
            client.username, client.password_hash, client.email
        )

        # Close the database connection
        await conn.close()
        return {"message": f"Client '{client.username}' registered successfully"}

    except Exception as e:
        print(f"Error registering client: {e}")
        raise HTTPException(status_code=400, detail=f"Failed to register client: {e}")


@app.post("/api/login")
async def login_client(client: ClientLogin):
    """
    Endpoint to login a client.
    Validates the username and password_hash against the client table.
    """
    try:
        # Establish connection to the database
        conn = await connect_db()
        if conn is None:
            raise HTTPException(status_code=500, detail="Database connection failed")

        # Check if the username exists and the password matches
        existing_client = await conn.fetchrow(
            "SELECT * FROM client WHERE username = $1",
            client.username
        )

        if not existing_client or existing_client['password_hash'] != client.password_hash:
            raise HTTPException(status_code=400, detail="Invalid username or password")

        # Close the database connection
        await conn.close()
        return {"message": f"Client '{client.username}' logged in successfully"}

    except Exception as e:
        print(f"Error logging in client: {e}")
        raise HTTPException(status_code=400, detail=f"Failed to log in: {e}")


# Run the FastAPI app
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
