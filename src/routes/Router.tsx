import { createBrowserRouter, Outlet } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import RoleBasedRoute from "./RoleBasedRoute";
import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/SignUp";
import AdminDashboard from "../pages/Admin/Dashboard";
import StudentDashboard from "../pages/Student/Dashboard";
import TeacherDashboard from "../pages/Teacher/Dashboard";
import NotFound from "../pages/shared/NotFound";
import Unauthorized from "../pages/Unauthorized";
import PublicLayout from "../layouts/PublicLayout";
import LandingPage from "../pages/LandingPage";
import { AuthProvider } from "../context/AuthContext";

// RootLayout wraps the entire app with AuthProvider
const RootLayout = () => {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
};

// Public routes (no authentication required)
const publicRoutes = [
  {
    element: <PublicLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      {
        path: "signup",
        element: <Signup setIsLogin={(isLogin) => console.log(isLogin)} />,
      },
      {
        path: "login",
        element: <Login setIsLogin={(isLogin) => console.log(isLogin)} />,
      },
      { path: "unauthorized", element: <Unauthorized /> }, // Add this line
    ],
  },
];

// Protected routes (authentication and role-based access required)
const protectedRoutes = [
  {
    element: <PrivateRoute />, // Protect all routes inside
    children: [
      {
        element: <RoleBasedRoute role="admin" />, // Role check
        children: [{ path: "admin-dashboard", element: <AdminDashboard /> }],
      },
      {
        element: <RoleBasedRoute role="student" />, // Role check
        children: [
          { path: "student-dashboard", element: <StudentDashboard /> },
        ],
      },
      {
        element: <RoleBasedRoute role="teacher" />, // Role check
        children: [
          { path: "teacher-dashboard", element: <TeacherDashboard /> },
        ],
      },
    ],
  },
];

// Router configuration
const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      ...publicRoutes, // Public routes
      ...protectedRoutes, // Protected routes
      { path: "*", element: <NotFound /> }, // 404 route
    ],
  },
]);

export default router;
