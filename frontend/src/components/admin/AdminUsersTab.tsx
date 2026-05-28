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
    <section>
      <div className="app-toolbar justify-between">
        <h2 className="app-subtitle">Users</h2>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..."
          className="app-input max-w-sm"
        />
        {isLoading && <Spinner sizeClass="h-8 w-8" thickClass="border-4" />}
      </div>
      {(statusError || changeRoleError || usersError) && (
        <div className="app-error">
          {statusError && <p>{statusError}</p>}
          {changeRoleError && <p>{changeRoleError}</p>}
          {usersError && <p>{usersError}</p>}
        </div>
      )}
      <div className="app-table-wrap">
        <table className="app-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.userId}>
                <td>{user.userName}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.isActive ? "Active" : "Inactive"}</td>
                <td>
                  <div className="flex flex-wrap gap-3">
                    <button className="app-button" onClick={() => handleStatus(user)}>
                      {isLoadingStatusId === user.userId ? (
                        <Spinner />
                      ) : user.isActive ? (
                        "Inactivate"
                      ) : (
                        "Activate"
                      )}
                    </button>
                    <button className="app-button" onClick={() => handleChangeRole(user)}>
                      {isLoadingChangeRoleId === user.userId ? (
                        <Spinner />
                      ) : (
                        "Change role"
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AdminUsersTab;
