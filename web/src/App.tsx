import { TrackList } from "./components/TrackList";
import { useEffect, useState } from "react";
import {
  clearJellyfinSession,
  getStoredJellyfinSession,
  jellyfinFetch,
} from "./api/jellyfin";
import { getStarTuneHealth } from "./api/startune";
import { LoginPage } from "./pages/LoginPage";
import type { JellyfinSession, JellyfinUser } from "./types/jellyfin";

type AppState = "loading" | "logged-out" | "logged-in";

function App() {
  const [appState, setAppState] = useState<AppState>("loading");
  const [session, setSession] = useState<JellyfinSession | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [pluginStatusMessage, setPluginStatusMessage] = useState("");

  useEffect(() => {
    void restoreSession();
  }, []);

  async function restoreSession(): Promise<void> {
    const storedSession = getStoredJellyfinSession();

    if (!storedSession) {
      setAppState("logged-out");
      return;
    }

    try {
      const response = await jellyfinFetch("/Users/Me");

      if (!response.ok) {
        throw new Error(
          `Istunnon tarkistus epäonnistui: HTTP ${response.status}`,
        );
      }

      const currentUser = (await response.json()) as JellyfinUser;

      setSession({
        ...storedSession,
        user: currentUser,
      });

      setAppState("logged-in");
    } catch (error) {
      console.error(
        "Tallennetun Jellyfin-istunnon palautus epäonnistui:",
        error,
      );

      clearJellyfinSession();
      setSession(null);
      setAppState("logged-out");
    }
  }

  function handleLogin(newSession: JellyfinSession): void {
    setSession(newSession);
    setAppState("logged-in");
    setStatusMessage("");
    setPluginStatusMessage("");
  }

  function handleLogout(): void {
    clearJellyfinSession();
    setSession(null);
    setStatusMessage("");
    setPluginStatusMessage("");
    setAppState("logged-out");
  }

  async function testConnection(): Promise<void> {
    setStatusMessage("Tarkistetaan Jellyfin-yhteyttä…");

    try {
      const response = await jellyfinFetch("/Users/Me");

      if (!response.ok) {
        throw new Error(
          `Jellyfin-yhteyden tarkistus epäonnistui: HTTP ${response.status}`,
        );
      }

      const user = (await response.json()) as JellyfinUser;

      setStatusMessage(
        `Yhteys toimii. Kirjautunut käyttäjä: ${user.Name}`,
      );
    } catch (error) {
      console.error("Jellyfin-yhteystesti epäonnistui:", error);

      setStatusMessage(
        error instanceof Error
          ? error.message
          : "Jellyfin-yhteyden tarkistus epäonnistui.",
      );
    }
  }

  async function testStarTunePlugin(): Promise<void> {
    setPluginStatusMessage("Tarkistetaan StarTune-pluginia…");

    try {
      const result = await getStarTuneHealth();

      const status =
        typeof result.status === "string" ? result.status : "ok";

      const version =
        typeof result.version === "string"
          ? `, versio ${result.version}`
          : "";

      const message =
        typeof result.message === "string"
          ? ` – ${result.message}`
          : "";

      setPluginStatusMessage(
        `StarTune-plugin vastaa: ${status}${version}${message}`,
      );
    } catch (error) {
      console.error("StarTune-pluginin yhteystesti epäonnistui:", error);

      setPluginStatusMessage(
        error instanceof Error
          ? error.message
          : "StarTune-pluginin yhteystesti epäonnistui.",
      );
    }
  }

  if (appState === "loading") {
    return (
      <main className="centered-page">
        <section className="card">
          <h1>StarTune</h1>
          <p>Tarkistetaan Jellyfin-istuntoa…</p>
        </section>
      </main>
    );
  }

  if (appState === "logged-out" || !session) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <main className="dashboard-page">
      <header className="app-header">
        <div>
          <h1>StarTune</h1>
          <p>Music ratings and smart playlists for Jellyfin</p>
        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={handleLogout}
        >
          Kirjaudu ulos
        </button>
      </header>

      <section className="dashboard-grid">
        <article className="card">
          <h2>Tervetuloa, {session.user.Name}</h2>

          <dl className="session-details">
            <div>
              <dt>Jellyfin-palvelin</dt>
              <dd>{session.serverUrl}</dd>
            </div>

            <div>
              <dt>Käyttäjätunnus</dt>
              <dd>{session.user.Name}</dd>
            </div>

            <div>
              <dt>Käyttäjän ID</dt>
              <dd>{session.user.Id}</dd>
            </div>
          </dl>
        </article>

        <article className="card">
          <h2>Jellyfin-yhteys</h2>

          <p>
            Tarkista, että tallennettu Jellyfin-istunto toimii edelleen.
          </p>

          <button
            type="button"
            onClick={() => void testConnection()}
          >
            Testaa Jellyfin-yhteys
          </button>

          {statusMessage && (
            <p className="status-message" role="status">
              {statusMessage}
            </p>
          )}
        </article>

        <article className="card">
          <h2>StarTune-plugin</h2>

          <p>
            Tarkista, että Jellyfin-palvelimelle asennettu StarTune-plugin
            vastaa web-käyttöliittymän pyyntöihin.
          </p>

          <button
            type="button"
            onClick={() => void testStarTunePlugin()}
          >
            Testaa StarTune-plugin
          </button>

          {pluginStatusMessage && (
            <p className="status-message" role="status">
              {pluginStatusMessage}
            </p>
          )}
        </article>
      </section>

      <TrackList />
    </main>
  );
}

export default App;
