@extends('emails.layout')

@section('header_title', 'Submission Graded')

@section('content')
@php $user = $submission->user; $exercise = $submission->exercise; @endphp

<p class="greeting">Hi {{ $user->name }},</p>

<p>Your submission for <strong>{{ $exercise->title }}</strong> has been reviewed.</p>

<div class="info-box">
  <div class="label">Your Score</div>
  <div class="value">
    @if($passed)
      <span class="score-pass">{{ $submission->score }} / {{ $exercise->max_score ?? 100 }} &nbsp;✓ Passed</span>
    @else
      <span class="score-fail">{{ $submission->score }} / {{ $exercise->max_score ?? 100 }} &nbsp;✗ Needs improvement</span>
    @endif
  </div>
</div>

@if($submission->feedback)
<div class="info-box" style="border-left-color:#3498db;">
  <div class="label">Instructor Feedback</div>
  <div class="value" style="font-size:14px; font-weight:400; line-height:1.6;">{{ $submission->feedback }}</div>
</div>
@endif

@if($passed)
<p>Well done! Keep going — complete all sessions to earn your certificate.</p>
@else
<p>Don't give up! Review the material and resubmit when you're ready.</p>
@endif

<p style="text-align:center;">
  <a href="{{ config('app.url') }}/dashboard" class="btn">View My Progress</a>
</p>
@endsection
