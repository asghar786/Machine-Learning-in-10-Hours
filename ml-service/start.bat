@echo off
cd /d "%~dp0"
echo Starting ML Grader Service on port 8001...
uvicorn main:app --host 0.0.0.0 --port 8001 --reload
