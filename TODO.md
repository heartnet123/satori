# Satori TODO Checklist

## Execution overview

This checklist converts the Satori roadmap into phased delivery tasks focused on shipping the core recruitment workflow first, then improving usability and trust, then adding scale and collaboration, and finally reserving long-term intelligence and integrations for later.

---

## Phase 1: Foundation / MVP

**Goal:** Deliver the smallest usable end-to-end workflow: upload a resume, parse it, analyze a job, and produce an explainable match.

### Core delivery tasks

- [ ] define the resume upload flow and supported file types
- [ ] implement PDF/DOCX validation and upload error messaging
- [ ] build the resume upload API and file service integration
- [ ] persist uploaded resume metadata and parse job references
- [ ] implement resume parsing pipeline kickoff after upload
- [ ] build job description input/select flow for first-run testing
- [ ] implement job analysis API and structured extraction output
- [ ] create the deterministic matching engine and scoring rules
- [ ] render fit score, matched skills, missing skills, and rationale in the UI

### Technical tasks

- [x] (T1) define the resume domain model and parsing status schema
- [x] (T2) define the job domain model and analysis schema
- [ ] connect parsing and job analysis services to shared validation rules
- [ ] add basic loading, success, and failure states for async requests
- [ ] (T3) implement resume upload flow
- [ ] (T4) implement job analysis API
- [ ] wire matching logic to parsed resume and analyzed job outputs

### UX / product tasks

- design the minimal upload and parsing interaction flow
- design the job analysis form or seeded demo job selector
- design the match results view with clear scoring explanations
- make failure states understandable and recovery-focused

### QA / release readiness tasks

- verify supported and unsupported file upload cases
- verify parsing progress, completion, and error states
- verify job analysis works for manual and seeded inputs
- verify match results are stable and explainable
- confirm the MVP can be deployed and demoed end to end

---

## Phase 2: Enhancement

**Goal:** Reduce friction, improve trust in the extracted data, and make matches more actionable.

### Core delivery tasks

- build the parsed profile review screen
- normalize extracted skills into readable groups
- add richer candidate summaries from parsed resume data
- expand recommendation cards with next-step actions
- generate action suggestions such as outreach, interview, or screening

### Technical tasks

- define normalized skill group output from the parsing pipeline
- connect recommendation generation to match result data
- support structured action metadata for recruiter follow-up
- reuse existing domain models instead of adding duplicate data shapes

### UX / product tasks

- create a cleaner preview for parsed candidate data
- make the recommendation UI actionable and easy to scan
- improve copy so non-technical users understand score meaning
- add visual hierarchy between raw data, normalized data, and recommendations

### QA / release readiness tasks

- verify parsed profile data is readable and correct
- verify recommendation actions are generated consistently
- verify the UI does not require users to inspect raw pipeline output
- confirm the new screens do not break the original MVP flow

---

## Phase 3: Scale / Growth

**Goal:** Prepare the product for team adoption, shared usage, and operational visibility.

### Core delivery tasks

- implement event tracking for uploads, parsing, analysis, matching, and failures
- add observability for core workflow health and debugging
- create team workspace concepts for shared recruiting usage
- add saved history for jobs, resumes, and match outputs
- implement role-based access control for shared records

### Technical tasks

- define analytics events and workflow instrumentation points
- add structured logging for parsing and matching operations
- add metrics or dashboards for core funnel visibility
- design account, organization, and authorization data models
- persist records so teams can revisit jobs and candidates later

### UX / product tasks

- add a workspace switch or team context indicator
- show saved history in a way that supports repeat review
- make authorization failures understandable to end users
- expose basic operational visibility where appropriate for admins

### QA / release readiness tasks

- verify analytics events fire at each key workflow step
- verify logs and metrics are useful for troubleshooting
- verify team members only access authorized records
- verify saved data can be revisited reliably after refresh or logout
- confirm the product can support multi-user usage patterns

---

## Phase 4: Future / Vision

**Goal:** Explore long-term differentiation once the core workflow and team platform are stable.

### Core delivery tasks

- prototype AI-assisted talent insight summaries
- generate deeper candidate-to-role reasoning layers
- prepare an integration boundary for ATS and HR systems
- define export/import concepts for external workflow tools

### Technical tasks

- create evaluation data for insight quality and transparency
- add feedback capture for AI-assisted recommendations
- establish governance rules for model-driven explanations
- design a stable API boundary for future integrations

### UX / product tasks

- experiment with premium insight experiences that do not obscure reasoning
- design integration touchpoints only after the core model is stable
- keep advanced automation clearly separated from baseline matching

### QA / release readiness tasks

- validate AI-generated insights remain explainable and consistent
- verify future integration work does not disrupt the core product model
- confirm deferred work stays out of the active scope until prerequisites are met

---

## Delivery order reminders

- ship upload, parsing, job analysis, and matching before any advanced features
- stabilize trust and readability before adding recommendations
- add analytics and team support before scaling usage broadly
- keep AI depth and ATS integrations as later-stage bets