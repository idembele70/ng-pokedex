export interface Auth {
}

export interface authPayload {
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