import { jellyfinFetch } from "./jellyfin";

export interface StarTuneHealthResponse {
  status?: string;
  message?: string;
  version?: string;
  plugin?: string;
  [key: string]: unknown;
}

export async function getStarTuneHealth(): Promise<StarTuneHealthResponse> {
  const response = await jellyfinFetch("/StarTune/health");

  if (!response.ok) {
    throw new Error(
      `StarTune-plugin ei vastannut oikein: ${response.status} ${response.statusText}`,
    );
  }

  return (await response.json()) as StarTuneHealthResponse;
}
