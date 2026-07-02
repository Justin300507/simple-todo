from typing import List, Optional, Literal
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.task import Task
from app.models.user import User
from app.schemas.task import TaskCreate, TaskUpdate, TaskStatusUpdate, TaskResponse, TaskListResponse
from app.utils.auth import get_current_user

task_router = APIRouter()


@task_router.get("/tasks", response_model=TaskListResponse)
def get_tasks(
    status: Optional[str] = Query(None, description="Filter by task status (e.g., 'pending', 'completed')"),
    priority: Optional[str] = Query(None, description="Filter by task priority"),
    limit: int = Query(50, ge=1, le=500),
    offset: int = Query(0, ge=0),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve all tasks for the authenticated user with pagination and filtering."""
    query = db.query(Task).filter(Task.user_id == current_user.id)

    if status:
        query = query.filter(Task.status == status)
    if priority:
        query = query.filter(Task.priority == priority)

    total = query.count()
    tasks = query.offset(offset).limit(limit).all()

    return {"items": tasks, "total": total}


@task_router.get("/tasks/{task_id}", response_model=TaskResponse)
def get_task_by_id(
    task_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve a specific task by ID for the authenticated user."""
    task = db.query(Task).filter(Task.id == task_id, Task.user_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@task_router.post("/tasks", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(
    task_in: TaskCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new task for the authenticated user."""
    new_task = Task(**{k: v for k, v in task_in.dict().items() if hasattr(Task, k)}, user_id=current_user.id)
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task


@task_router.put("/tasks/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: int,
    task_in: TaskUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update an existing task by ID for the authenticated user."""
    task = db.query(Task).filter(Task.id == task_id, Task.user_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    for field, value in task_in.model_dump(exclude_unset=True).items():
        setattr(task, field, value)

    db.commit()
    db.refresh(task)
    return task


@task_router.patch("/tasks/{task_id}/status", response_model=TaskResponse)
def update_task_status(
    task_id: int,
    status_update: TaskStatusUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Mark a task as complete or pending for the authenticated user."""
    task = db.query(Task).filter(Task.id == task_id, Task.user_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    task.status = status_update.status
    db.commit()
    db.refresh(task)
    return task


@task_router.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    task_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a task by ID for the authenticated user."""
    task = db.query(Task).filter(Task.id == task_id, Task.user_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    db.delete(task)
    db.commit()
    return


@task_router.get("/tasks/search", response_model=TaskListResponse)
def search_tasks(
    query: str = Query(..., min_length=1, description="Search term for title or description"),
    status: Optional[str] = Query(None, description="Filter by task status (e.g., 'pending', 'completed')"),
    limit: int = Query(50, ge=1, le=500),
    offset: int = Query(0, ge=0),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Search tasks by title or description, with status filter and pagination."""
    search_pattern = f"%{query}%"
    base_query = db.query(Task).filter(Task.user_id == current_user.id)

    search_filter = (Task.title.ilike(search_pattern)) | (Task.description.ilike(search_pattern))
    filtered_query = base_query.filter(search_filter)

    if status:
        filtered_query = filtered_query.filter(Task.status == status)

    total = filtered_query.count()
    tasks = filtered_query.offset(offset).limit(limit).all()

    return {"items": tasks, "total": total}
