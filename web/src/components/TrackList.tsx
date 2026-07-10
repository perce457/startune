import { useEffect, useState } from "react";
import {
  getAudioItems,
  getJellyfinImageUrl,
} from "../api/jellyfin";
import type { JellyfinAudioItem } from "../types/jellyfin";

function formatRuntime(runTimeTicks?: number): string {
  if (!runTimeTicks) {
    return "–";
  }

  const totalSeconds = Math.floor(runTimeTicks / 10_000_000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function getArtistName(item: JellyfinAudioItem): string {
  if (item.Artists?.length) {
    return item.Artists.join(", ");
  }

  if (item.AlbumArtists?.length) {
    return item.AlbumArtists.map((artist) => artist.Name).join(", ");
  }

  return "Tuntematon esittäjä";
}

export function TrackList() {
  const [tracks, setTracks] = useState<JellyfinAudioItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    void loadTracks();
  }, []);

  async function loadTracks(term = ""): Promise<void> {
    setLoading(true);
    setErrorMessage("");

    try {
      const result = await getAudioItems({
        limit: 50,
        searchTerm: term,
      });

      setTracks(result.Items);
      setTotalCount(result.TotalRecordCount);
    } catch (error) {
      console.error("Kappaleiden hakeminen epäonnistui:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Kappaleiden hakeminen epäonnistui.",
      );
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    void loadTracks(searchTerm);
  }

  return (
    <section className="library-section">
      <div className="library-heading">
        <div>
          <h2>Musiikkikirjasto</h2>
          <p>
            {loading
              ? "Haetaan kappaleita…"
              : `${totalCount} kappaletta Jellyfin-kirjastossa`}
          </p>
        </div>

        <form className="track-search" onSubmit={handleSearch}>
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Hae kappaletta tai esittäjää"
            aria-label="Hae musiikkikirjastosta"
          />

          <button type="submit" disabled={loading}>
            Hae
          </button>
        </form>
      </div>

      {errorMessage && (
        <p role="alert">
          {errorMessage}
        </p>
      )}

      {!loading && !errorMessage && tracks.length === 0 && (
        <p>Musiikkikirjastosta ei löytynyt kappaleita.</p>
      )}

      {tracks.length > 0 && (
        <div className="track-list">
          {tracks.map((track) => {
            const imageUrl = getJellyfinImageUrl(
              track.Id,
              track.ImageTags?.Primary,
            );

            return (
              <article className="track-row" key={track.Id}>
                <div className="track-cover">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt=""
                      loading="lazy"
                    />
                  ) : (
                    <span aria-hidden="true">♪</span>
                  )}
                </div>

                <div className="track-info">
                  <strong>{track.Name}</strong>
                  <span>{getArtistName(track)}</span>
                </div>

                <div className="track-album">
                  {track.Album ?? "Tuntematon albumi"}
                </div>

                <div className="track-runtime">
                  {formatRuntime(track.RunTimeTicks)}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
