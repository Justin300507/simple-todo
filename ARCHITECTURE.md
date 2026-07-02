# Architecture — Simple Todo

## ER Diagram

```
┌─────────────────────┐
│ Task                │
├─────────────────────┤
│ id         Integer ││
│ title      String(255│
│ description Text    ││
│ status     String(50││
│ created_at DateTime││
│ completed_at DateTime│
│ user_id    Integer ││
│ priority   Integer ││
└─────────────────────┘

┌─────────────────────┐
│ User                │
├─────────────────────┤
│ id         Integer ││
│ email      String(255│
│ hashed_password Strin│
│ display_name String  │
└─────────────────────┘

```

## Backend Architecture

```
FastAPI Application
├── Routing Layer (app/routes/)     → HTTP request handling
├── Service Layer (app/services/)   → Business logic
├── Model Layer (app/models/)       → Database ORM (SQLAlchemy)
├── Schema Layer (app/schemas/)     → Validation (Pydantic v2)
└── Database (app/database.py)      → Session management (SQLite)
```

## Design Patterns

- **Repository pattern**: services own DB queries, routes own HTTP logic
- **Dependency injection**: `get_db` session injected via FastAPI `Depends()`
- **Schema separation**: ORM models never exposed directly; Pydantic schemas serialize responses
- **JWT auth**: Bearer tokens validated via `oauth2_scheme` dependency
