"""
Notebook grading logic.
Fetches a .ipynb notebook from a URL and scores it heuristically.
"""
import re
import json
import httpx

# ML / data science keywords to look for
ML_IMPORTS = re.compile(
    r'\b(sklearn|tensorflow|keras|torch|torchvision|xgboost|lightgbm|'
    r'pandas|numpy|scipy|matplotlib|seaborn|plotly|cv2|nltk|spacy|'
    r'transformers|datasets|fastai)\b',
    re.IGNORECASE,
)
TRAINING_CALLS = re.compile(
    r'\.(fit|fit_transform|train|compile|predict|evaluate|score)\s*\(',
    re.IGNORECASE,
)
PLOT_CALLS = re.compile(
    r'(plt\.show|plt\.savefig|\.plot\(|seaborn\.|sns\.|fig\.show)',
    re.IGNORECASE,
)


def _colab_to_raw(url: str) -> str | None:
    """Convert a Google Colab share URL to a raw GitHub URL if possible."""
    # Colab URLs embedding a GitHub path: open?id=... or /github/user/repo/blob/...
    m = re.search(r'colab\.research\.google\.com/github/([^?#]+)', url)
    if m:
        return f"https://raw.githubusercontent.com/{m.group(1).replace('/blob/', '/')}"
    return None


def _gist_to_raw(url: str) -> str | None:
    """Convert gist.github.com/user/ID to its first raw .ipynb file."""
    m = re.match(r'https?://gist\.github\.com/([^/]+)/([a-f0-9]+)/?$', url)
    if m:
        return f"https://gist.githubusercontent.com/{m.group(1)}/{m.group(2)}/raw"
    return None


async def fetch_notebook(url: str) -> dict | None:
    """Try to download and parse a Jupyter notebook from the given URL."""
    candidates = [url]

    raw = _colab_to_raw(url)
    if raw:
        candidates.insert(0, raw)

    gist = _gist_to_raw(url)
    if gist:
        candidates.insert(0, gist)

    async with httpx.AsyncClient(timeout=15, follow_redirects=True) as client:
        for candidate in candidates:
            try:
                resp = await client.get(candidate, headers={"User-Agent": "MLGrader/1.0"})
                if resp.status_code == 200:
                    text = resp.text.strip()
                    if text.startswith("{"):
                        nb = json.loads(text)
                        if "cells" in nb or "nbformat" in nb:
                            return nb
            except Exception:
                continue
    return None


def score_notebook(nb: dict) -> tuple[int, str]:
    """
    Score a parsed .ipynb notebook dict.
    Returns (score 0-100, feedback string).
    """
    cells = nb.get("cells", [])
    source_all = "\n".join(
        "".join(c.get("source", [])) for c in cells
    )

    code_cells = [c for c in cells if c.get("cell_type") == "code"]
    markdown_cells = [c for c in cells if c.get("cell_type") == "markdown"]
    cells_with_output = [c for c in code_cells if c.get("outputs")]

    score = 0
    notes = []

    # 1. Has meaningful number of code cells (≥3 = full credit, 1-2 = partial)
    if len(code_cells) >= 5:
        score += 20
        notes.append(f"Good structure ({len(code_cells)} code cells)")
    elif len(code_cells) >= 2:
        score += 10
        notes.append(f"Minimal code cells ({len(code_cells)})")
    else:
        notes.append("Very few code cells — may be incomplete")

    # 2. Has executed outputs
    if len(cells_with_output) >= 3:
        score += 20
        notes.append("Notebook has been executed with outputs")
    elif len(cells_with_output) >= 1:
        score += 10
        notes.append("Some cells executed")
    else:
        notes.append("No executed outputs found")

    # 3. Uses ML/data science libraries
    ml_matches = ML_IMPORTS.findall(source_all)
    unique_libs = list(dict.fromkeys(m.lower() for m in ml_matches))
    if len(unique_libs) >= 3:
        score += 25
        notes.append(f"Strong library usage: {', '.join(unique_libs[:5])}")
    elif len(unique_libs) >= 1:
        score += 15
        notes.append(f"Uses: {', '.join(unique_libs)}")
    else:
        notes.append("No ML/data science imports detected")

    # 4. Model training / fitting calls
    train_matches = TRAINING_CALLS.findall(source_all)
    if len(train_matches) >= 2:
        score += 20
        notes.append("Model training calls present")
    elif len(train_matches) == 1:
        score += 10
        notes.append("One training call found")
    else:
        notes.append("No model training detected")

    # 5. Visualisation
    if PLOT_CALLS.search(source_all):
        score += 10
        notes.append("Includes visualisations")

    # 6. Documentation (markdown cells)
    if len(markdown_cells) >= 2:
        score += 5
        notes.append("Good documentation")

    score = min(score, 100)
    feedback = "; ".join(notes)
    return score, feedback


async def grade(notebook_url: str) -> dict:
    """
    Main grading entry point.
    Returns { score, feedback, status }.
    """
    if not notebook_url:
        return {"score": 0, "feedback": "No notebook URL provided.", "status": "error"}

    nb = await fetch_notebook(notebook_url)

    if nb is None:
        return {
            "score": 0,
            "feedback": (
                "Could not retrieve the notebook. "
                "Please ensure the URL is publicly accessible "
                "(use a GitHub raw link or public Gist)."
            ),
            "status": "unreachable",
        }

    score, feedback = score_notebook(nb)
    return {"score": score, "feedback": feedback, "status": "graded"}
