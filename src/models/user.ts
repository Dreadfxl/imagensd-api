export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  is_premium: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface UserRegistration {
  username: string;
  email: string;
  password: string;
  is_premium?: boolean;
}

export interface UserLogin {
  username: string;
  password: string;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  is_premium: boolean;
  created_at: Date;
}
