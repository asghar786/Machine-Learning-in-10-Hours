<?php
/**
 * Todo Dashboard API
 * Handles CRUD for tasks.json and Task.log
 * Endpoint: http://machinelearning.local/todo/api.php
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

define('TASKS_FILE', __DIR__ . '/../tasks.json');
define('LOG_FILE',   __DIR__ . '/../Task.log');

// ---------- helpers ----------

function loadTasks(): array {
    if (!file_exists(TASKS_FILE)) {
        return ['tasks' => [], 'last_updated' => date('c')];
    }
    $data = json_decode(file_get_contents(TASKS_FILE), true);
    return $data ?: ['tasks' => [], 'last_updated' => date('c')];
}

function saveTasks(array $data): void {
    $data['last_updated'] = date('Y-m-d\TH:i:s');
    file_put_contents(TASKS_FILE, json_encode($data, JSON_PRETTY_PRINT));
}

function appendLog(string $level, string $taskId, string $message): void {
    $line = sprintf(
        "[%s] [%s] [%s] %s\n",
        date('Y-m-d H:i:s'),
        strtoupper($level),
        $taskId,
        $message
    );
    file_put_contents(LOG_FILE, $line, FILE_APPEND | LOCK_EX);
}

function generateId(): string {
    return 'task-' . strtolower(substr(md5(uniqid('', true)), 0, 8));
}

function respond(bool $ok, $data = null, string $error = ''): void {
    echo json_encode($ok
        ? ['ok' => true,  'data'  => $data]
        : ['ok' => false, 'error' => $error]
    );
    exit;
}

function priorityWeight(string $p): int {
    return match ($p) { 'high' => 3, 'medium' => 2, 'low' => 1, default => 0 };
}

// ---------- routing ----------

$action = $_GET['action'] ?? $_POST['action'] ?? '';
$body   = json_decode(file_get_contents('php://input'), true) ?? [];

switch ($action) {

    // GET ?action=list
    case 'list':
        $data  = loadTasks();
        $tasks = $data['tasks'];
        // Sort: pending first, then in_progress, then completed; within group by priority desc
        usort($tasks, function ($a, $b) {
            $statusOrder = ['pending' => 0, 'in_progress' => 1, 'completed' => 2];
            $sa = $statusOrder[$a['status']] ?? 9;
            $sb = $statusOrder[$b['status']] ?? 9;
            if ($sa !== $sb) return $sa - $sb;
            return priorityWeight($b['priority']) - priorityWeight($a['priority']);
        });
        respond(true, ['tasks' => $tasks, 'last_updated' => $data['last_updated']]);
        break;

    // POST ?action=add  body: {title, description, priority, due_date, notes, automated}
    case 'add':
        $title = trim($body['title'] ?? '');
        if (!$title) respond(false, null, 'Title is required');
        $data = loadTasks();
        $task = [
            'id'           => generateId(),
            'title'        => $title,
            'description'  => trim($body['description'] ?? ''),
            'priority'     => in_array($body['priority'] ?? '', ['high','medium','low'])
                                ? $body['priority'] : 'medium',
            'status'       => 'pending',
            'automated'    => (bool)($body['automated'] ?? false),
            'created_at'   => date('Y-m-d\TH:i:s'),
            'updated_at'   => date('Y-m-d\TH:i:s'),
            'completed_at' => null,
            'due_date'     => $body['due_date'] ?? null,
            'notes'        => trim($body['notes'] ?? ''),
        ];
        $data['tasks'][] = $task;
        saveTasks($data);
        appendLog('ADDED', $task['id'], "New task added: \"{$task['title']}\" [{$task['priority']}]");
        respond(true, $task);
        break;

    // POST ?action=update  body: {id, ...fields}
    case 'update':
        $id = $body['id'] ?? '';
        if (!$id) respond(false, null, 'Task id required');
        $data  = loadTasks();
        $found = false;
        foreach ($data['tasks'] as &$task) {
            if ($task['id'] === $id) {
                $allowed = ['title','description','priority','due_date','notes','automated'];
                foreach ($allowed as $field) {
                    if (isset($body[$field])) $task[$field] = $body[$field];
                }
                $task['updated_at'] = date('Y-m-d\TH:i:s');
                $found = true;
                appendLog('UPDATED', $id, "Task updated: \"{$task['title']}\"");
                respond(true, $task);
            }
        }
        if (!$found) respond(false, null, 'Task not found');
        break;

    // POST ?action=status  body: {id, status}
    case 'status':
        $id     = $body['id'] ?? '';
        $status = $body['status'] ?? '';
        if (!$id || !in_array($status, ['pending','in_progress','completed']))
            respond(false, null, 'Invalid id or status');
        $data  = loadTasks();
        $found = false;
        foreach ($data['tasks'] as &$task) {
            if ($task['id'] === $id) {
                $old = $task['status'];
                $task['status']     = $status;
                $task['updated_at'] = date('Y-m-d\TH:i:s');
                if ($status === 'completed') {
                    $task['completed_at'] = date('Y-m-d\TH:i:s');
                }
                $found = true;
                saveTasks($data);
                appendLog('STATUS', $id, "Status changed: $old → $status | \"{$task['title']}\"");
                respond(true, $task);
            }
        }
        if (!$found) respond(false, null, 'Task not found');
        break;

    // POST ?action=delete  body: {id}
    case 'delete':
        $id = $body['id'] ?? '';
        if (!$id) respond(false, null, 'Task id required');
        $data    = loadTasks();
        $before  = count($data['tasks']);
        $title   = '';
        foreach ($data['tasks'] as $t) { if ($t['id'] === $id) $title = $t['title']; }
        $data['tasks'] = array_values(array_filter($data['tasks'], fn($t) => $t['id'] !== $id));
        if (count($data['tasks']) === $before) respond(false, null, 'Task not found');
        saveTasks($data);
        appendLog('DELETED', $id, "Task deleted: \"$title\"");
        respond(true, ['deleted' => $id]);
        break;

    // GET ?action=logs[&lines=50]
    case 'logs':
        $lines = min((int)($_GET['lines'] ?? 100), 500);
        if (!file_exists(LOG_FILE)) respond(true, ['logs' => '(no log yet)']);
        $all  = file(LOG_FILE, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        $tail = array_slice($all, -$lines);
        respond(true, ['logs' => implode("\n", array_reverse($tail))]);
        break;

    // GET ?action=stats
    case 'stats':
        $data   = loadTasks();
        $counts = ['total' => 0, 'pending' => 0, 'in_progress' => 0, 'completed' => 0,
                   'high' => 0, 'medium' => 0, 'low' => 0];
        foreach ($data['tasks'] as $t) {
            $counts['total']++;
            $counts[$t['status']]    = ($counts[$t['status']] ?? 0) + 1;
            $counts[$t['priority']]  = ($counts[$t['priority']] ?? 0) + 1;
        }
        respond(true, $counts);
        break;

    default:
        respond(false, null, "Unknown action: $action");
}
