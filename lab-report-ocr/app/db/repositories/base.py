from typing import Any, Dict, Generic, List, Optional, Type, TypeVar, Union
from bson import ObjectId
from pydantic import BaseModel

# Define generic type for models
ModelType = TypeVar("ModelType", bound=BaseModel)

class BaseRepository:
    """
    Base repository with common CRUD operations
    """
    
    def __init__(self, collection_name: str, db):
        """
        Initialize with collection name and database connection
        """
        self.collection = db[collection_name]
    
    async def find_one(self, id: Union[str, ObjectId]) -> Optional[Dict[str, Any]]:
        """
        Find one document by ID
        """
        oid = id if isinstance(id, ObjectId) else ObjectId(id)
        return await self.collection.find_one({"_id": oid})
    
    async def find_by_query(
        self, 
        query: Dict[str, Any], 
        skip: int = 0, 
        limit: int = 100, 
        sort_field: str = "_id", 
        sort_direction: int = -1
    ) -> List[Dict[str, Any]]:
        """
        Find documents by query
        """
        cursor = self.collection.find(query).skip(skip).limit(limit).sort(sort_field, sort_direction)
        
        return [document async for document in cursor]
    
    async def count(self, query: Dict[str, Any]) -> int:
        """
        Count documents matching query
        """
        return await self.collection.count_documents(query)
    
    async def create(self, document: Dict[str, Any]) -> str:
        """
        Create a new document
        """
        result = await self.collection.insert_one(document)
        return str(result.inserted_id)
    
    async def update(self, id: Union[str, ObjectId], update_data: Dict[str, Any]) -> bool:
        """
        Update a document by ID
        """
        oid = id if isinstance(id, ObjectId) else ObjectId(id)
        result = await self.collection.update_one({"_id": oid}, {"$set": update_data})
        return result.modified_count > 0
    
    async def delete(self, id: Union[str, ObjectId]) -> bool:
        """
        Delete a document by ID
        """
        oid = id if isinstance(id, ObjectId) else ObjectId(id)
        result = await self.collection.delete_one({"_id": oid})
        return result.deleted_count > 0