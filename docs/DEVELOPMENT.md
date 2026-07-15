# StarTune Development Structure

StarTune development is divided into three parallel tracks.

## 1. Plugin track

Directory:

```text
plugin/
```

Responsibilities:

* Jellyfin plugin
* StarTune API endpoints
* rating persistence
* authorization
* playlist creation
* playlist synchronization
* plugin configuration
* scheduled tasks
* server-side tests

Commit prefixes:

```text
feat(plugin):
fix(plugin):
refactor(plugin):
test(plugin):
```

Example:

```text
feat(plugin): add list ratings endpoint
```

## 2. Web track

Directory:

```text
web/
```

Responsibilities:

* Jellyfin authentication
* music library view
* star rating controls
* rating summaries
* filtering and sorting
* smart playlist controls
* responsive layout
* client-side error handling
* web tests

Commit prefixes:

```text
feat(web):
fix(web):
refactor(web):
perf(web):
test(web):
style(web):
```

Example:

```text
perf(web): load ratings with single request
```

## 3. Infrastructure track

Directories:

```text
scripts/
.github/
```

Responsibilities:

* plugin deployment
* web deployment
* Nginx configuration
* Jellyfin Web menu integration
* environment checks
* GitHub Actions
* release packaging
* installation and upgrade automation

Commit prefixes:

```text
build:
ci:
chore:
fix(deploy):
```

Example:

```text
fix(deploy): restore Jellyfin menu integration
```

## Documentation

Directory:

```text
docs/
```

Responsibilities:

* architecture
* API documentation
* roadmap
* installation
* troubleshooting
* development workflow

Commit prefix:

```text
docs:
```

## Development rule

Each commit should normally affect only one development track.

Preferred workflow:

```text
1. Make one small change
2. Build the affected component
3. Test the change
4. Review git diff
5. Commit
6. Continue to the next track
```

Plugin build:

```bash
dotnet build plugin/StarTune.Plugin/StarTune.Plugin.csproj
```

Web build:

```bash
cd web
npm run build
```

Full status check:

```bash
git status
git diff --check
```

Avoid combining unrelated plugin, web, deployment, and documentation changes in one commit.
