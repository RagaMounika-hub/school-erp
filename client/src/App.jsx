import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Schools from "./pages/Schools";
import Teachers from "./pages/Teachers";
import Students from "./pages/Students";
import Attendance from "./pages/Attendance";
import Profile from "./pages/Profile";
import Leave from "./pages/Leave";
import Notices from "./pages/Notices";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/leave" element={<Leave />} />
        <Route path="/notices" element={<Notices />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/schools"
          element={
            <ProtectedRoute>
              <Schools />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teachers"
          element={
            <ProtectedRoute>
              <Teachers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/students"
          element={
            <ProtectedRoute>
              <Students />
            </ProtectedRoute>
          }
        />

        <Route
          path="/attendance"
          element={
            <ProtectedRoute>
              <Attendance />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;