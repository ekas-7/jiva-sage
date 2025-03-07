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
            self.client = AsyncIOMotorClient(settings.MONGODB_URL)
            # Verify connection is successful
            await self.client.admin.command('ping')
            logger.info("Connected to MongoDB")
        except ServerSelectionTimeoutError as e:
            logger.error(f"Could not connect to MongoDB: {e}")
            raise
    
    async def close_database_connection(self):
        """Close database connection."""
        logger.info("Closing connection to MongoDB")
        if self.client:
            self.client.close()
            logger.info("MongoDB connection closed")
    
    def get_db(self):
        """Get database instance."""
        return self.client[settings.MONGODB_DB_NAME]


# Create a database instance
db = Database()


# Dependency to get the database in route handlers
async def get_database():
    return db.get_db()