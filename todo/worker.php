<?php
/**
 * Autonomous Task Worker — CLI Script
 * Run hourly via cron/Task Scheduler
 *
 * Usage:  php c:/xampp82/htdocs/machinelearning-local/todo/worker.php
 *
 * Behavior:
 *   1. Load tasks.json
 *   2. Find highest-priority PENDING task (high > medium > low, then oldest first)
 *   3. If task is automated=true  → mark COMPLETED immediately
 *      If task is automated=false → mark IN_PROGRESS (human action needed)
 *   4. Log all activity to Task.log
 *   5. Output summary to STDOUT
 */

define('TASKS_FILE', __DIR__ . '/../tasks.json');
define('LOG_FILE',   __DIR__ . '/../Task.log');

// ---------- helpers ----------

function ts(): string { return date('Y-m-d H:i:s'); }

function log_entry(string $level, string $taskId, string $msg): void {
    $line = sprintf("[%s] [%s] [%s] %s\n", ts(), strtoupper($level), $taskId, $msg);
    file_put_contents(LOG_FILE, $line, FILE_APPEND | LOCK_EX);
    echo $line;
}

function loadTasks(): array {
    if (!file_exists(TASKS_FILE)) {
        log_entry('ERROR', 'WORKER', 'tasks.json not found: ' . TASKS_FILE);
        exit(1);
    }
    $data = json_decode(file_get_contents(TASKS_FILE), true);
    return $data ?: ['tasks' => [], 'last_updated' => date('c')];
}

function saveTasks(array $data): void {
    $data['last_updated'] = date('Y-m-d\TH:i:s');
    file_put_contents(TASKS_FILE, json_encode($data, JSON_PRETTY_PRINT));
}

function priorityWeight(string $p): int {
    return match ($p) { 'high' => 3, 'medium' => 2, 'low' => 1, default => 0 };
}

// ---------- main ----------

log_entry('WORKER', 'SYSTEM', '--- Worker started ---');

$data  = loadTasks();
$tasks = $data['tasks'];

// Count pending tasks
$pending = array_filter($tasks, fn($t) => $t['status'] === 'pending');

if (empty($pending)) {
    log_entry('WORKER', 'SYSTEM', 'No pending tasks. Nothing to do.');
    echo "[" . ts() . "] All tasks up to date.\n";
    exit(0);
}

log_entry('WORKER', 'SYSTEM', count($pending) . ' pending task(s) found.');

// Sort: highest priority first, then oldest created_at
usort($pending, function ($a, $b) {
    $pd = priorityWeight($b['priority']) - priorityWeight($a['priority']);
    if ($pd !== 0) return $pd;
    return strcmp($a['created_at'], $b['created_at']);
});

$target = array_values($pending)[0];

log_entry('WORKER', $target['id'], "Picked task: \"{$target['title']}\" [{$target['priority']}]");

// Update task in main array
foreach ($data['tasks'] as &$task) {
    if ($task['id'] !== $target['id']) continue;

    if ($task['automated']) {
        // Auto-complete
        $task['status']       = 'completed';
        $task['completed_at'] = date('Y-m-d\TH:i:s');
        $task['updated_at']   = date('Y-m-d\TH:i:s');
        log_entry('WORKER', $task['id'], "AUTO-COMPLETED: \"{$task['title']}\"");
        echo "\n✅  Auto-completed: {$task['title']}\n";
    } else {
        // Move to in-progress (needs human action)
        if ($task['status'] !== 'in_progress') {
            $task['status']     = 'in_progress';
            $task['updated_at'] = date('Y-m-d\TH:i:s');
            log_entry('WORKER', $task['id'], "STARTED (needs human): \"{$task['title']}\" [{$task['priority']}]");
            echo "\n▶  Started (manual task): {$task['title']}\n";
        } else {
            log_entry('WORKER', $task['id'], "REMINDER: task already in-progress: \"{$task['title']}\"");
            echo "\n⏳  Already in-progress: {$task['title']}\n";
        }
    }
    break;
}

saveTasks($data);

// Summary of all statuses
$summary = ['pending' => 0, 'in_progress' => 0, 'completed' => 0];
foreach ($data['tasks'] as $t) {
    $summary[$t['status']] = ($summary[$t['status']] ?? 0) + 1;
}
log_entry('WORKER', 'SYSTEM', sprintf(
    'Summary → pending: %d | in_progress: %d | completed: %d',
    $summary['pending'], $summary['in_progress'], $summary['completed']
));
log_entry('WORKER', 'SYSTEM', '--- Worker finished ---');

echo "\nSummary: {$summary['pending']} pending | {$summary['in_progress']} in-progress | {$summary['completed']} completed\n";
