@extends('emails.layout')

@section('header_title', 'Certificate Ready 🎓')

@section('content')
@php $user = $certificate->user; $course = $certificate->course; @endphp

<p class="greeting">Congratulations, {{ $user->name }}! 🎉</p>

<p>
  You have successfully completed <strong>{{ $course->title }}</strong> and your
  certificate has been issued. This is a great achievement!
</p>

<div class="info-box">
  <div class="label">Certificate</div>
  <div class="value">{{ $course->title }}</div>
</div>

<table style="width:100%; font-size:14px; color:#555; margin:4px 0 20px;">
  <tr>
    <td style="padding:5px 0; width:140px;">Issued on</td>
    <td style="padding:5px 0;"><strong>{{ $certificate->issued_at->format('d F Y') }}</strong></td>
  </tr>
  <tr>
    <td style="padding:5px 0;">Certificate ID</td>
    <td style="padding:5px 0; font-family:monospace; font-size:13px;">{{ $certificate->uuid }}</td>
  </tr>
</table>

<p style="text-align:center; margin-bottom:8px;">
  <a href="{{ config('app.url') }}/api/v1/certificates/{{ $certificate->uuid }}/download" class="btn">
    Download Certificate (PDF)
  </a>
</p>
<p style="text-align:center; font-size:13px; color:#888; margin-top:4px;">
  Or verify it publicly at:
  <a href="{{ config('app.url') }}/certificates/{{ $certificate->uuid }}" style="color:#F14D5D;">
    {{ config('app.url') }}/certificates/{{ $certificate->uuid }}
  </a>
</p>

<hr class="divider"/>
<p style="font-size:13px; color:#888;">
  Share your achievement on LinkedIn and let the world know!
</p>
@endsection
