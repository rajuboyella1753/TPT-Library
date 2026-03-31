import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages Imports
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import SuperDashboard from "./pages/super/SuperDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import StudentDashboard from "./pages/student/StudentDashboard";

export default function App() {
  return (
    // App.jsx correct chey
<Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />

  {/* Roles must match Database values exactly */}
  <Route path="/super-admin" element={
    <ProtectedRoute allowedRoles={['super-admin']}>
      <SuperDashboard />
    </ProtectedRoute>
  } />
  
  <Route path="/admin" element={
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminDashboard />
    </ProtectedRoute>
  } />
  
  <Route path="/student" element={
    <ProtectedRoute allowedRoles={['student']}>
      <StudentDashboard />
    </ProtectedRoute>
  } />

  <Route path="/" element={<Navigate to="/login" />} />
</Routes>
  );
}