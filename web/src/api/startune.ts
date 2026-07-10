import {
  getStoredJellyfinSession,
  jellyfinFetch,
} from "./jellyfin";

export interface StarTuneHealthResponse {
  status?: string;
  message?: string;
  version?: string;
  plugin?: string;
  [key: string]: unknown;
}

export interface StarTuneRating {
  userId: string;
  itemId: string;
  rating: number;
  updatedAt: string;
}

interface StarTuneRatingApiResponse {
  userId?: string;
  UserId?: string;
  itemId?: string;
  ItemId?: string;
  rating?: number;
  Rating?: number;
  updatedAt?: string;
  UpdatedAt?: string;
}

function getCurrentUserId(): string {
  const session = getStoredJellyfinSession();

  if (!session) {
    throw new Error("Jellyfin-istuntoa ei ole.");
  }

  return session.user.Id;
}

function normalizeRatingResponse(
  response: StarTuneRatingApiResponse,
): StarTuneRating {
  const userId = response.userId ?? response.UserId;
  const itemId = response.itemId ?? response.ItemId;
  const rating = response.rating ?? response.Rating;
  const updatedAt = response.updatedAt ?? response.UpdatedAt;

  if (
    !userId
    || !itemId
    || typeof rating !== "number"
    || !updatedAt
  ) {
    console.error("Virheellinen rating-vastaus:", response);
    throw new Error("StarTune-plugin palautti virheellisen arviointivastauksen.");
  }

  return {
    userId,
    itemId,
    rating,
    updatedAt,
  };
}

export async function getStarTuneHealth(): Promise<StarTuneHealthResponse> {
  const response = await jellyfinFetch("/StarTune/health");

  if (!response.ok) {
    throw new Error(
      `StarTune-plugin ei vastannut oikein: HTTP ${response.status}`,
    );
  }

  return (await response.json()) as StarTuneHealthResponse;
}

export async function getRating(
  itemId: string,
): Promise<StarTuneRating | null> {
  const userId = getCurrentUserId();

  const response = await jellyfinFetch(
    `/StarTune/users/${encodeURIComponent(userId)}/ratings/${encodeURIComponent(itemId)}`,
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      `Arvion hakeminen epäonnistui: HTTP ${response.status}`,
    );
  }

  const result =
    (await response.json()) as StarTuneRatingApiResponse;

  return normalizeRatingResponse(result);
}

export async function saveRating(
  itemId: string,
  rating: number,
): Promise<StarTuneRating> {
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new Error("Arvosanan pitää olla kokonaisluku väliltä 1–5.");
  }

  const userId = getCurrentUserId();

  const response = await jellyfinFetch(
    `/StarTune/users/${encodeURIComponent(userId)}/ratings/${encodeURIComponent(itemId)}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rating,
      }),
    },
  );

  if (!response.ok) {
    const responseText = await response.text();

    throw new Error(
      `Arvion tallentaminen epäonnistui: HTTP ${response.status}${
        responseText ? ` – ${responseText}` : ""
      }`,
    );
  }

  const result =
    (await response.json()) as StarTuneRatingApiResponse;

  return normalizeRatingResponse(result);
}

export async function deleteRating(itemId: string): Promise<void> {
  const userId = getCurrentUserId();

  const response = await jellyfinFetch(
    `/StarTune/users/${encodeURIComponent(userId)}/ratings/${encodeURIComponent(itemId)}`,
    {
      method: "DELETE",
    },
  );

  if (response.status === 404) {
    return;
  }

  if (!response.ok) {
    throw new Error(
      `Arvion poistaminen epäonnistui: HTTP ${response.status}`,
    );
  }
}
