@extends('emails.layout')

@section('header_title', 'Welcome aboard!')

@section('content')
<p class="greeting">Hi {{ $user->name }}, welcome to ML in 10 Hours! 🎉</p>

<p>We're excited to have you join our platform. You're now ready to start learning Machine Learning and earn your certification.</p>

<div class="info-box">
  <div class="label">Your Account</div>
  <div class="value">{{ $user->email }}</div>
</div>

<p>Here's what you can do next:</p>
<ul style="padding-left:20px; line-height:2;">
  <li>Browse available courses</li>
  <li>Enroll in <strong>Machine Learning in 10 Hours</strong></li>
  <li>Complete exercises and earn your certificate</li>
</ul>

<p style="text-align:center;">
  <a href="{{ config('app.url') }}/courses" class="btn">Browse Courses</a>
</p>

<hr class="divider"/>
<p style="font-size:13px; color:#888;">
  If you didn't create this account, you can safely ignore this email.
</p>
@endsection
