export interface AuthResponse {
  access_token: string;
  expires_in: number;
  grant_type: string;
  jti: string;
  organization: number;
  refresh_token: string;
  scope: string;
  token_type: string;
  user_id: number;
  username: string;
  language: string;
}
