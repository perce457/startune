import type {
  JellyfinAudioItem,
  JellyfinAuthenticationResult,
  JellyfinItemsResponse,
  JellyfinSession,
} from "../types/jellyfin";

const CLIENT_NAME = "StarTune";
const DEVICE_NAME = "StarTune Web";
const DEVICE_ID_STORAGE_KEY = "startune-device-id";
const SESSION_STORAGE_KEY = "startune-jellyfin-session";
const CLIENT_VERSION = "0.1.0";

function normalizeServerUrl(serverUrl: string): string {
  const normalized = serverUrl.trim().replace(/\/+$/, "");

  if (!normalized) {
    throw new Error("Jellyfin-palvelimen osoite puuttuu.");
  }

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(normalized);
  } catch {
    throw new Error(
      "Palvelimen osoitteen pitää olla täydellinen URL, esimerkiksi http://localhost:8096.",
    );
  }

  if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
    throw new Error("Jellyfin-palvelimen osoitteen pitää alkaa http:// tai https://.");
  }

  return parsedUrl.toString().replace(/\/+$/, "");
}

function getDeviceId(): string {
  const existingDeviceId = localStorage.getItem(DEVICE_ID_STORAGE_KEY);

  if (existingDeviceId) {
    return existingDeviceId;
  }

  const deviceId = crypto.randomUUID();
  localStorage.setItem(DEVICE_ID_STORAGE_KEY, deviceId);

  return deviceId;
}

function createAuthorizationHeader(accessToken?: string): string {
  const values = [
    `Client="${CLIENT_NAME}"`,
    `Device="${DEVICE_NAME}"`,
    `DeviceId="${getDeviceId()}"`,
    `Version="${CLIENT_VERSION}"`,
  ];

  if (accessToken) {
    values.push(`Token="${accessToken}"`);
  }

  return `MediaBrowser ${values.join(", ")}`;
}

export async function authenticateWithJellyfin(
  serverUrl: string,
  username: string,
  password: string,
): Promise<JellyfinSession> {
  const normalizedServerUrl = normalizeServerUrl(serverUrl);

  const response = await fetch(
    `${normalizedServerUrl}/Users/AuthenticateByName`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: createAuthorizationHeader(),
      },
      body: JSON.stringify({
        Username: username.trim(),
        Pw: password,
      }),
    },
  );

  if (response.status === 401) {
    throw new Error("Käyttäjänimi tai salasana on väärä.");
  }

  if (!response.ok) {
    throw new Error(
      `Jellyfin-kirjautuminen epäonnistui: ${response.status} ${response.statusText}`,
    );
  }

  const result =
    (await response.json()) as JellyfinAuthenticationResult;

  if (!result.AccessToken || !result.User) {
    throw new Error("Jellyfin ei palauttanut kelvollista kirjautumisistuntoa.");
  }

  const session: JellyfinSession = {
    serverUrl: normalizedServerUrl,
    accessToken: result.AccessToken,
    user: result.User,
    serverId: result.ServerId,
  };

  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));

  return session;
}

export function getStoredJellyfinSession(): JellyfinSession | null {
  const storedSession = localStorage.getItem(SESSION_STORAGE_KEY);

  if (!storedSession) {
    return null;
  }

  try {
    return JSON.parse(storedSession) as JellyfinSession;
  } catch {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    return null;
  }
}

export function clearJellyfinSession(): void {
  localStorage.removeItem(SESSION_STORAGE_KEY);
}

export async function jellyfinFetch(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const session = getStoredJellyfinSession();

  if (!session) {
    throw new Error("Jellyfin-istuntoa ei ole.");
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  const headers = new Headers(options.headers);
  headers.set(
    "Authorization",
    createAuthorizationHeader(session.accessToken),
  );

  return fetch(`${session.serverUrl}${normalizedPath}`, {
    ...options,
    headers,
  });
}

export interface GetAudioItemsOptions {
  startIndex?: number;
  limit?: number;
  searchTerm?: string;
}

export async function getAudioItems(
  options: GetAudioItemsOptions = {},
): Promise<JellyfinItemsResponse<JellyfinAudioItem>> {
  const session = getStoredJellyfinSession();

  if (!session) {
    throw new Error("Jellyfin-istuntoa ei ole.");
  }

  const parameters = new URLSearchParams({
    UserId: session.user.Id,
    IncludeItemTypes: "Audio",
    Recursive: "true",
    SortBy: "SortName",
    SortOrder: "Ascending",
    Fields: [
      "PrimaryImageAspectRatio",
      "ProductionYear",
      "Genres",
      "MediaSources",
    ].join(","),
    StartIndex: String(options.startIndex ?? 0),
    Limit: String(options.limit ?? 50),
  });

  const searchTerm = options.searchTerm?.trim();

  if (searchTerm) {
    parameters.set("SearchTerm", searchTerm);
  }

  const response = await jellyfinFetch(`/Items?${parameters.toString()}`);

  if (!response.ok) {
    throw new Error(
      `Musiikkikirjaston hakeminen epäonnistui: HTTP ${response.status}`,
    );
  }

  return (await response.json()) as JellyfinItemsResponse<JellyfinAudioItem>;
}

export function getJellyfinImageUrl(
  itemId: string,
  imageTag?: string,
  maxWidth = 300,
): string | null {
  const session = getStoredJellyfinSession();

  if (!session || !imageTag) {
    return null;
  }

  const parameters = new URLSearchParams({
    tag: imageTag,
    maxWidth: String(maxWidth),
    quality: "90",
  });

  return `${session.serverUrl}/Items/${itemId}/Images/Primary?${parameters.toString()}`;
}
