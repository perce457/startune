# StarTune

**Music ratings and smart playlists for Jellyfin**

StarTune is an open-source hybrid project:

- Jellyfin server plugin for per-user ratings and smart-playlist logic
- Separate web client for music browsing and clickable star ratings
- Optional custom link in Jellyfin Web

## Status

Early architecture scaffold.

## Layout

- `plugin/` — C# / .NET Jellyfin plugin
- `web/` — React/Vite web client
- `docs/` — architecture, API and roadmap
- `scripts/` — development helpers

## Compatibility

Jellyfin plugin package versions must match the installed Jellyfin server.
Run `jellyfin --version`, then adjust the versions in the plugin `.csproj`.

## License

GPL-3.0-or-later.
