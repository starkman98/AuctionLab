import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { Outlet } from "react-router";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 bg-white">
        <Header />
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default MainLayout;
