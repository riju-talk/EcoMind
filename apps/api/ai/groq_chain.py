from langchain_groq import ChatGroq
from langchain.schema.messages import HumanMessage
import os
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

chat = ChatGroq(
    temperature=0.7,
    model_name="mixtral-8x7b-32768",
    api_key=GROQ_API_KEY
)

def ask_ai(message: str) -> str:
    response = chat([HumanMessage(content=message)])
    return response.content
