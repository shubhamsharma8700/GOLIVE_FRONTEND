import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import Login from "../pages/Login";
import ForgotPassword from "../pages/ForgotPassword";
import DashboardOverview from "../pages/DashboardOverview";
import EventManagement from "../pages/EventManagement";
// import CreateEvent from "../pages/CreateEvent";
import {UserManagement} from "../pages/UserManagement";
// import ViewersManagement from "../pages/ViewersManagement";
// import ReportsAnalytics from "../pages/ReportsAnalytics";
// import VODLibrary from "../pages/VODLibrary";
import PlayerPage from "../pages/PlayerPage";
import ProtectedRoute from "../routes/ProtectedRoute";
import NewPassword from "../pages/NewPassword";

export default function App() {
  return (
    <Routes>
      {/* Public player route (anyone) */}
      {/* <Route path="/player/:id" element={<PlayerPage />} /> */}

      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/new-password" element={<NewPassword />} />
      <Route path="/player/:id" element={<PlayerPage />} />


      {/* Protected dashboard routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardOverview />} />
        <Route path="events" element={<EventManagement />} />
        {/* <Route path="events/create" element={<CreateEvent />} /> */}
        <Route path="users" element={<UserManagement />} />
        {/* <Route path="viewers" element={<ViewersManagement />} />
        <Route path="reports" element={<ReportsAnalytics />} />
        <Route path="vod" element={<VODLibrary />} />  */}
      </Route>

      {/* fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
