import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from langchain.chains import RetrievalQA
from langchain_openai import OpenAIEmbeddings, ChatOpenAI  # Updated import
from langchain_community.vectorstores import FAISS
from langchain.text_splitter import CharacterTextSplitter
from langchain_core.documents import Document

# Load environment variables from .env
load_dotenv()

# Get API key from environment
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not OPENAI_API_KEY:
    raise ValueError("Missing OpenAI API Key! Please set it in your .env file.")

# Initialize FastAPI
app = FastAPI()

# Initialize embeddings with API key
embeddings = OpenAIEmbeddings(openai_api_key=OPENAI_API_KEY)
vectorstore = None  # Will be initialized when data is added

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

# Route to add data to the vector store
@app.post("/add-data")
async def add_data(request: AddDataRequest):
    global vectorstore

    try:
        # Split the input text into chunks
        chunks = split_text_into_chunks(request.text)

        # Initialize or update the vector store
        if vectorstore is None:
            vectorstore = FAISS.from_documents(chunks, embeddings)
        else:
            vectorstore.add_documents(chunks)

        return {"message": "Data added successfully!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Route to query the RAG pipeline
@app.post("/query")
async def query(request: QueryRequest):
    global vectorstore

    if vectorstore is None:
        raise HTTPException(status_code=400, detail="No data has been added yet. Please add data first.")

    try:
        # Initialize the retriever
        retriever = vectorstore.as_retriever()

        # Initialize the LLM
        # Initialize the chat model instead of standard OpenAI model
        llm = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=0, openai_api_key=OPENAI_API_KEY)


        # Create the RetrievalQA chain
        qa_chain = RetrievalQA.from_chain_type(
            llm=llm,
            chain_type="stuff",
            retriever=retriever,
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
