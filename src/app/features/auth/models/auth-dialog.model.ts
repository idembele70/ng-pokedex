import { CurrentUser } from "../../../core/models/auth.model";

export interface AuthPayload {
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  user: {
    id: string;
    email: string;
  }
}

export interface LoginResponse extends CurrentUser {
  accessToken: string;
}