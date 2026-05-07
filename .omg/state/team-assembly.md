# Team Assembly: Define Resume Domain Model (T1)

## Team Fit Analysis
- **Domain**: Engineering (Domain Modeling)
- **Output Target**: TypeScript interfaces/types (`lib/types/resume.ts`)
- **Risk**: Low risk, high impact on architectural integrity.
- **Verification**: Type-check and consistency check against current parsing logic.

## Proposed Team
- **Orchestration**: `omg-director` (Global coordination)
- **Exploration**: `omg-researcher` (Analyze `lib/types/resume.ts` and `lib/validators/resume-parsing.ts`)
- **Execution**: `omg-executor` (Implement/refine domain model)
- **Quality**: `omg-reviewer` (Validate schema alignment)

## Critical Path
1. Analyze existing `lib/types/resume.ts` and `lib/validators/resume-parsing.ts`.
2. Define cohesive, extensible domain models for `Resume`.
3. Implement in `lib/types/resume.ts`.
4. Review against existing validators.

## Reasoning Allocation
- **Orchestrator**: Moderate
- **Execution/Review**: High

## Collaboration Protocol
- **Lanes**: Single-path linear execution (Research -> Exec -> Review).
- **Handoff**: Artifact-based handoff (JSON/TS code snippets).
- **Quality Gate**: Code must be typed, idiomatic, and pass `tsc`.

## Lane Safety
- **Main Lane**: `clean`, `trusted`, `ready`.

## Approval Gate
Proceed with this team? (yes/no)
