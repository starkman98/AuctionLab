import { Navigate, Route, Routes } from "react-router";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./router/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/auctions"
          element={
            <ProtectedRoute>
              <p>Auctions page coming soon</p>
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/auctions" replace />} />
    </Routes>
  );
}

export default App;
