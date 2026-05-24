import { changePassword } from "@/api/userApi";
import { useAuth } from "@/hooks/useAuth";
import { ApiError } from "@/types/apiError";
import type { ChangePasswordRequest } from "@/types/user";
import { formatDate } from "@/utils/dateUtils";
import { useState } from "react";
import { useNavigate } from "react-router";

const ProfilePage = () => {
  const { user, isAuthenticated } = useAuth();

  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [error, setError] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState<ChangePasswordRequest>({
    currentPassword: "",
    newPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  const navigate = useNavigate();

  const handleChangePassword = async () => {
    setError("");
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      await changePassword(form);

      setShowChangePasswordModal(false);
    } catch (error) {
      if (error instanceof ApiError && error.fieldErrors) {
        setFieldErrors(error.fieldErrors);
      } else {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to update the auction",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) navigate("/login");
  if (error) return <p>{error}</p>;

  return (
    <section className="text-lg px-6 py-12 mx-auto max-w-3xl">
      <h1 className="text-3xl font-bold text-center">{user?.userName}</h1>
      <p>
        Firstname: <span className="font-semibold">{user?.firstName}</span>
      </p>
      <p>
        Lastname: <span className="font-semibold">{user?.lastName}</span>
      </p>
      <p>
        Email: <span className="font-semibold">{user?.email}</span>
      </p>
      <p>
        Account created:{" "}
        <span className="font-semibold">
          {formatDate(user?.createdAt ?? "")}
        </span>
      </p>
      <div className="py-4">
        <button
          onClick={() => {
            setShowChangePasswordModal(true);
            setForm({ currentPassword: "", newPassword: "" });
            setError("");
            setFieldErrors({});
          }}
          className="w-full px-12 py-2 bg-neutral-200 cursor-pointer"
        >
          Change password
        </button>
      </div>

      {showChangePasswordModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowChangePasswordModal(false)}
        >
          <div className="bg-white" onClick={(e) => e.stopPropagation()}>
            <div className="relative flex items-center justify-center w-full border-b border-gray-300">
              <h2 className="text-center font-bold py-4">Change password</h2>
              <button
                className="absolute right-4 text-2xl cursor-pointer"
                onClick={() => setShowChangePasswordModal(false)}
              >
                X
              </button>
            </div>
            {error && <p className="text-red-600">{error}</p>}
            <form
              className="mx-auto max-w-2xl border border-neutral-800 p-8"
              onSubmit={(e) => {
                e.preventDefault();
                void handleChangePassword();
              }}
            >
              <div className="flex flex-col mb-3">
                <label>Current password</label>
                <input
                  className="bg-neutral-200 p-1 w-full"
                  name="currentPassword"
                  value={form.currentPassword}
                  onChange={handleChange}
                  placeholder="Current password"
                  type="password"
                  autoComplete="off"
                />
                {fieldErrors.CurrentPassword?.map((msg) => (
                  <p key={msg} className="text-red-600">
                    {msg}
                  </p>
                ))}
              </div>
              <div className="flex flex-col mb-3">
                <label>New password</label>
                <input
                  className="bg-neutral-200 p-1 w-full"
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  placeholder="New password"
                  type="password"
                  autoComplete="off"
                />
                {fieldErrors.NewPassword?.map((msg) => (
                  <p key={msg} className="text-red-600">
                    {msg}
                  </p>
                ))}
              </div>
              <button
                className="px-12 py-2 bg-green-900 text-neutral-50 mt-4 mr-2 cursor-pointer"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Changeing password..." : "Change password"}
              </button>
              <button
                className="px-12 py-2 bg-neutral-200 cursor-pointer mt-4"
                onClick={() => setShowChangePasswordModal(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProfilePage;
