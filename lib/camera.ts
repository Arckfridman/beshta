export const MIN_ZOOM = 0.55;
export const MAX_ZOOM = 2.25;
export const DEFAULT_ZOOM = 1;

export const INERTIA = {
  power: 0.32,
  timeConstant: 380,
  bounceStiffness: 0,
  modifyTarget: (t: number) => t,
};

export const ZOOM_INERTIA = {
  power: 0.38,
  timeConstant: 320,
  bounceStiffness: 0,
  modifyTarget: (t: number) => t,
};

/** Gentler per-tick wheel zoom; inertia carries the rest on release. */
export const WHEEL_ZOOM_SENSITIVITY = 0.002;

export function clampZoom(scale: number) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, scale));
}

export function snapZoom(scale: number) {
  const midpoint = (DEFAULT_ZOOM + MIN_ZOOM) / 2;
  return scale >= midpoint ? DEFAULT_ZOOM : MIN_ZOOM;
}

export function zoomAtScreenPoint(
  screenX: number,
  screenY: number,
  panX: number,
  panY: number,
  scale: number,
  nextScale: number,
) {
  const clamped = clampZoom(nextScale);
  const worldX = (screenX - panX) / scale;
  const worldY = (screenY - panY) / scale;

  return {
    scale: clamped,
    panX: screenX - worldX * clamped,
    panY: screenY - worldY * clamped,
  };
}

export function applyWheelZoom(
  deltaY: number,
  screenX: number,
  screenY: number,
  panX: number,
  panY: number,
  scale: number,
  sensitivity = WHEEL_ZOOM_SENSITIVITY,
) {
  const factor = Math.exp(-deltaY * sensitivity);
  return zoomAtScreenPoint(screenX, screenY, panX, panY, scale, scale * factor);
}

export function focalWorldPoint(
  screenX: number,
  screenY: number,
  panX: number,
  panY: number,
  scale: number,
) {
  return {
    worldX: (screenX - panX) / scale,
    worldY: (screenY - panY) / scale,
  };
}

export function panForFocal(
  screenX: number,
  screenY: number,
  worldX: number,
  worldY: number,
  scale: number,
) {
  return {
    panX: screenX - worldX * scale,
    panY: screenY - worldY * scale,
  };
}

export function centerViewportAt(
  cx: number,
  cy: number,
  zoom: number,
  viewW: number,
  viewH: number,
) {
  return {
    panX: viewW / 2 - cx * zoom,
    panY: viewH / 2 - cy * zoom,
    scale: zoom,
  };
}
