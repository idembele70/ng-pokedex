export type AuthMode = 
  | 'login'
  | 'register';

export interface CurrentUser {
  userId: string;
  email: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}