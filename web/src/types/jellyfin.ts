export interface JellyfinUser {
  Id: string;
  Name: string;
  ServerId?: string;
  HasPassword?: boolean;
  HasConfiguredPassword?: boolean;
  HasConfiguredEasyPassword?: boolean;
  EnableAutoLogin?: boolean;
  LastLoginDate?: string;
  LastActivityDate?: string;
  Policy?: Record<string, unknown>;
  Configuration?: Record<string, unknown>;
}

export interface JellyfinAuthenticationResult {
  User: JellyfinUser;
  SessionInfo?: Record<string, unknown>;
  AccessToken: string;
  ServerId: string;
}

export interface JellyfinSession {
  serverUrl: string;
  accessToken: string;
  user: JellyfinUser;
  serverId: string;
}
