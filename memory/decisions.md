# Key Decisions Log

**Updated:** 2026-03-23

_Summary of major architectural and project decisions. Full structured log in_ _`decisions.csv`._

***

## 2026-03-23 — Project Kick-off

| Decision        | Summary                                                      |
| --------------- | ------------------------------------------------------------ |
| Stack           | React 19.2 + Laravel 12 + MySQL 8 + FastAPI — from spec doc  |
| Architecture    | API-first; all logic via `/api/v1/` before UI                |
| Auth            | Laravel Sanctum — SPA cookie + API token dual mode           |
| Exercise Groups | A/B split via `hash(user_id) % 2` — prevents answer sharing  |
| Certificate     | UUID v4, QR code, publicly verifiable, PDF via DomPDF/Snappy |
| Queue Driver    | Redis in prod, database queue locally (no Redis on XAMPP)    |
| File Uploads    | `.ipynb`/`.zip` only, max 10MB, UUID-renamed on disk         |
| Local Dev       | XAMPP 8.2, machinelearning.local vhost, no Docker yet        |

***

## 2026-03-24 — Full API Surface Built

| Decision | Summary |
| -------- | ------- |
| Admin guard | Role check inline per controller (role==='admin', 403 if not). No middleware yet — easy to extract later. |
| Settings upsert | `updateOrCreate` per key preserves unlisted keys; prevents accidental deletion. |
| 34 routes total | All v1 endpoints registered and verified via `php artisan route:list`. |

## 2026-03-24 — Admin Frontend Wired to API

| Decision | Summary |
| -------- | ------- |
| Admin query keys | Hierarchical `['admin', resource, ...]` arrays used consistently across all admin pages so `invalidateQueries` can target by prefix. |
| Settings endpoints | `/admin/settings/site` and `/admin/settings/seo` used (not `/admin/settings` or `/admin/seo`). |
| Grade endpoint | `POST /admin/submissions/:id/grade` (not PATCH) per API spec. |
| Submissions filter | Status filters: All / Pending / Graded / Resubmit (not the old all/pending/grading/graded/failed set). |
| Toggle published | Uses `refetch()` directly after PUT rather than invalidateQueries — avoids sharing queryClient import in AdminCourses. |

## 2026-03-24 — Certificate Generation System Built

| Decision | Summary |
| -------- | ------- |
| Certificate PDF | DomPDF with A4 landscape, inline CSS only (no external stylesheets). Gold/navy color scheme, double border (dark blue outer, gold inner). |
| Certificate job | `GenerateCertificateJob` (queued) — idempotent via `exists()` check before creating. Saves to `storage/app/public/certificates/{uuid}.pdf`. |
| Completion trigger | `CourseCompletionService::checkAndCertify()` called inline after grading in `AdminSubmissionController::grade()`. Checks all published exercises in user's group have passing graded submissions. |
| Download route | `GET /api/v1/certificates/{uuid}/download` — public, no auth required. Returns 404 JSON if PDF file not yet on disk. |
| Storage symlink | `php artisan storage:link` run; `public/storage` now linked to `storage/app/public`. |

## 2026-03-24 — AdminPosts + Insights/Blog Wired

| Decision | Summary |
| -------- | ------- |
| AdminPosts page | Full CRUD modal page at `src/pages/admin/AdminPosts.jsx`. Table with type badge (Blog=blue, Case Study=purple, News=green), Published badge, Published At, Edit/Delete. Modal includes slug auto-generation from title. |
| Sidebar updated | `/admin/insights` replaced with `/admin/posts` (label: Posts / Insights) in Settings group. |
| Router updated | `{ path: 'posts', element: <AdminPosts /> }` added to admin children. |
| postsApi confirmed | Already present in `src/api/coursesApi.js` with `getAll` and `getBySlug` — no changes needed. |

## 2026-03-24 — Analytics API + AdminAnalytics Page

| Decision | Summary |
| -------- | ------- |
| QUEUE_CONNECTION=sync | Changed from `database` to `sync` in `.env` so certificate generation runs inline without a queue worker on XAMPP. |
| AdminAnalyticsController | New controller at `Api/V1/Admin/AdminAnalyticsController.php`. Returns 6 KPI scalars + 3 datasets: enrollment trend (30 days), submissions by status, group A/B distribution. |
| Analytics route | `GET /admin/analytics` added to admin sanctum group in `routes/api.php`. |
| AdminAnalytics.jsx wired | Full ApexCharts integration via `window.ApexCharts`. Three charts: area (enrollment trend), donut (submissions by status), bar (group distribution). Each instance tracked in `useRef` for proper cleanup. Platform summary table added. queryKey changed to `['admin', 'analytics']`. |

## 2026-03-24 — Production SPA Fallback + Dynamic SEO

| Decision | Summary |
| -------- | ------- |
| Laravel SPA fallback | `web.php` serves `public/app/index.html` for all routes not matching `api\|storage\|admin-css\|admin-js`. Falls back to 404 message if frontend not built. |
| .htaccess cleaned | X-XSRF-Token rewrite rule removed; standard Laravel rules retained (auth header passthrough, trailing-slash redirect, front controller). |
| Vite base `/app/` | `base: '/app/'` added to `vite.config.js` so built asset URLs resolve correctly when `index.html` is served at `/` by Laravel. |
| Public settings routes | `GET /api/v1/settings/site` and `GET /api/v1/settings/seo` added as unauthenticated public routes so the frontend can read SEO config without a login. |
| SeoHead component | `SeoHead.jsx` + `useSeoSettings.js` created. Component is first child in `MainLayout`, runs on route change, sets `document.title`, meta description, OG/Twitter tags, and optional GA script tag. 1-hour stale time cache. |

---

_Add new decisions here as they are made during development._
_Always log to decisions.csv too (date, decision, reasoning, expected\_outcome, review\_date, status)._
