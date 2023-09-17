export type OAuthRequest = {
  client_id: string;
  grant_type: string;
  code: string;
  redirect_uri: string;
  grant_id: string;
  code_verifier: string;
  refresh_token?: string;
};
