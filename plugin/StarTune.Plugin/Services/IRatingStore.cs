using StarTune.Plugin.Models;

namespace StarTune.Plugin.Services;

public interface IRatingStore
{
    Task<IReadOnlyList<RatingRecord>> GetAllAsync(
        Guid userId,
        CancellationToken ct);

    Task<RatingRecord?> GetAsync(
        Guid userId,
        Guid itemId,
        CancellationToken ct);

    Task<RatingRecord> SetAsync(
        Guid userId,
        Guid itemId,
        int rating,
        CancellationToken ct);

    Task<bool> DeleteAsync(
        Guid userId,
        Guid itemId,
        CancellationToken ct);
}
