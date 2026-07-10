namespace StarTune.Plugin.Models;

public sealed record RatingRecord(
    Guid UserId,
    Guid ItemId,
    int Rating,
    DateTimeOffset UpdatedAt);
