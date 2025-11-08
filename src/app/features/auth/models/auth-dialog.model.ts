export interface Auth {
}

export interface authPayload {
  email: string;
  password: string;
}

export interface RegisterReponse {
  message: string;
  user: {
    id: string;
    email: string;
  }
}