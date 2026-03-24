<?php
namespace App\Jobs;

use App\Models\Certificate;
use App\Models\User;
use App\Models\Course;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Str;

class GenerateCertificateJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public readonly int $userId,
        public readonly int $courseId
    ) {}

    public function handle(): void
    {
        // Don't duplicate
        if (Certificate::where('user_id', $this->userId)
                       ->where('course_id', $this->courseId)
                       ->exists()) {
            return;
        }

        $user   = User::findOrFail($this->userId);
        $course = Course::findOrFail($this->courseId);
        $uuid   = (string) Str::uuid();

        $pdf = Pdf::loadView('certificates.certificate', [
            'studentName' => $user->name,
            'courseName'  => $course->title,
            'issuedDate'  => now()->format('d F Y'),
            'uuid'        => $uuid,
        ])->setPaper('a4', 'landscape');

        $path = 'certificates/' . $uuid . '.pdf';
        $fullPath = storage_path('app/public/' . $path);

        // Ensure directory exists
        if (!is_dir(dirname($fullPath))) {
            mkdir(dirname($fullPath), 0755, true);
        }

        $pdf->save($fullPath);

        Certificate::create([
            'user_id'    => $this->userId,
            'course_id'  => $this->courseId,
            'uuid'       => $uuid,
            'issued_at'  => now(),
            'pdf_path'   => $path,
            'is_revoked' => false,
        ]);
    }
}
