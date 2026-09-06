import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useStudent } from '@/contexts/StudentContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Temporary development bypass while the project is being reworked.
// Set this to false to restore the existing authentication gate.
const AUTH_BYPASS_ENABLED = true;
const DEMO_STUDENT_ID = 'demo_student';

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { studentId, setStudentId } = useStudent();

  useEffect(() => {
    if (!AUTH_BYPASS_ENABLED || studentId) return;

    localStorage.setItem('student_token', 'dev-bypass-token');
    localStorage.setItem('student_email', 'demo@student.local');
    setStudentId(DEMO_STUDENT_ID);
  }, [setStudentId, studentId]);

  if (AUTH_BYPASS_ENABLED) {
    return <>{children}</>;
  }

  // Check both context state and localStorage for authentication
  const token = localStorage.getItem('student_token');
  const storedStudentId = localStorage.getItem('studentId');

  // User is authenticated if we have both token and studentId (from context or localStorage)
  const isAuthenticated = token && (studentId || storedStudentId);

  if (!isAuthenticated) {
    return <Navigate to="/student-login" replace />;
  }

  return <>{children}</>;
};
