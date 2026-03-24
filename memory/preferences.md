# Coding & Workflow Preferences

**Updated:** 2026-03-23

## General

* Plan before coding — alignment first, then implementation
* Provide templates for scaffolding (don't generate from scratch without them)
* API-first architecture: all business logic via versioned REST endpoints before any UI

## Code Style

* Laravel: PHP attribute-based routing (#\[Route] annotations)
* React: functional components, hooks only (no class components)
* State: TanStack Query for server state, Zustand for client state
* Styling: Tailwind CSS utility-first
* No over-engineering — minimum complexity for current task

## Project Structure

* backend/ → Laravel 12
* frontend/ → React 19.2 + Vite
* ml-service/ → FastAPI Python

## Git

* API-first: backend before frontend
* Follow 8-week sprint plan from document

## Notes

* Update this file whenever the user expresses preferences or corrects approach

