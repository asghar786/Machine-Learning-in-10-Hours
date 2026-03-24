<?php

namespace App\Mail;

use App\Models\Certificate;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class CertificateReadyEmail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public readonly Certificate $certificate) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Your certificate is ready — ' . $this->certificate->course->title);
    }

    public function content(): Content
    {
        return new Content(view: 'emails.certificate_ready');
    }
}
