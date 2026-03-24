"""
ML Grader Service — FastAPI
Port: 8001 (default)

Endpoints:
  GET  /health         — liveness check
  POST /grade          — grade a notebook submission
"""
import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Header, Depends
from pydantic import BaseModel, HttpUrl

import grader as grader_module

load_dotenv()

SECRET = os.getenv("ML_SERVICE_SECRET", "")
app = FastAPI(title="ML Grader Service", version="1.0.0")


# ── Auth ──────────────────────────────────────────────────────────────────────

def verify_secret(x_grader_secret: str = Header(default="")):
    if SECRET and x_grader_secret != SECRET:
        raise HTTPException(status_code=401, detail="Invalid grader secret.")


# ── Schemas ───────────────────────────────────────────────────────────────────

class GradeRequest(BaseModel):
    submission_id: int
    notebook_url: str
    exercise_type: str = "code"
    pass_threshold: int = 70


class GradeResponse(BaseModel):
    submission_id: int
    score: int
    feedback: str
    passed: bool
    status: str


# ── Routes ────────────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    return {"status": "ok", "service": "ml-grader"}


@app.post("/grade", response_model=GradeResponse, dependencies=[Depends(verify_secret)])
async def grade_submission(body: GradeRequest):
    result = await grader_module.grade(body.notebook_url)
    score = result["score"]
    return GradeResponse(
        submission_id=body.submission_id,
        score=score,
        feedback=result["feedback"],
        passed=score >= body.pass_threshold,
        status=result["status"],
    )
