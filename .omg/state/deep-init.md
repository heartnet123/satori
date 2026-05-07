# Deep Init Summary
This is a Next.js (TypeScript) project using Supabase for the backend. The core focus is on recruitment-related tasks, including resume parsing, job management, and matching algorithms.

## Project Map
- **App**: `app/` contains the Next.js App Router structure.
  - `api/`: Backend endpoints for AI analysis, resume parsing, job/match management.
  - `_components/`: React UI components for the dashboard, jobs, parsing, and sidebar/topbar.
- **Lib**: `lib/` contains shared logic and services.
  - `api/`: API services (dashboard, resume).
  - `db/`: Database schema and repository/access methods (resumes, jobs, matches).
  - `recruitment/`: Domain-specific recruitment logic (engine, matchers, store, types).
  - `services/`: Specialized services (AI, PDF/OCR, parsing, embedding).
  - `supabase/`: Supabase client configuration.
  - `types/`: Type definitions.
  - `validators/`: Data validation logic.
- **Infrastructure**: Supabase (PostgreSQL with vector support) is used for data persistence.

## Guardrails
- **Security**: Do not log API keys or database credentials.
- **Integrity**: Follow existing naming and typing conventions; verify all changes with existing types.
- **Validation**: Every feature change must be verified by updating or adding new tests in the repository.
- **Workflow**: Adhere to the `OmG` lane orchestration and workspace configuration.

## Validation Commands
- `npm run dev`: Start development server.
- `npm run build`: Build for production.
- `npm run lint`: Run linting.
- `tsc`: Type check.
