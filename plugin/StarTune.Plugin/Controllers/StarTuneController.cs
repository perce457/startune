using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StarTune.Plugin.Models;
using StarTune.Plugin.Services;

namespace StarTune.Plugin.Controllers;

[ApiController]
[Route("StarTune")]
[Authorize]
public sealed class StarTuneController : ControllerBase
{
    private readonly IRatingStore _ratingStore;

    public StarTuneController(IRatingStore ratingStore)
    {
        _ratingStore = ratingStore;
    }

    [HttpGet("health")]
    [AllowAnonymous]
    public ActionResult<object> GetHealth()
    {
        return Ok(new
        {
            name = "StarTune",
            status = "ok",
            apiVersion = "0.2"
        });
    }

    [HttpGet("users/{userId:guid}/ratings/{itemId:guid}")]
    public async Task<ActionResult<RatingResponse>> GetRating(
        Guid userId,
        Guid itemId,
        CancellationToken cancellationToken)
    {
        var record = await _ratingStore.GetAsync(
            userId,
            itemId,
            cancellationToken);

        if (record is null)
        {
            return NotFound(new
            {
                message = "Rating not found.",
                userId,
                itemId
            });
        }

        return Ok(ToResponse(record));
    }

    [HttpPut("users/{userId:guid}/ratings/{itemId:guid}")]
    public async Task<ActionResult<RatingResponse>> SetRating(
        Guid userId,
        Guid itemId,
        [FromBody] SetRatingRequest request,
        CancellationToken cancellationToken)
    {
        if (request.Rating is < 1 or > 5)
        {
            return BadRequest(new
            {
                message = "Rating must be between 1 and 5."
            });
        }

        var record = await _ratingStore.SetAsync(
            userId,
            itemId,
            request.Rating,
            cancellationToken);

        return Ok(ToResponse(record));
    }

    [HttpDelete("users/{userId:guid}/ratings/{itemId:guid}")]
    public async Task<IActionResult> DeleteRating(
        Guid userId,
        Guid itemId,
        CancellationToken cancellationToken)
    {
        var deleted = await _ratingStore.DeleteAsync(
            userId,
            itemId,
            cancellationToken);

        if (!deleted)
        {
            return NotFound(new
            {
                message = "Rating not found.",
                userId,
                itemId
            });
        }

        return NoContent();
    }

    private static RatingResponse ToResponse(RatingRecord record)
    {
        return new RatingResponse(
            record.UserId,
            record.ItemId,
            record.Rating,
            record.UpdatedAt);
    }
}

public sealed record SetRatingRequest(int Rating);

public sealed record RatingResponse(
    Guid UserId,
    Guid ItemId,
    int Rating,
    DateTimeOffset UpdatedAt);
