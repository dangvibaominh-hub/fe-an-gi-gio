export type UserRole = "USER" | "ADMIN";
export type UserStatus = "ACTIVE" | "SUSPENDED";

export interface User {
  avatarUrl: string | null;
  displayName: string;
  email: string;
  id: string;
  role: UserRole;
  status: UserStatus;
}

export interface TokenPair {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  tokenType: "Bearer";
}

export interface AuthSession {
  tokens: TokenPair;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  displayName?: string;
  email: string;
  password: string;
}

export interface GoogleLoginRequest {
  idToken: string;
}
