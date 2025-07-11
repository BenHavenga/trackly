from sqlalchemy.orm import Session
import models

def get_immediate_manager(user: models.User, db: Session) -> models.User | None:
    """Returns the direct manager, or None if none assigned."""
    if user.manager_id:
        return db.query(models.User).get(user.manager_id)
    return None

def get_approval_chain(user: models.User, db: Session) -> list[models.User]:
    """Builds the chain [immediate, their manager, …]."""
    chain = []
    mgr = get_immediate_manager(user, db)
    while mgr:
        chain.append(mgr)
        mgr = get_immediate_manager(mgr, db)
    return chain
