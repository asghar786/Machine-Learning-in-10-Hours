# CLAUDE.md — Persistent Session Instructions

## !! ALWAYS DO FIRST — Read Memory Files
At the start of EVERY session, read these files before doing anything else:

```
memory/user.md          → Who the user is, background, expertise
memory/people.md        → Team members, contacts, roles
memory/preferences.md   → Coding style, workflow, tool preferences
memory/decisions.md     → Key architectural and project decisions
```

Use `Read` tool on each file. This restores full project context.

---

## During Session — Log as You Go
- **New decision described** → append row to `decisions.csv` immediately
- **New person mentioned** → update `memory/people.md`
- **Preference expressed** → update `memory/preferences.md`
- **User info learned** → update `memory/user.md`

---

## !! ALWAYS DO LAST — Update Memory Files
At the end of EVERY session, update any changed memory files and summarize what was done.

---

## Project Quick Reference

| Key | Value |
|-----|-------|
| Project | Machine Learning in 10 Hours — EdX-style cert platform |
| Stack | React 19.2 + Laravel 12 + MySQL 8 + FastAPI (Python 3.12) |
| Local URL | http://machinelearning.local/ |
| Database | machinelearning / root / pak |
| Todo Dashboard | http://machinelearning.local/todo/ |
| Tasks file | tasks.json (project root) |
| Activity log | Task.log (project root) |
| Decisions log | decisions.csv (project root) |

---

## File Map

```
machinelearning-local/
├── CLAUDE.md                  ← this file
├── memory/
│   ├── decisions.md           ← key decisions summary
│   ├── people.md              ← people & roles
│   ├── preferences.md         ← coding/workflow prefs
│   └── user.md                ← user profile
├── decisions.csv              ← structured decision log
├── review.sh                  ← surfaces REVIEW DUE decisions
├── tasks.json                 ← task storage
├── Task.log                   ← activity log
├── todo/
│   ├── index.html             ← web dashboard UI
│   ├── api.php                ← CRUD REST API
│   └── worker.php             ← autonomous task worker (CLI)
├── backend/                   ← Laravel 12 API (to be scaffolded)
├── frontend/                  ← React 19.2 SPA (to be scaffolded)
└── ml-service/                ← FastAPI microservice (to be scaffolded)
```

---

## Decision CSV Format
When logging to `decisions.csv`:
```
date,decision,reasoning,expected_outcome,review_date,status
2026-03-23,"Use Laravel Sanctum","SPA + API token support","Seamless auth","2026-04-22","open"
```
`review_date` = decision date + 30 days. `status` = open | reviewed | superseded
