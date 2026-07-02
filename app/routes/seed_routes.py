from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.database import get_db
from app.models.user import User
from app.models.task import Task
from app.utils.auth import get_password_hash

seed_router = APIRouter()

@seed_router.post("/seed", status_code=status.HTTP_201_CREATED)
def seed_data(db: Session = Depends(get_db)):
    """Populates database with realistic demo data."""
    seeded_count = {"users": 0, "tasks": 0}

    # Seed Users
    users_to_seed = [
        {"email": "alice.smith@example.com", "display_name": "Alice Smith", "password": "password123"},
        {"email": "bob.johnson@example.com", "display_name": "Bob Johnson", "password": "password123"},
        {"email": "charlie.brown@example.com", "display_name": "Charlie Brown", "password": "password123"},
        {"email": "diana.prince@example.com", "display_name": "Diana Prince", "password": "password123"},
        {"email": "eve.adams@example.com", "display_name": "Eve Adams", "password": "password123"},
    ]

    for user_data in users_to_seed:
        try:
            existing_user = db.query(User).filter(User.email == user_data["email"]).first()
            if not existing_user:
                hashed_password = get_password_hash(user_data["password"])
                new_user = User(
                    email=user_data["email"],
                    display_name=user_data["display_name"],
                    hashed_password=hashed_password
                )
                db.add(new_user)
                db.commit()
                db.refresh(new_user)
                seeded_count["users"] += 1
        except IntegrityError:
            db.rollback()
            # User already exists, skip
            pass

    # Fetch users to link tasks
    seeded_users = db.query(User).all()
    if not seeded_users:
        raise HTTPException(status_code=500, detail="No users available to assign tasks.")

    # Seed Tasks
    tasks_to_seed = [
        {"title": "Launch Q3 marketing campaign", "description": "Coordinate with design and content teams.", "status": "pending", "priority": "high", "user_email": "alice.smith@example.com"},
        {"title": "Fix login bug on mobile app", "description": "Investigate and resolve authentication issue.", "status": "in progress", "priority": "critical", "user_email": "bob.johnson@example.com"},
        {"title": "Prepare quarterly financial report", "description": "Gather data from all departments.", "status": "completed", "priority": "high", "user_email": "alice.smith@example.com"},
        {"title": "Review new feature designs", "description": "Provide feedback on UX/UI mockups.", "status": "pending", "priority": "medium", "user_email": "charlie.brown@example.com"},
        {"title": "Update documentation for API v2", "description": "Ensure all endpoints are accurately documented.", "status": "in progress", "priority": "low", "user_email": "diana.prince@example.com"},
        {"title": "Schedule team building event", "description": "Research venues and activities.", "status": "pending", "priority": "medium", "user_email": "eve.adams@example.com"},
        {"title": "Refactor legacy code in auth module", "description": "Improve readability and performance.", "status": "in progress", "priority": "high", "user_email": "bob.johnson@example.com"},
        {"title": "Onboard new junior developer", "description": "Set up development environment and initial tasks.", "status": "pending", "priority": "medium", "user_email": "charlie.brown@example.com"},
        {"title": "Plan next sprint's user stories", "description": "Prioritize backlog items with product owner.", "status": "pending", "priority": "high", "user_email": "diana.prince@example.com"},
        {"title": "Conduct performance review for team members", "description": "Prepare feedback and schedule meetings.", "status": "completed", "priority": "high", "user_email": "eve.adams@example.com"},
    ]

    for task_data in tasks_to_seed:
        try:
            existing_task = db.query(Task).filter(Task.title == task_data["title"]).first()
            if not existing_task:
                user_id = None
                for user in seeded_users:
                    if user.email == task_data["user_email"]:
                        user_id = user.id
                        break

                if user_id is None:
                    # Skip task if user not found, or assign to a default user if desired
                    print(f"Warning: User {task_data['user_email']} not found for task '{task_data['title']}'. Skipping task.")
                    continue

                new_task = Task(
                    title=task_data["title"],
                    description=task_data["description"],
                    status=task_data["status"],
                    priority=task_data["priority"],
                    user_id=user_id
                )
                db.add(new_task)
                db.commit()
                db.refresh(new_task)
                seeded_count["tasks"] += 1
        except IntegrityError:
            db.rollback()
            # Task already exists, skip
            pass

    return {"message": "Database seeded successfully", "seeded_records": seeded_count}
