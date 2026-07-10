# Plugin development

Check versions:

```bash
jellyfin --version
dotnet --list-sdks
```

Build:

```bash
cd plugin/StarTune.Plugin
dotnet restore
dotnet build -c Debug
```

Initial endpoint:

```text
http://localhost:8096/StarTune/health
```

The initial rating store is temporary and loses data at restart.
Persistent storage is a Milestone 1 task.
