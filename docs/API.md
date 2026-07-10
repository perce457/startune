# Initial API draft

Base route: `/StarTune`

- `GET /StarTune/health`
- `GET /StarTune/ratings/{itemId}`
- `PUT /StarTune/ratings/{itemId}` with `{ "rating": 1..5 }`
- `DELETE /StarTune/ratings/{itemId}`
- `GET /StarTune/smart-playlists`
- `POST /StarTune/smart-playlists`
- `POST /StarTune/smart-playlists/{id}/refresh`
