# routes/notifications.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

import models, schemas, auth
from database import get_db

router = APIRouter(
    prefix="/notifications",
    tags=["notifications"],
    dependencies=[Depends(auth.get_current_user)],
)


@router.get(
    "/",
    response_model=List[schemas.NotificationOut],
    summary="List all notifications for the current user",
)
def list_notifications(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db),
):
    """
    Returns all notifications for the current user, most recent first.
    """
    notifs = (
        db.query(models.Notification)
        .filter(models.Notification.user_id == current_user.id)
        .order_by(models.Notification.created_at.desc())
        .all()
    )
    return notifs


@router.post(
    "/{notif_id}/read",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Mark a single notification as read",
)
def mark_notification_read(
    notif_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db),
):
    """
    Mark a single notification as read.
    """
    notif = (
        db.query(models.Notification)
        .filter(
            models.Notification.id == notif_id,
            models.Notification.user_id == current_user.id,
        )
        .first()
    )
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")

    notif.read = True
    db.commit()
    return


@router.post(
    "/mark-all-read",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Mark all notifications as read",
)
def mark_all_notifications_read(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db),
):
    """
    Mark all notifications for the current user as read.
    """
    db.query(models.Notification) \
      .filter(
          models.Notification.user_id == current_user.id,
          models.Notification.read == False
      ) \
      .update({ "read": True }, synchronize_session=False)
    db.commit()
    return


@router.delete(
    "/{notif_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a single notification",
)
def delete_notification(
    notif_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db),
):
    """
    Delete a specific notification.
    """
    notif = (
        db.query(models.Notification)
        .filter(
            models.Notification.id == notif_id,
            models.Notification.user_id == current_user.id,
        )
        .first()
    )
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")

    db.delete(notif)
    db.commit()
    return