#!/bin/bash
# review.sh — Surface decisions that have hit their 30-day review date
# Usage: bash review.sh
# Place in project root: c:/xampp82/htdocs/machinelearning-local/

DECISIONS_FILE="$(dirname "$0")/decisions.csv"
TODAY=$(date +%Y-%m-%d)
FLAG_MARKER="REVIEW DUE"
FLAGGED=0

echo "=============================================="
echo " Decision Review Check — $TODAY"
echo "=============================================="
echo ""

if [ ! -f "$DECISIONS_FILE" ]; then
    echo "ERROR: decisions.csv not found at $DECISIONS_FILE"
    exit 1
fi

# Read CSV line by line, skip header
HEADER=true
while IFS=',' read -r date decision reasoning expected_outcome review_date status; do
    # Skip header row
    if $HEADER; then
        HEADER=false
        continue
    fi

    # Strip surrounding quotes
    decision=$(echo "$decision" | tr -d '"')
    review_date=$(echo "$review_date" | tr -d '"')
    status=$(echo "$status" | tr -d '"' | tr -d '\r')

    # Skip already reviewed or superseded
    if [[ "$status" == "reviewed" || "$status" == "superseded" ]]; then
        continue
    fi

    # Compare review_date <= today
    if [[ "$review_date" <= "$TODAY" ]]; then
        FLAGGED=$((FLAGGED + 1))
        echo "[$FLAG_MARKER] #$FLAGGED"
        echo "  Decision   : $decision"
        echo "  Decided on : $date"
        echo "  Review due : $review_date"
        echo "  Outcome    : $expected_outcome"
        echo "  Status     : $status"
        echo "----------------------------------------------"
    fi
done < "$DECISIONS_FILE"

if [ $FLAGGED -eq 0 ]; then
    echo "  No decisions due for review today."
else
    echo ""
    echo "  Total flagged: $FLAGGED decision(s) need review."
    echo ""
    echo "  To mark reviewed, update status column in decisions.csv"
    echo "  to 'reviewed' or 'superseded'."
fi

echo "=============================================="
