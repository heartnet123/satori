Project: Satori
Vision: A transparent AI-assisted recruitment workspace that turns resumes and job descriptions into explainable candidate-role matches.
Phases: 4
Features: 8
Competitor Analysis Used: no
Features Addressing Competitor Pain Points: 4

Breakdown by priority:

- Must Have: 4
- Should Have: 2
- Could Have: 1
- Wont Have: 1

# Satori Roadmap

## Roadmap overview

Satori is positioned as a deterministic, explainable recruitment demo that helps teams upload resumes, parse candidate profiles, analyze job descriptions, and generate transparent fit recommendations without depending on black-box AI workflows.

The roadmap is structured to first make the product usable and trustworthy, then expand workflow completeness, then prepare it for scale and team adoption, and finally define future intelligence features that create strategic differentiation.

---

## Phase 1: Foundation / MVP

**Purpose:** Deliver the minimum end-to-end recruitment workflow that users can try immediately.

**Why this phase matters:** The product only proves value if a user can upload a resume, inspect parsed output, analyze a job, and see matching results in one reliable path. This phase validates the core promise before any broader automation or platform work.

**Target outcome:** A deployable, self-contained workflow with enough trust, feedback, and clarity to support real user testing.

**Milestone 1: Usable first release**

- Resume upload and parsing are functional
- Job analysis can be run from a form or seeded demo jobs
- Matching results and recruiter recommendations are visible in the UI
- Core error states and loading states are understandable

### 1. Resume upload and file validation

- **Description:** Support PDF and DOCX resume uploads with basic size/type validation and clear upload feedback.
- **Rationale:** This is the entry point for the whole experience; without it, the core workflow cannot start.
- **Priority:** Must
- **Complexity:** Low
- **Impact:** High
- **Phase:** Phase 1
- **Dependencies:** File service, upload API, client-side form state, basic error handling
- **Status:** Needed
- **Acceptance criteria:** Users can select a supported resume file, submit it successfully, and see a confirmation or validation error.
- **User stories:**
  - As a recruiter, I want to upload a resume so I can start parsing a candidate profile.
  - As a user, I want unsupported files rejected clearly so I know how to recover.

### 2. Resume parsing status tracking

- **Description:** Show processing stages, progress, and final parsed output while the resume pipeline runs.
- **Rationale:** The product needs visible trust signals because parsing is asynchronous and users must know the system is working.
- **Priority:** Must
- **Complexity:** Medium
- **Impact:** High
- **Phase:** Phase 1
- **Dependencies:** Parsing status API, polling or push updates, structured parsing state model
- **Status:** Needed
- **Acceptance criteria:** The UI reflects the current stage, percentage progress, completion, and failure states without ambiguity.
- **User stories:**
  - As a recruiter, I want to see parsing progress so I know when the candidate data is ready.
  - As a user, I want failure reasons shown so I can retry or fix the source file.

### 3. Job description analyzer

- **Description:** Let users create or select a job and extract key requirements, seniority, and skills from the role description.
- **Rationale:** Matching is only useful if the role being matched is structured enough to compare against the resume data.
- **Priority:** Must
- **Complexity:** Medium
- **Impact:** High
- **Phase:** Phase 1
- **Dependencies:** Job API, job analysis engine, form state, structured job schema
- **Status:** Needed
- **Acceptance criteria:** A job can be analyzed from a form or selected from seeded data, and extracted requirements are visible.
- **User stories:**
  - As a hiring manager, I want to convert a job description into structured criteria so matching is consistent.
  - As a recruiter, I want to reuse demo roles so I can test the workflow quickly.

### 4. Deterministic candidate-role matching

- **Description:** Produce explainable fit scores, matched skills, missing skills, and short rationale for each candidate-role comparison.
- **Rationale:** This is the core value proposition and the main reason users will keep using the product.
- **Priority:** Must
- **Complexity:** High
- **Impact:** High
- **Phase:** Phase 1
- **Dependencies:** Parsed resume data, analyzed job data, matching engine, scoring rules
- **Status:** Needed
- **Acceptance criteria:** A selected job generates at least one ranked match with a score, explanation, strengths, and risks.
- **User stories:**
  - As a recruiter, I want a transparent fit score so I can quickly shortlist candidates.
  - As a hiring manager, I want to understand why a candidate scored well or poorly.

---

## Phase 2: Enhancement

**Purpose:** Improve completeness, confidence, and workflow usability after the core flow is proven.

**Why this phase matters:** Once the demo works, users will judge it on friction, clarity, and whether it feels like a practical recruiting tool rather than a one-off prototype.

**Target outcome:** A smoother, more complete workflow that reduces manual effort and makes the output easier to act on.

**Milestone 2: Confidence and workflow quality upgrade**

- Better review of parsed resume and job outputs
- More useful recruiter actions after matching
- Improved interpretability for non-technical users

### 5. Parsed profile review and normalization UI

- **Description:** Add richer candidate summaries, normalized skill groups, and a cleaner preview of the extracted resume data.
- **Rationale:** Users need to inspect and trust the parsed result before using it in matching decisions.
- **Priority:** Should
- **Complexity:** Medium
- **Impact:** Medium
- **Phase:** Phase 2
- **Dependencies:** Parsed resume schema, UI components, normalization output from parsing pipeline
- **Status:** Deferred until MVP is stable
- **Acceptance criteria:** Users can review candidate details and see normalized summaries without reading raw pipeline output.
- **User stories:**
  - As a recruiter, I want a clean summary of a candidate so I can validate the parser quickly.
  - As a user, I want normalized skills grouped logically so the output is easier to understand.

### 6. Recruiter recommendations and next-step actions

- **Description:** Expand recommendation cards into actionable follow-ups such as outreach, interview, or screening suggestions.
- **Rationale:** Match scores alone do not create workflow value; recruiters need a next action.
- **Priority:** Should
- **Complexity:** Medium
- **Impact:** Medium
- **Phase:** Phase 2
- **Dependencies:** Matching results, recommendation generation, UI card actions
- **Status:** Deferred until matching is reliable
- **Acceptance criteria:** Each match can produce a ranked action suggestion with a clear reason and next step.
- **User stories:**
  - As a recruiter, I want a recommended next action so I can move faster from match to outreach.
  - As a hiring manager, I want guidance on what to do with borderline candidates.

**Competitor pain points addressed in this phase:** Many recruiting tools overwhelm users with raw scores and complex screens; this phase reduces friction and makes the output more operational.

---

## Phase 3: Scale / Growth

**Purpose:** Prepare the product for broader usage, team workflows, and operational visibility.

**Why this phase matters:** A product used by multiple recruiters or teams needs stability, observability, and basic administration before it can grow beyond a demo.

**Target outcome:** A reliable platform baseline with measurable usage, better control, and support for multi-user workflows.

**Milestone 3: Production baseline for team use**

- Analytics exist for key workflow events
- Matching and parsing can be monitored and debugged
- Team-level usage patterns become visible

### 7. Workflow analytics and observability

- **Description:** Track core events such as uploads, parse completion, job analyses, matching runs, and failure points.
- **Rationale:** Growth depends on understanding where users succeed, where they drop off, and where the pipeline fails.
- **Priority:** Must
- **Complexity:** Medium
- **Impact:** High
- **Phase:** Phase 3
- **Dependencies:** Event tracking, logging, dashboard or metrics storage, error instrumentation
- **Status:** Needed for scale readiness
- **Acceptance criteria:** Key workflow steps are observable in a dashboard or metrics view, and failures can be traced.
- **User stories:**
  - As a product owner, I want to know which step users abandon so I can improve adoption.
  - As an operator, I want to trace failures so I can support the system quickly.

### 8. Team workspace, roles, and saved history

- **Description:** Add organizational workspace concepts, saved jobs/resumes, and role-based access for shared recruiting teams.
- **Rationale:** Real recruiting work is collaborative; once adoption grows, the product needs shared state and permissions.
- **Priority:** Must
- **Complexity:** High
- **Impact:** High
- **Phase:** Phase 3
- **Dependencies:** Account model, org/workspace model, authorization, persistent storage
- **Status:** Needed before broader rollout
- **Acceptance criteria:** Multiple users can share a workspace, view stored items, and access only authorized records.
- **User stories:**
  - As a recruiter team, we want shared job and candidate history so we can collaborate consistently.
  - As an admin, I want access control so team data stays isolated.

**Competitor pain points addressed in this phase:** Many recruiting platforms become hard to manage once teams need shared state; this phase addresses the common lack of visibility, auditability, and collaboration support.

---

## Phase 4: Future / Vision

**Purpose:** Explore the long-term differentiators that turn the product from a workflow tool into an intelligent recruiting system.

**Why this phase matters:** These bets are only valuable after the core product is stable and adoption signals are strong. They should amplify the product, not rescue it.

**Target outcome:** A differentiated, intelligent platform that can recommend, automate, and integrate beyond the initial demo scope.

**Milestone 4: Intelligence and ecosystem expansion ready**

- Advanced automation can operate on trusted workflow data
- External integrations can consume the domain model
- Premium capabilities are possible without redesigning the core platform

### 9. AI-assisted talent insights

- **Description:** Add deeper AI-generated summaries, fit explanations, and candidate-to-role reasoning layers for faster decision support.
- **Rationale:** This is the strongest long-term differentiator, but it depends on clean data, trusted parsing, and stable feedback loops.
- **Priority:** Could
- **Complexity:** High
- **Impact:** High
- **Phase:** Phase 4
- **Dependencies:** Stable resume/job models, evaluation data, feedback capture, model governance
- **Status:** Future enhancement
- **Acceptance criteria:** Users can request richer insight summaries that improve recruiter decision-making without reducing transparency.
- **User stories:**
  - As a recruiter, I want deeper AI summaries so I can review candidates faster.
  - As a hiring manager, I want reasoning that complements the deterministic score.

### 10. External ATS and HR system integrations

- **Description:** Connect Satori to applicant tracking systems and HR tools for importing roles, exporting matches, and syncing candidate decisions.
- **Rationale:** Integrations expand reach, reduce duplicate data entry, and make the product viable in real hiring environments.
- **Priority:** Wont
- **Complexity:** High
- **Impact:** High
- **Phase:** Phase 4
- **Dependencies:** Stable API boundaries, workspace model, audit trails, integration layer
- **Status:** Explicitly deferred
- **Acceptance criteria:** Not planned in the current roadmap window; revisited after the core workflow and team model are mature.
- **User stories:**
  - As an operations team, we want ATS sync so we do not re-enter candidate data.
  - As a recruiter, I want matches to flow into my existing tools.

**Competitor pain points addressed in this phase:** Many incumbents are strong on integrations but weak on clarity and explainability; Satori can use this phase to outperform on intelligence without losing transparency.

---

## Feature summary by priority

- **Must Have:** Resume upload and file validation, resume parsing status tracking, job description analyzer, deterministic candidate-role matching, workflow analytics and observability, team workspace, roles, and saved history
- **Should Have:** Parsed profile review and normalization UI, recruiter recommendations and next-step actions
- **Could Have:** AI-assisted talent insights
- **Wont Have:** External ATS and HR system integrations

## Delivery principles

- Ship the smallest useful slice first.
- Preserve explainability over opaque automation.
- Prefer measurable workflow outcomes over feature breadth.
- Add scale only after the core journey is trusted.
- Treat advanced AI and integrations as multipliers, not prerequisites.