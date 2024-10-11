import asyncpg

# Database connection details
POSTGRES_USER = "temp"
POSTGRES_PASSWORD = "temp"
POSTGRES_DB = "advcompro"
POSTGRES_HOST = "localhost"
POSTGRES_PORT = 5432

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


# Function to create the basket table
async def create_basket():
    conn = await asyncpg.connect(
        user=POSTGRES_USER,
        password=POSTGRES_PASSWORD,
        database=POSTGRES_DB,
        host=POSTGRES_HOST,
        port=POSTGRES_PORT
    )
    try:
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS basket(
                food_order SERIAL PRIMARY KEY,
                food_name VARCHAR(50) NOT NULL,
                food_price FLOAT,
                quantity INT NOT NULL
            );
        """)
        print("Table 'basket' created successfully.")
    except Exception as e:
        print(f"Failed to create table: {e}")
    finally:
        await conn.close()


# Function to insert initial values into the basket table
async def insert_into_basket():
    conn = await asyncpg.connect(
        user=POSTGRES_USER,
        password=POSTGRES_PASSWORD,
        database=POSTGRES_DB,
        host=POSTGRES_HOST,
        port=POSTGRES_PORT
    )
    try:
        await conn.execute("""
            INSERT INTO basket (food_name, food_price, quantity) VALUES
            ('Mac Samurai Burger', 9.99, 0),
            ('MacFries', 3.49, 0),
            ('MacNuggets', 5.59, 0),
            ('MacCoca Cola', 2.19, 0);
        """)
        print("Values inserted into 'basket' table successfully.")
    except Exception as e:
        print(f"Failed to insert values: {e}")
    finally:
        await conn.close()


# Function to increment quantity of a specific item in the basket table
async def increment_quantity(food_name: str):
    conn = await asyncpg.connect(
        user=POSTGRES_USER,
        password=POSTGRES_PASSWORD,
        database=POSTGRES_DB,
        host=POSTGRES_HOST,
        port=POSTGRES_PORT
    )
    try:
        await conn.execute("""
            UPDATE basket
            SET quantity = quantity + 1
            WHERE food_name = $1;
        """, food_name)
        print(f"Quantity of '{food_name}' increased by 1.")
    except Exception as e:
        print(f"Failed to increase quantity for '{food_name}': {e}")
    finally:
        await conn.close()


# Functions to increment quantity for each menu item specifically
async def increment_mac_samurai_burger():
    await increment_quantity("Mac Samurai Burger")

async def increment_macfries():
    await increment_quantity("MacFries")

async def increment_macnuggets():
    await increment_quantity("MacNuggets")

async def increment_mac_coca_cola():
    await increment_quantity("MacCoca Cola")


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


# Run the create_client_table function for testing
if __name__ == "__main__":
    import asyncio
    asyncio.run(create_client_table())
