<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Certificate of Completion</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            width: 842pt;
            height: 595pt;
            font-family: Georgia, 'Times New Roman', Times, serif;
            background-color: #ffffff;
            color: #1a2a4a;
        }

        .page {
            width: 842pt;
            height: 595pt;
            position: relative;
            background-color: #ffffff;
            padding: 0;
        }

        /* Outer border (dark navy blue) */
        .border-outer {
            position: absolute;
            top: 18pt;
            left: 18pt;
            right: 18pt;
            bottom: 18pt;
            border: 4pt solid #1a2a4a;
        }

        /* Inner border (gold) */
        .border-inner {
            position: absolute;
            top: 26pt;
            left: 26pt;
            right: 26pt;
            bottom: 26pt;
            border: 2pt solid #c9a84c;
        }

        /* Corner ornament squares */
        .corner {
            position: absolute;
            width: 16pt;
            height: 16pt;
            background-color: #c9a84c;
        }
        .corner-tl { top: 14pt; left: 14pt; }
        .corner-tr { top: 14pt; right: 14pt; }
        .corner-bl { bottom: 14pt; left: 14pt; }
        .corner-br { bottom: 14pt; right: 14pt; }

        /* Main content area */
        .content {
            position: absolute;
            top: 38pt;
            left: 38pt;
            right: 38pt;
            bottom: 38pt;
            display: block;
            text-align: center;
        }

        /* Gold decorative top bar */
        .top-bar {
            width: 100%;
            height: 6pt;
            background-color: #c9a84c;
            margin-bottom: 20pt;
        }

        /* Program label */
        .program-label {
            font-family: Georgia, 'Times New Roman', Times, serif;
            font-size: 10pt;
            letter-spacing: 3pt;
            color: #c9a84c;
            text-transform: uppercase;
            margin-bottom: 8pt;
        }

        /* Main heading */
        .certificate-title {
            font-family: Georgia, 'Times New Roman', Times, serif;
            font-size: 36pt;
            font-weight: bold;
            color: #1a2a4a;
            line-height: 1.1;
            margin-bottom: 10pt;
        }

        /* Thin gold divider */
        .divider {
            width: 200pt;
            height: 1.5pt;
            background-color: #c9a84c;
            margin: 8pt auto;
        }

        /* "This is to certify that" */
        .certify-text {
            font-family: Georgia, 'Times New Roman', Times, serif;
            font-size: 12pt;
            font-style: italic;
            color: #4a5568;
            margin-bottom: 10pt;
        }

        /* Student name */
        .student-name {
            font-family: Georgia, 'Times New Roman', Times, serif;
            font-size: 28pt;
            font-weight: bold;
            color: #1a2a4a;
            margin-bottom: 10pt;
            line-height: 1.2;
        }

        /* "has successfully completed" */
        .completed-text {
            font-family: Georgia, 'Times New Roman', Times, serif;
            font-size: 12pt;
            font-style: italic;
            color: #4a5568;
            margin-bottom: 8pt;
        }

        /* Course name */
        .course-name {
            font-family: Georgia, 'Times New Roman', Times, serif;
            font-size: 18pt;
            font-weight: bold;
            color: #1a2a4a;
            margin-bottom: 4pt;
        }

        /* Program subtitle */
        .program-subtitle {
            font-family: Georgia, 'Times New Roman', Times, serif;
            font-size: 11pt;
            color: #c9a84c;
            margin-bottom: 14pt;
        }

        /* Gold divider (bottom section) */
        .divider-bottom {
            width: 400pt;
            height: 1pt;
            background-color: #c9a84c;
            margin: 0 auto 12pt auto;
        }

        /* Footer metadata row */
        .meta-row {
            width: 100%;
            margin-top: 4pt;
        }

        .meta-row table {
            width: 100%;
            border-collapse: collapse;
        }

        .meta-cell {
            text-align: center;
            padding: 0 10pt;
        }

        .meta-label {
            font-family: Georgia, 'Times New Roman', Times, serif;
            font-size: 7.5pt;
            letter-spacing: 1.5pt;
            text-transform: uppercase;
            color: #c9a84c;
            display: block;
            margin-bottom: 2pt;
        }

        .meta-value {
            font-family: Georgia, 'Times New Roman', Times, serif;
            font-size: 9pt;
            color: #1a2a4a;
            display: block;
        }

        /* Vertical dividers between meta cells */
        .meta-sep {
            width: 1pt;
            background-color: #c9a84c;
        }

        /* Bottom verification URL */
        .verify-footer {
            margin-top: 10pt;
            font-family: Georgia, 'Times New Roman', Times, serif;
            font-size: 7.5pt;
            color: #9a9a9a;
            letter-spacing: 0.5pt;
        }

        /* Gold bottom bar */
        .bottom-bar {
            position: absolute;
            bottom: 38pt;
            left: 38pt;
            right: 38pt;
            height: 4pt;
            background-color: #c9a84c;
        }
    </style>
</head>
<body>
<div class="page">

    <!-- Corner ornaments -->
    <div class="corner corner-tl"></div>
    <div class="corner corner-tr"></div>
    <div class="corner corner-bl"></div>
    <div class="corner corner-br"></div>

    <!-- Borders -->
    <div class="border-outer"></div>
    <div class="border-inner"></div>

    <!-- Main content -->
    <div class="content">
        <div class="top-bar"></div>

        <div class="program-label">Machine Learning in 10 Hours</div>

        <div class="certificate-title">Certificate of Completion</div>

        <div class="divider"></div>

        <div class="certify-text">This is to certify that</div>

        <div class="student-name">{{ $studentName }}</div>

        <div class="completed-text">has successfully completed</div>

        <div class="course-name">{{ $courseName }}</div>
        <div class="program-subtitle">Machine Learning in 10 Hours &mdash; Online Certification Program</div>

        <div class="divider-bottom"></div>

        <div class="meta-row">
            <table>
                <tr>
                    <td class="meta-cell" style="width:33%;">
                        <span class="meta-label">Date of Issue</span>
                        <span class="meta-value">{{ $issuedDate }}</span>
                    </td>
                    <td class="meta-sep"></td>
                    <td class="meta-cell" style="width:33%;">
                        <span class="meta-label">Certificate ID</span>
                        <span class="meta-value" style="font-size:7.5pt;">{{ $uuid }}</span>
                    </td>
                    <td class="meta-sep"></td>
                    <td class="meta-cell" style="width:33%;">
                        <span class="meta-label">Credential Type</span>
                        <span class="meta-value">Online Certification</span>
                    </td>
                </tr>
            </table>
        </div>

        <div class="verify-footer">
            Verified at machinelearning.local/certificates/{{ $uuid }}
        </div>
    </div>

    <!-- Bottom gold bar -->
    <div class="bottom-bar"></div>

</div>
</body>
</html>
