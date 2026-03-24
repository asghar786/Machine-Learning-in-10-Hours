import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '@/layouts/MainLayout'
import AuthLayout from '@/layouts/AuthLayout'
import AdminLayout from '@/layouts/AdminLayout'
import ProtectedRoute from '@/components/common/ProtectedRoute'

// Public pages
import HomePage from '@/pages/public/HomePage'
import CourseCatalog from '@/pages/public/CourseCatalog'
import CourseDetail from '@/pages/public/CourseDetail'
import AboutPage from '@/pages/public/AboutPage'
import ContactPage from '@/pages/public/ContactPage'
import CertificateVerify from '@/pages/public/CertificateVerify'

// Auth pages
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage'

// Student pages (protected)
import StudentDashboard from '@/pages/student/StudentDashboard'
import SessionViewer from '@/pages/student/SessionViewer'
import QuizPage from '@/pages/student/QuizPage'
import MyCertificates from '@/pages/student/MyCertificates'
import ProfilePage from '@/pages/student/ProfilePage'
import AccountPage from '@/pages/student/AccountPage'
import StudyPage from '@/pages/student/StudyPage'
import BillingPage from '@/pages/student/BillingPage'

// Insights (Blog)
import InsightsPage from '@/pages/public/InsightsPage'
import InsightDetail from '@/pages/public/InsightDetail'

// Admin pages (protected + admin role)
import AdminDashboard from '@/pages/admin/AdminDashboard'
import AdminUsers from '@/pages/admin/AdminUsers'
import AdminSubmissions from '@/pages/admin/AdminSubmissions'
import AdminAnalytics from '@/pages/admin/AdminAnalytics'
import AdminCourses from '@/pages/admin/AdminCourses'
import AdminSettings from '@/pages/admin/AdminSettings'
import AdminSEO from '@/pages/admin/AdminSEO'
import AdminPosts from '@/pages/admin/AdminPosts'
import AdminPostForm from '@/pages/admin/AdminPostForm'
import AdminInstructors from '@/pages/admin/AdminInstructors'
import AdminLoginPage from '@/pages/auth/AdminLoginPage'
import LockScreenPage from '@/pages/auth/LockScreenPage'

// Instructor pages (protected + instructor role)
import InstructorLayout from '@/layouts/InstructorLayout'
import InstructorDashboard from '@/pages/instructor/InstructorDashboard'
import InstructorCourses from '@/pages/instructor/InstructorCourses'
import InstructorStudents from '@/pages/instructor/InstructorStudents'

export const router = createBrowserRouter([
  // ===== Public routes (Edumel layout) =====
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true,                      element: <HomePage /> },
      { path: 'courses',                  element: <CourseCatalog /> },
      { path: 'courses/:slug',            element: <CourseDetail /> },
      { path: 'about',                    element: <AboutPage /> },
      { path: 'contact',                  element: <ContactPage /> },
      { path: 'certificates/:uuid',       element: <CertificateVerify /> },
      { path: 'insights',                 element: <InsightsPage /> },
      { path: 'insights/:slug',           element: <InsightDetail /> },

      // Student protected routes (inside main layout)
      {
        path: 'dashboard',
        element: <ProtectedRoute><StudentDashboard /></ProtectedRoute>,
      },
      {
        path: 'learn/:slug/session/:num',
        element: <ProtectedRoute><SessionViewer /></ProtectedRoute>,
      },
      {
        path: 'learn/:slug/quiz',
        element: <ProtectedRoute><QuizPage /></ProtectedRoute>,
      },
      {
        path: 'my-certificates',
        element: <ProtectedRoute><MyCertificates /></ProtectedRoute>,
      },
      {
        path: 'profile',
        element: <ProtectedRoute><ProfilePage /></ProtectedRoute>,
      },
      {
        path: 'account',
        element: <ProtectedRoute><AccountPage /></ProtectedRoute>,
      },
      {
        path: 'study',
        element: <ProtectedRoute><StudyPage /></ProtectedRoute>,
      },
      {
        path: 'billing',
        element: <ProtectedRoute><BillingPage /></ProtectedRoute>,
      },
    ],
  },

  // ===== Auth routes (centered layout) =====
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      { path: 'login',            element: <LoginPage /> },
      { path: 'register',         element: <RegisterPage /> },
      { path: 'forgot-password',  element: <ForgotPasswordPage /> },
    ],
  },

  // ===== Instructor routes (Greeva layout) =====
  {
    path: '/instructor',
    element: (
      <ProtectedRoute instructorOnly>
        <InstructorLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true,          element: <InstructorDashboard /> },
      { path: 'courses',      element: <InstructorCourses />   },
      { path: 'students',     element: <InstructorStudents />  },
    ],
  },

  // ===== Admin login + lock screen (Greeva styled, no sidebar) =====
  {
    path: '/admin/login',
    element: <AdminLoginPage />,
  },
  {
    path: '/admin/lock',
    element: <LockScreenPage />,
  },

  // ===== Admin routes (Greeva layout) =====
  {
    path: '/admin',
    element: (
      <ProtectedRoute adminOnly>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true,               element: <AdminDashboard /> },
      { path: 'users',             element: <AdminUsers /> },
      { path: 'instructors',       element: <AdminInstructors /> },
      { path: 'submissions',       element: <AdminSubmissions /> },
      { path: 'analytics',         element: <AdminAnalytics /> },
      { path: 'courses',           element: <AdminCourses /> },
      { path: 'settings',          element: <AdminSettings /> },
      { path: 'seo',               element: <AdminSEO /> },
      { path: 'posts',             element: <AdminPosts /> },
      { path: 'posts/new',         element: <AdminPostForm /> },
      { path: 'posts/:id/edit',    element: <AdminPostForm /> },
    ],
  },
])
