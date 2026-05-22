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
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void handleSubmit();
      }}
    >
      <input
        name="firstName"
        value={form.firstName}
        onChange={handleChange}
        placeholder="Firstname"
        type="text"
        autoComplete="given-name"
      />
      <input
        name="lastName"
        value={form.lastName}
        onChange={handleChange}
        placeholder="Lastname"
        type="text"
        autoComplete="family-name"
      />
      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        type="text"
        autoComplete="email"
      />
      <input
        name="userName"
        value={form.userName}
        onChange={handleChange}
        placeholder="Username"
        type="text"
        autoComplete="username"
      />
      {fieldErrors.UserName?.map((msg) => (
        <p key={msg}>{msg}</p>
      ))}
      <input
        name="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Password"
        type="password"
        autoComplete="new-password"
      />
      {fieldErrors.Password?.map((msg) => (
        <p key={msg}>{msg}</p>
      ))}
      {error && <p>{error}</p>}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Registering" : "Register"}
      </button>
    </form>
  );
};

export default RegisterPage;
