# Ubiquitous Language

## Recruitment workflow


| Term                | Definition                                                                    | Aliases to avoid                 |
| ------------------- | ----------------------------------------------------------------------------- | -------------------------------- |
| **Resume**          | A candidate’s source document containing experience, skills, and background.  | CV, profile, document            |
| **Resume Extraction** | The structured record of a parsed resume persisted in the system.      | Parsed profile, candidate data |
| **Analyzed Job**    | The structured record of a normalized job description persisted.        | Structured JD, job record      |
| **Clean markdown**  | The normalized text version of a resume used for downstream processing.       | Raw text, extracted text         |
| **Candidate**       | A person being evaluated for a role.                                          | Applicant, talent, user          |
| **Job description** | The source text describing a role’s responsibilities and requirements.        | JD, posting, opening             |
| **Job**             | A normalized role record created from a job description.                      | Position, vacancy, opening       |
| **Matching**        | The comparison between a candidate and a job to determine fit.                | Scoring, ranking, evaluation     |
| **Match score**     | A numeric measure of candidate fit for a job.                                 | Fit score, similarity score      |
| **Recommendation**  | A ranked next action suggested after matching.                                | Suggestion, insight, tip         |
| **Requirement**     | A specific skill, condition, or expectation extracted from a job description. | Need, must-have, criterion       |
| **Skill**           | A capability associated with a candidate or required by a job.                | Ability, competency              |
| **Experience**      | The amount and type of work history inferred from a resume.                   | Background, tenure, seniority    |
| **Seniority**       | The inferred level of role complexity or career stage.                        | Level, grade, rank               |
| **Confidence**      | The system’s certainty in an extraction or analysis result.                   | Accuracy, certainty, probability |


## Processing pipeline


| Term                 | Definition                                                  | Aliases to avoid               |
| -------------------- | ----------------------------------------------------------- | ------------------------------ |
| **Upload**           | The act of submitting a resume file into the system.        | Import, send, attach           |
| **Parsing pipeline** | The ordered set of steps that processes an uploaded resume. | Workflow, ETL, processing flow |
| **Progress**         | The percentage of pipeline completion.                      | Status, completion             |
| **Current step**     | The active stage currently being executed in the pipeline.  | Phase, task, operation         |
| **Status**           | The current lifecycle state of a resume in processing.      | State, mode, phase             |
| **Error**            | A failure condition returned by the pipeline or API.        | Issue, exception, problem      |


## Relationships

- A **Candidate** has one or more **Resumes**.
- A **Resume** produces one **Parsed resume**.
- A **Resume** passes through one **Parsing pipeline**.
- A **Job description** is normalized into one **Job**.
- A **Job** has zero or more **Requirements**.
- A **Candidate** and a **Job** participate in **Matching**.
- **Matching** produces one or more **Match scores** and **Recommendations**.

## Example dialogue

> **Dev:** “After the **Resume** is uploaded, what does the **Parsing pipeline** return?”
>
> **Domain expert:** “It returns a **Parsed resume**, a **Clean markdown** version, and the current **Status** with **Progress**.”
>
> **Dev:** “When a **Job description** is analyzed, do we store it as the **Job** record?”
>
> **Domain expert:** “Yes. The **Job** is the normalized role, and its **Requirements** and **Seniority** are extracted from the description.”
>
> **Dev:** “Then **Matching** compares the **Candidate** to the **Job** and generates a **Match score**?”
>
> **Domain expert:** “Exactly, and it also emits **Recommendations** for the recruiter.”

## Flagged ambiguities

- **Resume** vs **Parsed resume** vs **Clean markdown** — these are distinct artifacts. Use **Resume** for the uploaded file, **Parsed resume** for the structured extraction, and **Clean markdown** for the normalized text output.
- **Job** vs **Job description** — use **Job description** for the incoming source text and **Job** for the normalized internal record.
- **Matching** vs **Match score** — use **Matching** for the process and **Match score** for the numeric outcome.
- **Candidate** vs **User** — this domain should use **Candidate**; **User** is reserved for authentication or app access concepts.