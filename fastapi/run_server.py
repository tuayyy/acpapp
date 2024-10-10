# run_server.py

from http.server import BaseHTTPRequestHandler, HTTPServer
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import asyncio
import asyncpg
from database import connect_db

# Initialize FastAPI application
app = FastAPI()

# Allow CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow requests from your frontend
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

        await conn.close()
        return {"message": message}

    except Exception as e:
        print(f"Error adding order: {e}")
        raise HTTPException(status_code=400, detail=f"Failed to add order: {e}")

# HTTP Request Handler
class RequestHandler(BaseHTTPRequestHandler):
    async def handle_request(self):
        # Convert the request into a FastAPI request
        content_length = int(self.headers["Content-Length"])
        body = self.rfile.read(content_length)
        json_body = json.loads(body.decode("utf-8"))

        # Match the request path and method
        if self.command == "POST" and self.path == "/api/add_order":
            response = await add_order(FoodInsert(**json_body))
            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps(response).encode())
        else:
            self.send_response(404)
            self.end_headers()

    def do_POST(self):
        loop = asyncio.get_event_loop()
        loop.run_until_complete(self.handle_request())

# Set up the HTTP server
def run(server_class=HTTPServer, handler_class=RequestHandler, port=8000):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f"Starting server on port {port}")
    httpd.serve_forever()

# Run the server
if __name__ == "__main__":
    run()
