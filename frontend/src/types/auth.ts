export interface LoginRequest {
  userName: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  expiresAtUtc: string;
  userId: number;
  userName: string;
  email: string;
  role: string;
}

export interface AuthUser {
  userId: number;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  role: string;
  createdAt: string;
}
