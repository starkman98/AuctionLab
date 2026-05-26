import {
  changeRole,
  getUsers,
  inactivateUser,
  reactivateUser,
} from "@/api/adminUserApi";
import type { AdminUserResponse } from "@/types/admin";
import { useEffect, useState } from "react";
import Spinner from "../spinner/Spinner";
import { useDebounce } from "@/hooks/useDebounce";

const AdminUsersTab = () => {
  const [users, setUsers] = useState<AdminUserResponse[]>([]);
  const [usersError, setUsersError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingStatusId, setIsLoadingStatusId] = useState<number | null>(
    null,
  );
  const [isLoadingChangeRoleId, setIsLoadingChangeRoleId] = useState<
    number | null
  >(null);
  const [statusError, setStatusError] = useState("");
  const [changeRoleError, setChangeRoleError] = useState("");

  const [search, setSearch] = useState("");
  const debounceSearch = useDebounce(search, 300);

  useEffect(() => {
    const fetchUsers = async () => {
      setUsersError("");
      setStatusError("");
      setChangeRoleError("");
      setIsLoading(true);

      try {
        const response = await getUsers(1, 20, debounceSearch);
        setUsers(response);
      } catch (error) {
        setUsersError(
          error instanceof Error ? error.message : "Failed to load users",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [debounceSearch]);

  const handleStatus = async (user: AdminUserResponse) => {
    setIsLoadingStatusId(user.userId);
    setUsersError("");
    setStatusError("");
    setChangeRoleError("");

    try {
      const updated = user.isActive
        ? await inactivateUser(user.userId)
        : await reactivateUser(user.userId);

      setUsers((prev) =>
        prev.map((u) => (u.userId === updated.userId ? updated : u)),
      );
    } catch (error) {
      setStatusError(
        error instanceof Error ? error.message : "Failed to change status",
      );
    } finally {
      setIsLoadingStatusId(null);
    }
  };

  const handleChangeRole = async (user: AdminUserResponse) => {
    setIsLoadingChangeRoleId(user.userId);
    setUsersError("");
    setStatusError("");
    setChangeRoleError("");

    try {
      const updated =
        user.role === "User"
          ? await changeRole(user.userId, { role: "Admin" })
          : await changeRole(user.userId, { role: "User" });

      setUsers((prev) =>
        prev.map((u) => (u.userId === updated.userId ? updated : u)),
      );
    } catch (error) {
      setChangeRoleError(
        error instanceof Error ? error.message : "Failed to change role.",
      );
    } finally {
      setIsLoadingChangeRoleId(null);
    }
  };

  return (
    <section className="mx-auto max-w-4xl px-5">
      <div className="flex justify-between">
        <h2 className="text-2xl py-4">Users</h2>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search auctions..."
          className="border px-3"
        />
        <div className="text-red-600 flex items-end">
          {statusError && <p>{statusError}</p>}
          {changeRoleError && <p>{changeRoleError}</p>}
          {usersError && <p>usersError</p>}
        </div>
        {isLoading && <Spinner sizeClass="w-12 h-12" thickClass="border-4" />}
      </div>
      <table>
        <thead>
          <tr className="font-bold border-b border-gray-300">
            <td>Username</td>
            <td className="px-6">Email</td>
            <td className="px-6">Role</td>
            <td className="px-6">Status</td>
            <td className="pl-6">Actions</td>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr className="border-b border-gray-300">
              <td className="pr-6 py-4">{user.userName}</td>
              <td className="px-6">{user.email}</td>
              <td className="px-6">{user.role}</td>
              <td className="px-6 min-w-30">
                {user.isActive ? "Active" : "Inactive"}
              </td>
              <td className="pl-6">
                <button
                  className="px-2 py-0.5 border mr-4 min-w-30"
                  onClick={() => handleStatus(user)}
                >
                  {isLoadingStatusId === user.userId ? (
                    <Spinner />
                  ) : user.isActive ? (
                    "Inactivate"
                  ) : (
                    "Activate"
                  )}
                </button>
                <button
                  className="px-2 py-0.5 border min-w-30"
                  onClick={() => handleChangeRole(user)}
                >
                  {isLoadingChangeRoleId === user.userId ? (
                    <Spinner />
                  ) : (
                    "Change role"
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default AdminUsersTab;
