using System.Collections.Concurrent;
using StarTune.Plugin.Models;

namespace StarTune.Plugin.Services;

public sealed class InMemoryRatingStore : IRatingStore
{
    private readonly ConcurrentDictionary<(Guid, Guid), RatingRecord> _ratings = new();

    public Task<RatingRecord?> GetAsync(Guid userId, Guid itemId, CancellationToken ct)
    {
        _ratings.TryGetValue((userId, itemId), out var value);
        return Task.FromResult(value);
    }

    public Task<RatingRecord> SetAsync(Guid userId, Guid itemId, int rating, CancellationToken ct)
    {
        if (rating is < 1 or > 5)
            throw new ArgumentOutOfRangeException(nameof(rating));

        var value = new RatingRecord(userId, itemId, rating, DateTimeOffset.UtcNow);
        _ratings[(userId, itemId)] = value;
        return Task.FromResult(value);
    }

    public Task<bool> DeleteAsync(Guid userId, Guid itemId, CancellationToken ct) =>
        Task.FromResult(_ratings.TryRemove((userId, itemId), out _));
}
