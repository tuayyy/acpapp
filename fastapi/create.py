# Function to create the client table
import asyncpg
POSTGRES_USER = "temp"
POSTGRES_PASSWORD = "temp"
POSTGRES_DB = "advcompro"
POSTGRES_HOST = "localhost"
POSTGRES_PORT = 5432
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