import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Auth Pages
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';

// Shared Pages
import Profile from '@/pages/shared/Profile';
import Settings from '@/pages/shared/Settings';

// Student Pages
import StudentDashboard from '@/pages/student/Dashboard';
import CourseList from '@/pages/student/CourseList';
import CourseDetail from '@/pages/student/CourseDetail';
import LearningActivity from '@/pages/student/LearningActivity';
import ReflectionAI from '@/pages/student/ReflectionAI';

// Mentor Pages
import MentorDashboard from '@/pages/mentor/MentorDashboard';
import StudentDetail from '@/pages/mentor/StudentDetail';
import Interventions from '@/pages/mentor/Interventions';

// Misc Pages
import NotFound from '@/pages/misc/NotFound';

const AppRouter = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Student Routes */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/courses"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <CourseList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/courses/:id"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <CourseDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/activity"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <LearningActivity />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/reflection"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <ReflectionAI />
          </ProtectedRoute>
        }
      />

      {/* Mentor Routes */}
      <Route
        path="/mentor/dashboard"
        element={
          <ProtectedRoute allowedRoles={['mentor']}>
            <MentorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mentor/students/:id"
        element={
          <ProtectedRoute allowedRoles={['mentor']}>
            <StudentDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mentor/interventions"
        element={
          <ProtectedRoute allowedRoles={['mentor']}>
            <Interventions />
          </ProtectedRoute>
        }
      />

      {/* Shared Routes (accessible by both student and mentor) */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={['student', 'mentor']}>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute allowedRoles={['student', 'mentor']}>
            <Settings />
          </ProtectedRoute>
        }
      />

      {/* Redirects */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* 404 */}
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
