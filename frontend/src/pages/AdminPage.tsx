import AdminAuctionsTab from "@/components/admin/AdminAuctionsTab";
import AdminUsersTab from "@/components/admin/AdminUsersTab";
import { useSearchParams } from "react-router";

const AdminPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = (searchParams.get("tab") ?? "users") as
    | "users"
    | "auctions";

  const tabStyle = "px-10 py-2 cursor-pointer";
  const activeTabStyle = " border-b-3 font-bold bg-gray-100";

  return (
    <section className="text-lg">
      <h1 className="font-bold text-3xl text-center mt-4">Admin dashboard</h1>
      <div className="flex justify-center p-4 gap-4">
        <button
          className={
            activeTab === "users" ? tabStyle + activeTabStyle : tabStyle
          }
          onClick={() => setSearchParams({ tab: "users" })}
        >
          Users
        </button>
        <button
          className={
            activeTab === "auctions" ? tabStyle + activeTabStyle : tabStyle
          }
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
