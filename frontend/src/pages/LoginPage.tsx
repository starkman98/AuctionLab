import { loginApi } from "@/api/authApi";
import Spinner from "@/components/spinner/Spinner";
import { ApiError } from "@/types/apiError";
import { getMe } from "@/api/userApi";
import { useAuth } from "@/hooks/useAuth";
import type { LoginRequest } from "@/types/auth";
import { useState } from "react";
import { useNavigate } from "react-router";

const LoginPage = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<LoginRequest>({
    userName: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    setError(null);
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      await loginApi(form);
      const user = await getMe();
      setUser(user);
      navigate("/");
    } catch (error) {
      if (error instanceof ApiError && error.fieldErrors) {
        setFieldErrors(error.fieldErrors);
      } else {
        setError(error instanceof Error ? error.message : "Login failed");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="app-page-narrow">
      <p className="app-kicker">Account</p>
      <h1 className="app-title mb-8">Login</h1>
      <form
        className="app-form"
        onSubmit={(e) => {
          e.preventDefault();
          void handleSubmit();
        }}
      >
        <div className="app-field">
          <label className="app-label" htmlFor="userName">
            Username
          </label>
          <input
            id="userName"
            className="app-input"
            name="userName"
            value={form.userName}
            onChange={handleChange}
            placeholder="Username"
            type="text"
            autoComplete="username"
          />
          {fieldErrors.UserName?.map((msg) => (
            <p key={msg} className="app-error">
              {msg}
            </p>
          ))}
        </div>
        <div className="app-field">
          <label className="app-label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            className="app-input"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            type="password"
            autoComplete="current-password"
          />
          {fieldErrors.Password?.map((msg) => (
            <p key={msg} className="app-error">
              {msg}
            </p>
          ))}
        </div>
        {error && <p className="app-error">{error}</p>}
        <button
          className="app-button app-button-primary w-full"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting && <Spinner sizeClass="h-4 w-4" thickClass="border-2" />}
          {isSubmitting ? "Logging in..." : "Log in"}
        </button>
      </form>
    </section>
  );
};

export default LoginPage;
