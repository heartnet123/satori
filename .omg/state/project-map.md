# Project Map

## Modules and Responsibilities

| Module | Responsibility |
| :--- | :--- |
| `app/` | UI, routing, and API route entry points. |
| `app/api/` | API endpoints and business logic orchestration. |
| `app/_components/` | Reusable React components. |
| `lib/api/` | Data access services for the API layer. |
| `lib/db/` | Database interactions and Supabase schema. |
| `lib/recruitment/` | Core recruitment business domain (matching, engines). |
| `lib/services/` | External integrations (AI, OCR, PDF processing). |
| `lib/supabase/` | Base Supabase connectivity. |
| `lib/types/` | Global shared types. |
| `lib/validators/` | Input validation rules. |

## Dependency Hotspots
- `lib/services/`: Central hub for AI/file processing; likely high churn and complexity.
- `lib/db/`: Foundational persistence layer; centralizes database access.
- `app/api/`: Orchestration layer; high dependency on both `lib/services/` and `lib/db/`.
