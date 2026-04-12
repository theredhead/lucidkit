/** Size of a single map tile in pixels. */
export const TILE_SIZE = 256;

/**
 * Converts a geographic coordinate to an absolute pixel position
 * on the Mercator tile grid at the given zoom level.
 */
export function latLngToPixel(
  lat: number,
  lng: number,
  zoom: number,
): { x: number; y: number } {
  const scale = TILE_SIZE * Math.pow(2, zoom);
  const x = ((lng + 180) / 360) * scale;
  const latRad = (lat * Math.PI) / 180;
  const y =
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) *
    scale;
  return { x, y };
}

/**
 * Converts a geographic coordinate to a viewport-relative pixel
 * position, given the map centre and viewport dimensions.
 */
export function latLngToViewport(
  lat: number,
  lng: number,
  zoom: number,
  centerLat: number,
  centerLng: number,
  viewportWidth: number,
  viewportHeight: number,
): { x: number; y: number } {
  const center = latLngToPixel(centerLat, centerLng, zoom);
  const point = latLngToPixel(lat, lng, zoom);
  return {
    x: point.x - center.x + viewportWidth / 2,
    y: point.y - center.y + viewportHeight / 2,
  };
}

/** Metadata for a single tile `<img>` to render. */
export interface TileDescriptor {

  /** Unique key for `@for` tracking. */
  key: string;

  /** Resolved tile image URL. */
  url: string;

  /** Viewport-relative left offset in pixels. */
  left: number;

  /** Viewport-relative top offset in pixels. */
  top: number;
}

/**
 * Computes the set of tiles needed to fill a viewport centred on
 * the given geographic coordinate at the given zoom level.
 */
export function computeTiles(
  centerLat: number,
  centerLng: number,
  zoom: number,
  viewportWidth: number,
  viewportHeight: number,
  tileUrlTemplate: string,
): TileDescriptor[] {
  if (viewportWidth <= 0 || viewportHeight <= 0) return [];

  const center = latLngToPixel(centerLat, centerLng, zoom);
  const topLeftX = center.x - viewportWidth / 2;
  const topLeftY = center.y - viewportHeight / 2;

  const maxTile = Math.pow(2, zoom);
  const minTileX = Math.floor(topLeftX / TILE_SIZE);
  const maxTileX = Math.floor((topLeftX + viewportWidth - 1) / TILE_SIZE);
  const minTileY = Math.max(0, Math.floor(topLeftY / TILE_SIZE));
  const maxTileY = Math.min(
    maxTile - 1,
    Math.floor((topLeftY + viewportHeight - 1) / TILE_SIZE),
  );

  const tiles: TileDescriptor[] = [];

  for (let ty = minTileY; ty <= maxTileY; ty++) {
    for (let tx = minTileX; tx <= maxTileX; tx++) {
      const wrappedX = ((tx % maxTile) + maxTile) % maxTile;
      const url = tileUrlTemplate
        .replace("{x}", String(wrappedX))
        .replace("{y}", String(ty))
        .replace("{z}", String(zoom));

      tiles.push({
        key: `${zoom}-${tx}-${ty}`,
        url,
        left: tx * TILE_SIZE - topLeftX,
        top: ty * TILE_SIZE - topLeftY,
      });
    }
  }

  return tiles;
}

/**
 * Builds an SVG `d` attribute for an open polyline from viewport-relative
 * points.
 */
export function pointsToPolylinePath(
  points: { x: number; y: number }[],
): string {
  if (points.length === 0) return "";
  return points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");
}

/**
 * Builds an SVG `d` attribute for a closed polygon from viewport-relative
 * points.
 */
export function pointsToPolygonPath(
  points: { x: number; y: number }[],
): string {
  if (points.length === 0) return "";
  return (
    points
      .map(
        (p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`,
      )
      .join(" ") + " Z"
  );
}
