<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CertificateController extends Controller
{
    /**
     * GET /api/v1/certificates/{uuid}
     * Public endpoint: verify a certificate by UUID.
     * Returns user name and course title only — no sensitive data.
     */
    public function verify(string $uuid): JsonResponse
    {
        $certificate = Certificate::where('uuid', $uuid)
            ->with([
                'user:id,name',
                'course:id,title,slug',
            ])
            ->first();

        if (! $certificate) {
            return response()->json([
                'success' => false,
                'data'    => null,
                'message' => 'Certificate not found.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data'    => [
                'uuid'        => $certificate->uuid,
                'issued_at'   => $certificate->issued_at,
                'is_revoked'  => $certificate->is_revoked,
                'user_name'   => $certificate->user->name,
                'course_title' => $certificate->course->title,
            ],
            'message' => 'Certificate verified.',
        ], 200);
    }

    /**
     * GET /api/v1/certificates/{uuid}/download
     * Public endpoint: download the PDF for a non-revoked certificate by UUID.
     */
    public function download(string $uuid)
    {
        $cert = Certificate::where('uuid', $uuid)->where('is_revoked', false)->firstOrFail();
        $path = storage_path('app/public/' . $cert->pdf_path);

        if (!file_exists($path)) {
            return response()->json(['success' => false, 'message' => 'PDF not yet generated.'], 404);
        }

        return response()->download($path, 'certificate-' . $uuid . '.pdf');
    }

    /**
     * GET /api/v1/certificates/me
     * Auth required: list the authenticated user's certificates.
     */
    public function myCertificates(Request $request): JsonResponse
    {
        $certificates = Certificate::where('user_id', $request->user()->id)
            ->with('course:id,title,slug,thumbnail')
            ->orderBy('issued_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $certificates,
            'message' => 'Certificates retrieved successfully.',
        ], 200);
    }
}
