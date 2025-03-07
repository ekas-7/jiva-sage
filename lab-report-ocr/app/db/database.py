import logging
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ServerSelectionTimeoutError
from app.core.config import settings

logger = logging.getLogger(__name__)

class Database:
    client: AsyncIOMotorClient = None
    
    async def connect_to_database(self):
        """Create database connection."""
        logger.info("Connecting to MongoDB")
        try:
            # Create client with updated parameters for MongoDB Atlas
            # Using the newer connection parameter style
            self.client = AsyncIOMotorClient(
                settings.MONGODB_URL,
                tlsAllowInvalidCertificates=True,
                serverSelectionTimeoutMS=5000
            )
            
            # Verify connection is successful
            await self.client.admin.command('ping')
            logger.info("Connected to MongoDB")
        except ServerSelectionTimeoutError as e:
            logger.error(f"Could not connect to MongoDB: {e}")
            # Continue without MongoDB - allow the app to start even if DB connection fails
            logger.warning("Application will continue without database connection. Some features may not work.")
    
    async def close_database_connection(self):
        """Close database connection."""
        logger.info("Closing connection to MongoDB")
        if self.client:
            self.client.close()
            logger.info("MongoDB connection closed")
    
    def get_db(self):
        """Get database instance."""
        if self.client:
            return self.client[settings.MONGODB_DB_NAME]
        else:
            logger.warning("Database connection not available")
            return None


# Create a database instance
db = Database()


# Dependency to get the database in route handlers
async def get_database():
    if db.client is None:
        logger.warning("Database connection not available, attempting to reconnect")
        await db.connect_to_database()
    
    database = db.get_db()
    if database is None:
        logger.error("Failed to get database connection")
        # Return empty object that won't break calls but won't work with DB
        class DummyDB:
            async def __getattr__(self, name):
                return DummyCollection()
        
        class DummyCollection:
            async def find_one(self, *args, **kwargs):
                return None
            
            async def find(self, *args, **kwargs):
                class EmptyCursor:
                    def __aiter__(self):
                        return self
                    
                    async def __anext__(self):
                        raise StopAsyncIteration
                
                return EmptyCursor()
            
            async def insert_one(self, *args, **kwargs):
                class DummyResult:
                    @property
                    def inserted_id(self):
                        return "dummy_id"
                
                return DummyResult()
            
            async def count_documents(self, *args, **kwargs):
                return 0
        
        return DummyDB()
    
    return database