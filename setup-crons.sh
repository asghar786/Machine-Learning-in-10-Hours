#!/bin/bash
# setup-crons.sh
# Registers Windows Task Scheduler tasks for:
#   1. Daily decision review check (9:07 AM)
#   2. Hourly autonomous task worker
#
# Run ONCE with admin privileges:
#   bash setup-crons.sh
#
# To remove tasks later:
#   schtasks /delete /tn "ML-DecisionReview" /f
#   schtasks /delete /tn "ML-TaskWorker" /f

PROJECT="C:\\xampp82\\htdocs\\machinelearning-local"
PHP="C:\\xampp82\\php\\php.exe"
BASH="C:\\Program Files\\Git\\bin\\bash.exe"

echo "======================================================"
echo " Setting up Windows Scheduled Tasks"
echo " Project: $PROJECT"
echo "======================================================"
echo ""

# -------------------------------------------------------
# 1. Daily Decision Review — runs review.sh every day at 09:07
# -------------------------------------------------------
echo "[1/2] Creating ML-DecisionReview (daily at 09:07)..."

schtasks //create //f \
  //tn "ML-DecisionReview" \
  //tr "\"$BASH\" \"$PROJECT/review.sh\" >> \"$PROJECT/decision-review.log\" 2>&1" \
  //sc daily \
  //st "09:07" \
  //ru "$(whoami)"

if [ $? -eq 0 ]; then
    echo "      ✅ ML-DecisionReview created"
else
    echo "      ❌ Failed — try running as Administrator"
fi

# -------------------------------------------------------
# 2. Hourly Task Worker — runs worker.php every hour at :17
# -------------------------------------------------------
echo "[2/2] Creating ML-TaskWorker (hourly at :17 past the hour)..."

schtasks //create //f \
  //tn "ML-TaskWorker" \
  //tr "\"$PHP\" \"$PROJECT\\todo\\worker.php\"" \
  //sc hourly \
  //mo 1 \
  //st "00:17" \
  //ru "$(whoami)"

if [ $? -eq 0 ]; then
    echo "      ✅ ML-TaskWorker created"
else
    echo "      ❌ Failed — try running as Administrator"
fi

echo ""
echo "======================================================"
echo " Verification — listing scheduled tasks:"
echo "======================================================"
schtasks //query //tn "ML-DecisionReview" //fo list 2>/dev/null || echo "(not found)"
echo ""
schtasks //query //tn "ML-TaskWorker" //fo list 2>/dev/null || echo "(not found)"
echo ""
echo "To run manually:"
echo "  Decision review : bash $PROJECT/review.sh"
echo "  Task worker     : $PHP $PROJECT/todo/worker.php"
echo "======================================================"
