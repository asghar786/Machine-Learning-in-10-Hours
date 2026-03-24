<?php

namespace App\Mail;

use App\Models\Submission;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SubmissionGradedEmail extends Mailable
{
    use Queueable, SerializesModels;

    public bool $passed;

    public function __construct(public readonly Submission $submission)
    {
        $this->passed = $submission->score >= ($submission->exercise->pass_threshold ?? 70);
    }

    public function envelope(): Envelope
    {
        $result = $this->passed ? 'Passed' : 'Needs improvement';
        return new Envelope(subject: "Your submission has been graded — {$result}");
    }

    public function content(): Content
    {
        return new Content(view: 'emails.submission_graded');
    }
}
