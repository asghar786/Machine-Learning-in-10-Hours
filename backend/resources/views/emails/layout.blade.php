<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>@yield('subject')</title>
<style>
  body { margin:0; padding:0; background:#f4f6f9; font-family: 'Segoe UI', Arial, sans-serif; color:#333; }
  .wrap { max-width:600px; margin:32px auto; background:#fff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,.08); }
  .header { background:#0d1f3c; padding:28px 40px; text-align:center; }
  .header img { height:44px; }
  .header h1 { color:#fff; margin:12px 0 0; font-size:20px; font-weight:600; letter-spacing:.3px; }
  .body { padding:36px 40px; }
  .body p { margin:0 0 16px; line-height:1.7; font-size:15px; }
  .body .greeting { font-size:17px; font-weight:600; margin-bottom:20px; }
  .btn { display:inline-block; margin:20px 0 8px; padding:13px 32px; background:#F14D5D; color:#fff !important; text-decoration:none; border-radius:6px; font-weight:600; font-size:15px; }
  .info-box { background:#f8f9fc; border-left:4px solid #F14D5D; border-radius:4px; padding:16px 20px; margin:20px 0; }
  .info-box .label { font-size:11px; text-transform:uppercase; letter-spacing:.8px; color:#888; margin-bottom:4px; }
  .info-box .value { font-size:16px; font-weight:600; color:#0d1f3c; }
  .score-pass { color:#27ae60; font-weight:700; font-size:18px; }
  .score-fail { color:#e74c3c; font-weight:700; font-size:18px; }
  .footer { background:#f4f6f9; padding:20px 40px; text-align:center; }
  .footer p { margin:0; font-size:12px; color:#aaa; line-height:1.8; }
  .footer a { color:#888; }
  .divider { border:none; border-top:1px solid #eee; margin:24px 0; }
</style>
</head>
<body>
<div class="wrap">
  <div class="header">
    <img src="{{ config('app.url') }}/assets/images/logo.png" alt="ML in 10 Hours" />
    <h1>@yield('header_title', 'ML in 10 Hours')</h1>
  </div>
  <div class="body">
    @yield('content')
  </div>
  <div class="footer">
    <p>
      &copy; {{ date('Y') }} ML in 10 Hours &nbsp;|&nbsp;
      <a href="{{ config('app.url') }}">machinelearning.local</a><br/>
      You received this email because you have an account on our platform.
    </p>
  </div>
</div>
</body>
</html>
