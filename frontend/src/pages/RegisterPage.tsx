import { registerApi } from "@/api/authApi";
import { getMe } from "@/api/userApi";
import { useAuth } from "@/hooks/useAuth";
import { ApiError } from "@/types/apiError";
import type { RegisterRequest } from "@/types/auth";
import { useState } from "react";
import { useNavigate } from "react-router";

const RegisterPage = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<RegisterRequest>({
    firstName: "",
    lastName: "",
    email: "",
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
      await registerApi(form);
      const user = await getMe();
      setUser(user);
      navigate("/");
    } catch (error) {
      if (error instanceof ApiError && error.fieldErrors) {
        setFieldErrors(error.fieldErrors);
      } else {
        setError(
          error instanceof Error ? error.message : "Registration failed",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="app-page-narrow">
      <p className="app-kicker">Account</p>
      <h1 className="app-title mb-8">Register</h1>
      <form
        className="app-form"
        onSubmit={(e) => {
          e.preventDefault();
          void handleSubmit();
        }}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="app-field">
            <label className="app-label" htmlFor="firstName">
              Firstname
            </label>
            <input
              id="firstName"
              className="app-input"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="Firstname"
              type="text"
              autoComplete="given-name"
            />
          </div>
          <div className="app-field">
            <label className="app-label" htmlFor="lastName">
              Lastname
            </label>
            <input
              id="lastName"
              className="app-input"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Lastname"
              type="text"
              autoComplete="family-name"
            />
          </div>
        </div>
        <div className="app-field">
          <label className="app-label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            className="app-input"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            type="email"
            autoComplete="email"
          />
        </div>
        <div className="app-field">
          <label className="app-label" htmlFor="registerUserName">
            Username
          </label>
          <input
            id="registerUserName"
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
          <label className="app-label" htmlFor="registerPassword">
            Password
          </label>
          <input
            id="registerPassword"
            className="app-input"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            type="password"
            autoComplete="new-password"
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
          {isSubmitting ? "Registering..." : "Register"}
        </button>
      </form>
    </section>
  );
};

export default RegisterPage;
