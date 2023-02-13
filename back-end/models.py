from pydantic import BaseModel
from sqlalchemy import Column, Integer, String
from database import Base

# Define the user table in the database
class User(Base):
    __tablename__ = "users"
    username = Column(String(20))
    email = Column(String(30), unique=True, index=True, primary_key=True)
    password = Column(String(15))

class Note(Base):
    __tablename__ = "notes"
    date = Column(String(20))
    content = Column(String(100))
    owner = Column(String(30), index=True)
    id = Column(Integer, primary_key=True)