using System.Text.Json;
using MediaBrowser.Controller;
using StarTune.Plugin.Models;

namespace StarTune.Plugin.Services;

public sealed class JsonRatingStore : IRatingStore
{
    private readonly string _filePath;
    private readonly SemaphoreSlim _lock = new(1, 1);
    private Dictionary<string, RatingRecord> _ratings = new();

    public JsonRatingStore(IServerApplicationPaths paths)
    {
        var directory = Path.Combine(paths.PluginConfigurationsPath, "StarTune");
        Directory.CreateDirectory(directory);

        _filePath = Path.Combine(directory, "ratings.json");
        Load();
    }

    public async Task<RatingRecord?> GetAsync(
        Guid userId,
        Guid itemId,
        CancellationToken cancellationToken)
    {
        await _lock.WaitAsync(cancellationToken);

        try
        {
            _ratings.TryGetValue(CreateKey(userId, itemId), out var value);
            return value;
        }
        finally
        {
            _lock.Release();
        }
    }

    public async Task<RatingRecord> SetAsync(
        Guid userId,
        Guid itemId,
        int rating,
        CancellationToken cancellationToken)
    {
        if (rating is < 1 or > 5)
        {
            throw new ArgumentOutOfRangeException(
                nameof(rating),
                "Rating must be between 1 and 5.");
        }

        var record = new RatingRecord(
            userId,
            itemId,
            rating,
            DateTimeOffset.UtcNow);

        await _lock.WaitAsync(cancellationToken);

        try
        {
            _ratings[CreateKey(userId, itemId)] = record;
            await SaveAsync(cancellationToken);
            return record;
        }
        finally
        {
            _lock.Release();
        }
    }

    public async Task<bool> DeleteAsync(
        Guid userId,
        Guid itemId,
        CancellationToken cancellationToken)
    {
        await _lock.WaitAsync(cancellationToken);

        try
        {
            var removed = _ratings.Remove(CreateKey(userId, itemId));

            if (removed)
            {
                await SaveAsync(cancellationToken);
            }

            return removed;
        }
        finally
        {
            _lock.Release();
        }
    }

    private void Load()
    {
        if (!File.Exists(_filePath))
        {
            return;
        }

        try
        {
            var json = File.ReadAllText(_filePath);

            _ratings =
                JsonSerializer.Deserialize<Dictionary<string, RatingRecord>>(json)
                ?? new Dictionary<string, RatingRecord>();
        }
        catch
        {
            _ratings = new Dictionary<string, RatingRecord>();
        }
    }

    private async Task SaveAsync(CancellationToken cancellationToken)
    {
        var temporaryFile = _filePath + ".tmp";

        var json = JsonSerializer.Serialize(
            _ratings,
            new JsonSerializerOptions
            {
                WriteIndented = true
            });

        await File.WriteAllTextAsync(
            temporaryFile,
            json,
            cancellationToken);

        File.Move(temporaryFile, _filePath, true);
    }

    private static string CreateKey(Guid userId, Guid itemId)
    {
        return $"{userId:N}:{itemId:N}";
    }
}
