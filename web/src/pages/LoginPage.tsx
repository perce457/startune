import { useState } from "react";
import type { FormEvent } from "react";
import { authenticateWithJellyfin } from "../api/jellyfin";
import type { JellyfinSession } from "../types/jellyfin";

interface LoginPageProps {
  onLogin: (session: JellyfinSession) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [serverUrl, setServerUrl] = useState("http://localhost:8096");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setIsLoggingIn(true);

    try {
      const session = await authenticateWithJellyfin(
        serverUrl,
        username,
        password,
      );

      onLogin(session);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Kirjautuminen epäonnistui.",
      );
    } finally {
      setIsLoggingIn(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <h1>StarTune</h1>
        <p>Kirjaudu Jellyfin-palvelimellesi.</p>

        <form onSubmit={handleSubmit}>
          <label>
            Jellyfin-palvelimen osoite
            <input
              type="url"
              value={serverUrl}
              onChange={(event) => setServerUrl(event.target.value)}
              placeholder="http://localhost:8096"
              autoComplete="url"
              required
            />
          </label>

          <label>
            Käyttäjänimi
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              required
            />
          </label>

          <label>
            Salasana
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />
          </label>

          {error && <p role="alert">{error}</p>}

          <button type="submit" disabled={isLoggingIn}>
            {isLoggingIn ? "Kirjaudutaan…" : "Kirjaudu"}
          </button>
        </form>
      </section>
    </main>
  );
}
