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
  if (error && !showChangePasswordModal) {
    return <p className="app-page app-error">{error}</p>;
  }

  return (
    <section className="app-page-narrow">
      <p className="app-kicker">Profile</p>
      <h1 className="app-title mb-8">{user?.userName}</h1>
      <div className="app-form">
        <div className="mb-6">
          <div className="app-stat">
            <span className="app-muted">Firstname</span>
            <strong>{user?.firstName}</strong>
          </div>
          <div className="app-stat">
            <span className="app-muted">Lastname</span>
            <strong>{user?.lastName}</strong>
          </div>
          <div className="app-stat">
            <span className="app-muted">Email</span>
            <strong>{user?.email}</strong>
          </div>
          <div className="app-stat">
            <span className="app-muted">Account created</span>
            <strong>{formatDate(user?.createdAt ?? "")}</strong>
          </div>
        </div>
        <button
          onClick={() => {
            setShowChangePasswordModal(true);
            setForm({ currentPassword: "", newPassword: "" });
            setError("");
            setFieldErrors({});
          }}
          className="app-button app-button-primary w-full"
        >
          Change password
        </button>
      </div>

      {showChangePasswordModal && (
        <div
          className="app-modal-backdrop"
          onClick={() => setShowChangePasswordModal(false)}
        >
          <div className="app-modal" onClick={(e) => e.stopPropagation()}>
            <div className="app-modal-head">
              <h2 className="app-subtitle text-xl">Change password</h2>
              <button
                className="app-button"
                onClick={() => setShowChangePasswordModal(false)}
              >
                X
              </button>
            </div>
            <form
              className="p-5"
              onSubmit={(e) => {
                e.preventDefault();
                void handleChangePassword();
              }}
            >
              {error && <p className="app-error">{error}</p>}
              <div className="app-field">
                <label className="app-label" htmlFor="currentPassword">
                  Current password
                </label>
                <input
                  id="currentPassword"
                  className="app-input"
                  name="currentPassword"
                  value={form.currentPassword}
                  onChange={handleChange}
                  placeholder="Current password"
                  type="password"
                  autoComplete="off"
                />
                {fieldErrors.CurrentPassword?.map((msg) => (
                  <p key={msg} className="app-error">
                    {msg}
                  </p>
                ))}
              </div>
              <div className="app-field">
                <label className="app-label" htmlFor="newPassword">
                  New password
                </label>
                <input
                  id="newPassword"
                  className="app-input"
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  placeholder="New password"
                  type="password"
                  autoComplete="off"
                />
                {fieldErrors.NewPassword?.map((msg) => (
                  <p key={msg} className="app-error">
                    {msg}
                  </p>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  className="app-button app-button-primary"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Changing password..." : "Change password"}
                </button>
                <button
                  className="app-button"
                  type="button"
                  onClick={() => setShowChangePasswordModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProfilePage;
