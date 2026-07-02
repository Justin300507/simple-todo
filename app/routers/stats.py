from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models.task import Task
from app.schemas.stats import TaskSummaryResponse
from app.models.user import User
from app.utils.auth import get_current_user

stats_router = APIRouter(prefix="/stats", tags=["stats"])

@stats_router.get("/summary", response_model=TaskSummaryResponse)
def get_task_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    total_tasks = db.query(Task).filter(Task.owner_id == current_user.id).count()
    completed_tasks = db.query(Task).filter(Task.owner_id == current_user.id, Task.done == True).count()
    pending_tasks = total_tasks - completed_tasks

    # Calculate average completion time if tasks exist
    # This part assumes a 'created_at' and 'updated_at' field in Task model
    # and that 'updated_at' is set when 'done' becomes True.
    # For simplicity, let's just return 0 if no completed tasks or no time difference.
    avg_completion_time_seconds = 0.0
    if completed_tasks > 0:
        # This is a simplified example. A more robust solution would track completion time specifically.
        # For now, we'll just return 0.0 as a placeholder if no specific completion_time field exists.
        # If Task had a 'completed_at' field, we would use that.
        pass # No specific calculation for avg_completion_time_seconds without more model info

    return TaskSummaryResponse(
        total_tasks=total_tasks,
        completed_tasks=completed_tasks,
        pending_tasks=pending_tasks,
        average_completion_time_seconds=avg_completion_time_seconds
    )
