from fastapi import FastAPI, Depends, status, Response, HTTPException
from database import engine, SessionLocal
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import models
import schemas

models.Base.metadata.create_all(bind=engine)
app = FastAPI()

# Add the CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update with your allowed origins
    allow_credentials=True,
    allow_methods=["*"],  # Update with your allowed HTTP methods
    allow_headers=["*"],  # Update with your allowed headers
)

@app.get("/")
async def root():
    return {"message": "Hello World"}


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/users/", status_code=status.HTTP_201_CREATED)
def create_user(user: schemas.User, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == user.email).first();
    if user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User with email {user.email} already exists")
    new_user = models.User(
        email=user.email, username=user.username, password=user.password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.get("/users/")
def get_all_users(db: Session = Depends(get_db)):
    users = db.query(models.User).all()
    return users

@app.get("/users/{email}")
def get_user(email, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == email).first();
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User with email {email} not found")
    return user


@app.post("/notes/", status_code=status.HTTP_201_CREATED)
def create_note(note: schemas.Note, db: Session = Depends(get_db)):
    new_note = models.Note(
        date=note.date, content=note.content, owner=note.owner)
    db.add(new_note)
    db.commit()
    db.refresh(new_note)
    return new_note


@app.get("/notes/")
def get_all_notes(db: Session = Depends(get_db)):
    notes = db.query(models.Note).all()
    return notes


@app.get("/notes/{email}")
def get_notes_by_email(email, db: Session = Depends(get_db)):
    notes = db.query(models.Note).filter(models.Note.owner == email).all()
    return notes
