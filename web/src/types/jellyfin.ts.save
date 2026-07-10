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

export interface JellyfinImageTags {
  Primary?: string;
  [key: string]: string | undefined;
}

export interface JellyfinAudioItem {
  Id: string;
  Name: string;
  Album?: string;
  AlbumId?: string;
  Artists?: string[];
  AlbumArtists?: Array<{
    Name: string;
    Id: string;
  }>;
  RunTimeTicks?: number;
  ProductionYear?: number;
  IndexNumber?: number;
  ParentIndexNumber?: number;
  ImageTags?: JellyfinImageTags;
  PrimaryImageAspectRatio?: number;
  Type?: string;
}

export interface JellyfinItemsResponse<T> {
  Items: T[];
  TotalRecordCount: number;
  StartIndex: number;
}
