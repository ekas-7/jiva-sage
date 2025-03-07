import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from langchain.chains import RetrievalQA
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import FAISS, MongoDBAtlasVectorSearch
from langchain.text_splitter import CharacterTextSplitter
from langchain_core.documents import Document
from pymongo import MongoClient

# Load environment variables from .env
load_dotenv()

# Get API keys and MongoDB connection details from environment
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
MONGO_URI = os.getenv("MONGO_URI")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME")
MONGO_COLLECTION_NAME = os.getenv("MONGO_COLLECTION_NAME")

if not OPENAI_API_KEY or not MONGO_URI or not MONGO_DB_NAME or not MONGO_COLLECTION_NAME:
    raise ValueError("Missing required environment variables! Please check your .env file.")

# Initialize FastAPI
app = FastAPI()

# Initialize embeddings with API key
embeddings = OpenAIEmbeddings(openai_api_key=OPENAI_API_KEY)

# Initialize MongoDB client
mongo_client = MongoClient(MONGO_URI)
mongo_collection = mongo_client[MONGO_DB_NAME][MONGO_COLLECTION_NAME]

# Initialize FAISS vector store
vectorstore_faiss = None  # Will be initialized when data is added

# Define request models
class AddDataRequest(BaseModel):
    text: str  # Text data to add to the vector store

class QueryRequest(BaseModel):
    query: str  # Query to process

# Function to split text into chunks
def split_text_into_chunks(text: str):
    text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = text_splitter.split_text(text)
    return [Document(page_content=chunk) for chunk in chunks]

# Route to add data to the vector stores
@app.post("/add-data")
async def add_data(request: AddDataRequest):
    global vectorstore_faiss

    try:
        # Split the input text into chunks
        chunks = split_text_into_chunks(request.text)

        # Add data to FAISS
        if vectorstore_faiss is None:
            vectorstore_faiss = FAISS.from_documents(chunks, embeddings)
        else:
            vectorstore_faiss.add_documents(chunks)

        # Add data to MongoDB Atlas Vector Search
        MongoDBAtlasVectorSearch.from_documents(
            documents=chunks,
            embedding=embeddings,
            collection=mongo_collection,
            index_name="vector_index"  # Ensure this index exists in your MongoDB Atlas collection
        )

        return {"message": "Data added successfully to both FAISS and MongoDB!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Route to query the RAG pipeline
@app.post("/query")
async def query(request: QueryRequest):
    global vectorstore_faiss

    if vectorstore_faiss is None:
        raise HTTPException(status_code=400, detail="No data has been added yet. Please add data first.")

    try:
        # Initialize the retriever (using FAISS for local search)
        retriever_faiss = vectorstore_faiss.as_retriever()

        # Initialize the LLM
        llm = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=0, openai_api_key=OPENAI_API_KEY)

        # Create the RetrievalQA chain
        qa_chain = RetrievalQA.from_chain_type(
            llm=llm,
            chain_type="stuff",
            retriever=retriever_faiss,
            return_source_documents=True
        )

        # Run the query
        result = qa_chain.invoke({"query": request.query})

        return {
            "answer": result.get("result", "No answer found"),
            "source_documents": result.get("source_documents", [])
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Run the application
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)