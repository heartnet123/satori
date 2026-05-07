# Doctor Diagnostics Report
Date: 2029-05-06

## Doctor Result
Status: **Degraded**

## Findings
| Category | Issue | Priority |
| :--- | :--- | :--- |
| Workspace | Dirty worktree (uncommitted changes) | P0 |
| Configuration | Missing/stale `.omg/state/hud.json` | P2 |
| Pipeline | Unassigned ready tasks T1/T2 | P1 |

## Recommended Next Command
1. `git add . && git commit -m "chore: save local state before starting tasks"`
2. `/omg:taskboard --init` (to refresh state artifacts)
