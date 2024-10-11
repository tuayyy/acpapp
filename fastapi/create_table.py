import asyncpg

# Database connection details
POSTGRES_USER = "temp"
POSTGRES_PASSWORD = "temp"
POSTGRES_DB = "advcompro"
POSTGRES_HOST = "localhost"  # Assuming the host is localhost
POSTGRES_PORT = 5432

# Function to create the client table
async def create_client_table():
    conn = await asyncpg.connect(
        user=POSTGRES_USER,
        password=POSTGRES_PASSWORD,
        database=POSTGRES_DB,
        host=POSTGRES_HOST,
        port=POSTGRES_PORT
    )
    try:
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS client (
                client_id SERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                email VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        print("Table 'client' created successfully.")
    except Exception as e:
        print(f"Failed to create table: {e}")
    finally:
        await conn.close()


# Function to create the food_orders table
async def create_table():
    conn = await asyncpg.connect(
        user=POSTGRES_USER,
        password=POSTGRES_PASSWORD,
        database=POSTGRES_DB,
        host=POSTGRES_HOST,
        port=POSTGRES_PORT
    )
    try:
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS food_orders (
                id SERIAL PRIMARY KEY,
                restaurant_id INTEGER NOT NULL,
                menu_item VARCHAR(255) NOT NULL,
                quantity INTEGER NOT NULL,
                price FLOAT NOT NULL,
                total_price FLOAT NOT NULL
            );
        """)
        print("Table 'food_orders' created successfully.")
    except Exception as e:
        print(f"Failed to create table: {e}")
    finally:
        await conn.close()


# Function to read data from the food_orders table and return as a dictionary
async def read_food_orders():
    conn = await asyncpg.connect(
        user=POSTGRES_USER,
        password=POSTGRES_PASSWORD,
        database=POSTGRES_DB,
        host=POSTGRES_HOST,
        port=POSTGRES_PORT
    )
    try:
        # Fetch all rows from the food_orders table
        rows = await conn.fetch("SELECT * FROM food_orders;")
        # Convert the rows to a list of dictionaries
        orders_dict = [dict(row) for row in rows]
        return orders_dict  # Return the list of dictionaries
    except Exception as e:
        print(f"Failed to read from table: {e}")
        return {}  # Return an empty dictionary in case of an error
    finally:
        await conn.close()


# Main function to create tables and read data
if __name__ == "__main__":
    import asyncio
    # Create the client and food_orders tables
    asyncio.run(create_client_table())
    asyncio.run(create_table())

    # Read data from the food_orders table and print the dictionary
    print("Reading data from food_orders table:")
    orders = asyncio.run(read_food_orders())
    print(orders)
