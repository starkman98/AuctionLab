import AdminAuctionsTab from "@/components/admin/AdminAuctionsTab";
import AdminUsersTab from "@/components/admin/AdminUsersTab";
import { useSearchParams } from "react-router";

const AdminPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = (searchParams.get("tab") ?? "users") as
    | "users"
    | "auctions";

  return (
    <section className="app-page">
      <p className="app-kicker">Administration</p>
      <h1 className="app-title">Dashboard</h1>
      <div className="app-toolbar">
        <button
          className={`app-button ${activeTab === "users" ? "app-button-primary" : ""}`}
          onClick={() => setSearchParams({ tab: "users" })}
        >
          Users
        </button>
        <button
          className={`app-button ${activeTab === "auctions" ? "app-button-primary" : ""}`}
          onClick={() => setSearchParams({ tab: "auctions" })}
        >
          Auctions
        </button>
      </div>
      {activeTab === "users" ? <AdminUsersTab /> : <AdminAuctionsTab />}
    </section>
  );
};

export default AdminPage;
