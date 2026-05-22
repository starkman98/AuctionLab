import { Navigate, Route, Routes } from "react-router";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./router/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";
import AuctionsPage from "./pages/AuctionsPage";
import RegisterPage from "./pages/RegisterPage";
import AuctionPage from "./pages/AuctionPage";
import ProfilePage from "./pages/ProfilePage";
import CreateAuctionPage from "./pages/CreateAuctionPage";
import AdminPage from "./pages/AdminPage";
import AdminRoute from "./router/AdminRoute";
import MyBidsPage from "./pages/MyBidsPage";
import MyAuctionsPage from "./pages/MyAuctionsPage";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<AuctionsPage />} />
        <Route path="/auctions/:id" element={<AuctionPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/new-auction" element={<CreateAuctionPage />} />
          <Route path="/my-bids" element={<MyBidsPage />} />
          <Route path="/my-auctions" element={<MyAuctionsPage />} />
        </Route>
      </Route>
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/auctions" replace />} />
    </Routes>
  );
}

export default App;
