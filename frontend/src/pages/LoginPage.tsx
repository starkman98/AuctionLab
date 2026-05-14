import { loginApi } from "@/api/authApi";
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      await loginApi(form);
      const user = await getMe();
      setUser(user);
      navigate("/auctions");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Login failed");
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
        name="userName"
        value={form.userName}
        onChange={handleChange}
        placeholder="Username"
        type="text"
      />
      <input
        name="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Password"
        type="password"
      />
      {error && <p>{error}</p>}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Loggar in..." : "Logga in"}
      </button>
    </form>
  );
};

export default LoginPage;
