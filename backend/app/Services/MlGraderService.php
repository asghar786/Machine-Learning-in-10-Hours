<?php

namespace App\Services;

use App\Models\Submission;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MlGraderService
{
    private string $baseUrl;
    private string $secret;

    public function __construct()
    {
        $this->baseUrl = rtrim(config('services.ml_grader.url', 'http://127.0.0.1:8001'), '/');
        $this->secret  = config('services.ml_grader.secret', '');
    }

    /**
     * Send a submission to the ML grader service.
     * Returns ['score' => int, 'feedback' => string] or null on failure.
     */
    public function grade(Submission $submission): ?array
    {
        if (empty($submission->notebook_url)) {
            return null;
        }

        try {
            $exercise = $submission->exercise;

            $response = Http::timeout(30)
                ->withHeaders(['X-Grader-Secret' => $this->secret])
                ->post("{$this->baseUrl}/grade", [
                    'submission_id'  => $submission->id,
                    'notebook_url'   => $submission->notebook_url,
                    'exercise_type'  => $exercise?->type ?? 'code',
                    'pass_threshold' => $exercise?->pass_threshold ?? 70,
                ]);

            if ($response->successful()) {
                $data = $response->json();
                return [
                    'score'    => (int) ($data['score'] ?? 0),
                    'feedback' => $data['feedback'] ?? '',
                    'status'   => $data['status'] ?? 'graded',
                ];
            }

            Log::warning('ML grader non-200 response', [
                'submission_id' => $submission->id,
                'status'        => $response->status(),
                'body'          => $response->body(),
            ]);
        } catch (\Throwable $e) {
            Log::error('ML grader service error', [
                'submission_id' => $submission->id,
                'error'         => $e->getMessage(),
            ]);
        }

        return null;
    }
}
