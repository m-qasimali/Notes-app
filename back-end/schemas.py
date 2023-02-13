from pydantic import BaseModel


class User(BaseModel):
    username: str
    email: str
    password: str

class Note(BaseModel):
    date: str
    content: str
    owner: str