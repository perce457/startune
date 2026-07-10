# Architecture

## Plugin

The Jellyfin plugin will:

- expose authenticated `/StarTune` API endpoints
- store ratings as `UserId + ItemId + Rating`
- evaluate smart-playlist rules
- create/update Jellyfin playlists
- optionally refresh playlists on a schedule

The plugin must not modify Jellyfin's core database directly.

## Web client

The web client will:

- authenticate with Jellyfin
- browse artists, albums and tracks
- display clickable 1–5 star ratings
- manage favorites and smart playlists
- call the StarTune plugin API

## Integration

StarTune remains a separate web client but can be linked from Jellyfin Web
using a custom navigation menu link. This is more stable than JavaScript injection.
