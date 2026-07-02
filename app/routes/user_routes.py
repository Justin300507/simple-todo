from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional

from app.database import get_db
from app.schemas.user import UserUpdate, UserBase
from app.utils.auth import get_current_user, get_password_hash

# Lazy import for User model to avoid circular dependencies and duplicate table registration
# The actual User model is imported within the function where it's needed.

user_router = APIRouter()


@user_router.get("/users/me", response_model=UserBase)
def get_current_user_details(
    current_user: "User" = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current authenticated user's details."""
    # current_user is already a User object from the database
    return current_user


@user_router.put("/users/me", response_model=UserBase)
def update_current_user_details(
    user_update: UserUpdate,
    current_user: "User" = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update current authenticated user's details."""
    from app.models.user import User # Lazy import

    db_user = db.query(User).filter(User.id == current_user.id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    if user_update.email is not None:
        # Check if new email already exists for another user
        existing_user = db.query(User).filter(User.email == user_update.email).first()
        if existing_user and existing_user.id != db_user.id:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")
        db_user.email = user_update.email

    if user_update.display_name is not None:
        db_user.display_name = user_update.display_name

    if user_update.password is not None:
        db_user.hashed_password = get_password_hash(user_update.password)

    db.commit()
    db.refresh(db_user)
    return db_user
