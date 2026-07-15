# Roadmap

## Milestone 0
- [x] Name and architecture
- [x] Repository scaffold
- [x] Plugin skeleton
- [x] Web prototype
- [x] GPL license

## Milestone 1
- [ ] Confirm installed Jellyfin version
- [ ] Compile and install plugin
- [ ] Resolve authenticated Jellyfin user
- [ ] Persist ratings
- [ ] Connect web stars to plugin API

## Milestone 2
- [ ] Music browser
- [ ] Covers, artists, albums and search
- [ ] Favorites and rating filters

## Milestone 3
- [ ] Smart-playlist rule builder
- [ ] Most played / recently played rules
- [ ] Scheduled playlist refresh

## Milestone 4
- [ ] GitHub Actions
- [ ] Plugin repository manifest
- [ ] Docker/Flatpak/AppImage distribution
- [ ] Documentation and screenshots

# StarTune Technical Roadmap

## Project goal

StarTune adds persistent music ratings and smart playlist features to Jellyfin through:

* a Jellyfin server plugin
* a React/Vite web client
* optional integration into the Jellyfin Web menu

The roadmap prioritizes small, testable changes. Each feature should be built, tested, and committed separately.

---

# v0.3 — Ratings foundation

## Goal

Complete the rating system and make it efficient enough for larger music libraries.

## Features

### Rating persistence

* Store ratings permanently in `ratings.json`.
* Support ratings from 1 to 5 stars.
* Support reading, updating, and deleting individual ratings.

### Rating list API

Add:

```text
GET /StarTune/users/{userId}/ratings
```

The endpoint returns all ratings belonging to one Jellyfin user.

### Efficient rating loading

Replace one request per track with one request for all ratings.

Current approach:

```text
50 tracks = up to 50 rating requests
```

Target approach:

```text
50 tracks = 1 rating request
```

### Rating summary

Display:

* total number of rated tracks
* number of 4–5 star tracks
* rating distribution from 1 to 5 stars

## Completion criteria

* Ratings survive Jellyfin restarts.
* Rating list endpoint works.
* Web client loads ratings using one request.
* Existing star rating controls continue to work.
* Plugin and web builds pass.

---

# v0.4 — Library filtering and rated tracks

## Goal

Make ratings useful when browsing the music library.

## Features

### Rating filters

Add filters for:

* all tracks
* rated tracks only
* unrated tracks
* 5-star tracks
* 4 stars or higher
* 3 stars or lower

### Sorting

Support sorting by:

* track name
* artist
* album
* rating
* most recently rated

### Rated tracks view

Add a dedicated view showing only tracks rated by the current user.

### Search improvements

Allow search results to retain StarTune ratings and active filters.

## Completion criteria

* Filters work without reloading the page.
* Search and rating filters work together.
* Ratings remain correct when changing views.
* Mobile layout remains usable.

---

# v0.5 — First smart playlists

## Goal

Create real Jellyfin playlists from StarTune ratings.

## Features

### Playlist creation service

Add a plugin service responsible for creating and updating Jellyfin playlists.

### First playlist rule

Create a playlist containing all tracks rated 4 or 5 stars.

Example:

```text
StarTune Favorites
Minimum rating: 4
```

### Playlist creation API

Proposed endpoint:

```text
POST /StarTune/users/{userId}/playlists
```

Example request:

```json
{
  "name": "StarTune Favorites",
  "minimumRating": 4
}
```

### Web controls

Add:

```text
Create 4–5 star playlist
```

Display:

* playlist name
* number of selected tracks
* success or error message

## Completion criteria

* Playlist appears in Jellyfin.
* Only matching tracks are included.
* Empty playlists are not created accidentally.
* Duplicate creation is handled safely.

---

# v0.6 — Playlist synchronization

## Goal

Keep StarTune playlists synchronized with changing ratings.

## Features

### Update existing playlists

When ratings change, StarTune can update an existing smart playlist rather than creating duplicates.

### Synchronization modes

Support:

* manual synchronization
* synchronization when pressing a button
* optional scheduled synchronization

### Playlist metadata

Store enough information to identify:

* playlist ID
* playlist owner
* rating rule
* last synchronization time

### Safe synchronization

StarTune should only manage playlists that it created or that the user explicitly selected.

## Completion criteria

* Raising or lowering a rating updates playlist membership.
* Removed ratings remove tracks from managed playlists.
* Manual Jellyfin playlists are never modified accidentally.
* Synchronization errors are logged clearly.

---

# v0.7 — Custom smart playlist rules

## Goal

Allow users to define more useful playlist conditions.

## Features

### Rating conditions

Support:

* exact rating
* minimum rating
* maximum rating
* rating range

### Library metadata conditions

Support combinations involving:

* artist
* album
* genre
* release year
* library
* track duration

### Rule examples

```text
Rating at least 4
Genre contains Rock
Release year from 1990 to 1999
```

### Rule editor

Create a simple web interface for building playlist rules.

## Completion criteria

* Users can create and save multiple smart playlist definitions.
* Rules are validated before saving.
* Invalid or empty rules produce clear error messages.
* Saved rules survive server restarts.

---

# v0.8 — Configuration and administration

## Goal

Make StarTune easier to install, manage, and troubleshoot.

## Features

### Plugin configuration page

Add settings for:

* scheduled refresh
* synchronization interval
* default playlist naming
* logging level
* managed playlist behavior

### Diagnostics

Display:

* plugin version
* API version
* rating store status
* number of stored ratings
* number of smart playlists
* last synchronization result

### Deployment improvements

Update deployment scripts so they can:

* build the web client
* deploy files to Nginx
* install the plugin DLL
* restart Jellyfin
* restore the Jellyfin Web menu link when required

### Backup and recovery

Document how to back up:

```text
ratings.json
smart playlist definitions
plugin configuration
```

## Completion criteria

* Installation steps are documented.
* Deployment can be repeated safely.
* Jellyfin updates do not permanently remove the StarTune menu integration.
* Rating data can be backed up and restored.

---

# v0.9 — Reliability and release preparation

## Goal

Prepare the project for public testing.

## Features

### Authorization validation

Ensure users can only access and modify their own StarTune data unless explicitly authorized.

### Error handling

Improve errors for:

* missing Jellyfin session
* invalid item IDs
* deleted tracks
* inaccessible libraries
* playlist creation failures
* corrupted rating files

### Data migration

Add a version field to stored StarTune data and support future schema migrations.

### Automated tests

Add tests for:

* rating storage
* rating API
* playlist rule evaluation
* playlist synchronization
* authorization checks

### Documentation

Complete:

* installation guide
* configuration guide
* API documentation
* architecture documentation
* troubleshooting guide
* contribution guide

## Completion criteria

* Plugin and web CI builds pass.
* Core services have automated tests.
* Existing data remains compatible after updates.
* Installation succeeds from a clean Jellyfin setup.

---

# v1.0 — Stable release

## Goal

Release a stable version suitable for normal Jellyfin users.

## Required features

* Jellyfin authentication
* persistent per-user ratings
* efficient rating loading
* rating filters and sorting
* smart playlist creation
* smart playlist synchronization
* custom rating-based playlist rules
* plugin configuration
* backup and recovery documentation
* automated build checks
* stable installation process

## Release requirements

* No known critical data-loss bugs.
* No unauthorized cross-user access.
* Ratings survive upgrades and restarts.
* Smart playlists synchronize predictably.
* Installation and upgrade instructions are tested.
* GPL-3.0-or-later license is included.
* GitHub release contains plugin and web artifacts.

---

# Development workflow

Each roadmap item should follow this cycle:

```text
1. Create or select a feature branch
2. Make one small change
3. Run formatting and build checks
4. Test manually
5. Commit the change
6. Push to GitHub
7. Continue to the next small change
```

Recommended commit examples:

```text
feat(plugin): add list ratings endpoint
perf(web): load ratings with single request
feat(web): add rating summary
feat(web): add rating filters
feat(plugin): create rating-based playlists
feat(plugin): synchronize managed playlists
docs: update StarTune installation guide
```

Avoid combining plugin, web, deployment, and documentation changes into one large commit unless they are inseparable.

---

# Immediate next steps

The current development sequence is:

1. Finish and commit the rating list endpoint.
2. Install the updated plugin in Jellyfin.
3. Test the endpoint independently.
4. Update the React client to use one rating request.
5. Test existing star rating behavior.
6. Add the rating summary as a separate commit.
7. Begin the first smart playlist implementation.
