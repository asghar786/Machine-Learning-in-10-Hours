@extends('emails.layout')

@section('header_title', 'Enrollment Confirmed')

@section('content')
@php $course = $enrollment->course; $user = $enrollment->user; @endphp

<p class="greeting">Hi {{ $user->name }},</p>

<p>Your enrollment has been confirmed. You're all set to start learning!</p>

<div class="info-box">
  <div class="label">Course</div>
  <div class="value">{{ $course->title }}</div>
</div>

<table style="width:100%; font-size:14px; color:#555; margin:4px 0 20px;">
  <tr>
    <td style="padding:5px 0; width:140px;">Level</td>
    <td style="padding:5px 0;"><strong>{{ ucfirst($course->level ?? 'Beginner') }}</strong></td>
  </tr>
  <tr>
    <td style="padding:5px 0;">Duration</td>
    <td style="padding:5px 0;"><strong>{{ $course->duration_hours ?? 10 }} Hours</strong></td>
  </tr>
  <tr>
    <td style="padding:5px 0;">Enrolled on</td>
    <td style="padding:5px 0;"><strong>{{ $enrollment->enrolled_at->format('d M Y') }}</strong></td>
  </tr>
</table>

<p style="text-align:center;">
  <a href="{{ config('app.url') }}/dashboard" class="btn">Go to My Dashboard</a>
</p>

<hr class="divider"/>
<p style="font-size:13px; color:#888;">
  Complete all sessions and pass the exercises to earn your certificate.
</p>
@endsection
