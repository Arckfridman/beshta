"use client";

import { useCallback, useEffect, useRef } from "react";
import { animate, useMotionValue } from "framer-motion";
import { getFieldCentroid } from "@/lib/artworks";
import {
  DEFAULT_ZOOM,
  INERTIA,
  ZOOM_INERTIA,
  applyWheelZoom,
  centerViewportAt,
  clampZoom,
  focalWorldPoint,
  panForFocal,
  snapZoom,
  zoomAtScreenPoint,
} from "@/lib/camera";

const TAP_THRESHOLD = 8;
const DRAG_START_THRESHOLD = 4;

function pointerDistance(
  a: { x: number; y: number },
  b: { x: number; y: number },
) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

function panInertia(mv: ReturnType<typeof useMotionValue<number>>, velocity: number) {
  if (Math.abs(velocity) < 0.15) return;
  animate(mv, mv.get() + velocity * 20, {
    type: "inertia",
    velocity,
    ...INERTIA,
  });
}

type Focal = { screenX: number; screenY: number; worldX: number; worldY: number };

function applyFocalZoom(
  panX: ReturnType<typeof useMotionValue<number>>,
  panY: ReturnType<typeof useMotionValue<number>>,
  scale: ReturnType<typeof useMotionValue<number>>,
  focal: Focal,
  nextScale: number,
) {
  const clamped = clampZoom(nextScale);
  const pan = panForFocal(
    focal.screenX,
    focal.screenY,
    focal.worldX,
    focal.worldY,
    clamped,
  );
  scale.set(clamped);
  panX.set(pan.panX);
  panY.set(pan.panY);
}

function runZoomInertia(
  panX: ReturnType<typeof useMotionValue<number>>,
  panY: ReturnType<typeof useMotionValue<number>>,
  scale: ReturnType<typeof useMotionValue<number>>,
  focal: Focal,
  velocity: number,
) {
  if (Math.abs(velocity) < 0.00008) return;

  const current = scale.get();
  const target = clampZoom(current + velocity * 140);

  animate(scale, target, {
    type: "inertia",
    velocity,
    ...ZOOM_INERTIA,
    onUpdate: (latest) => {
      const s = clampZoom(latest);
      scale.set(s);
      const pan = panForFocal(
        focal.screenX,
        focal.screenY,
        focal.worldX,
        focal.worldY,
        s,
      );
      panX.set(pan.panX);
      panY.set(pan.panY);
    },
  });
}

type CameraCallbacks = {
  onNavTap?: (action: string) => void;
  onArtworkTap?: (id: string) => void;
};

export function useExhibitionCamera(
  isActive: boolean,
  callbacks?: CameraCallbacks,
) {
  const panX = useMotionValue(0);
  const panY = useMotionValue(0);
  const scale = useMotionValue(DEFAULT_ZOOM);

  const isDraggingRef = useRef(false);
  const dragRef = useRef({
    pending: false,
    active: false,
    pointerId: -1,
    startX: 0,
    startY: 0,
    originPanX: 0,
    originPanY: 0,
    lastX: 0,
    lastY: 0,
    lastTime: 0,
    vx: 0,
    vy: 0,
    navTarget: null as HTMLElement | null,
    artworkTarget: null as HTMLElement | null,
  });

  const pinchRef = useRef({
    active: false,
    startDistance: 0,
    startScale: DEFAULT_ZOOM,
    startPanX: 0,
    startPanY: 0,
    lastTime: 0,
    lastScale: DEFAULT_ZOOM,
  });

  const pointersRef = useRef(new Map<number, { x: number; y: number }>());
  const wheelPanVelRef = useRef({ x: 0, y: 0 });
  const wheelPanTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wheelZoomVelRef = useRef(0);
  const wheelZoomTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wheelZoomFocalRef = useRef<Focal>({
    screenX: 0,
    screenY: 0,
    worldX: 0,
    worldY: 0,
  });
  const pinchZoomVelRef = useRef(0);
  const pinchFocalRef = useRef<Focal>({
    screenX: 0,
    screenY: 0,
    worldX: 0,
    worldY: 0,
  });
  const didInitialCenterRef = useRef(false);

  const setDraggingUi = useCallback((dragging: boolean) => {
    isDraggingRef.current = dragging;
    document.body.classList.toggle("exhibition-panning", dragging);
  }, []);

  const recenter = useCallback(() => {
    const { x: cx, y: cy } = getFieldCentroid();
    const view = centerViewportAt(
      cx,
      cy,
      DEFAULT_ZOOM,
      window.innerWidth,
      window.innerHeight,
    );
    panX.stop();
    panY.stop();
    scale.stop();
    panX.set(view.panX);
    panY.set(view.panY);
    scale.set(view.scale);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const zoomAt = useCallback(
    (screenX: number, screenY: number, nextScale: number) => {
      panX.stop();
      panY.stop();
      scale.stop();
      const sc = scale.get();
      const focal = {
        screenX,
        screenY,
        ...focalWorldPoint(screenX, screenY, panX.get(), panY.get(), sc),
      };
      applyFocalZoom(panX, panY, scale, focal, nextScale);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const zoomBy = useCallback(
    (factor: number) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const sc = scale.get();
      const focal = {
        screenX: cx,
        screenY: cy,
        ...focalWorldPoint(cx, cy, panX.get(), panY.get(), sc),
      };
      panX.stop();
      panY.stop();
      scale.stop();
      const target = snapZoom(sc * factor);
      const velocity = (target - sc) * 0.85;
      runZoomInertia(panX, panY, scale, focal, velocity);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handleTap = useCallback(
    (navTarget: HTMLElement | null, artworkTarget: HTMLElement | null) => {
      if (navTarget) {
        const action = navTarget.dataset.navAction ?? "";
        if (action) callbacks?.onNavTap?.(action);
        return;
      }
      if (artworkTarget) {
        const id = artworkTarget.dataset.artworkId;
        if (id) callbacks?.onArtworkTap?.(id);
      }
    },
    [callbacks],
  );

  const endActiveDrag = useCallback(
    (clientX: number, clientY: number) => {
      const drag = dragRef.current;
      if (!drag.active) return;

      const dx = clientX - drag.startX;
      const dy = clientY - drag.startY;
      const moved = Math.hypot(dx, dy) > TAP_THRESHOLD;

      drag.active = false;
      drag.pending = false;
      drag.pointerId = -1;
      setDraggingUi(false);

      if (moved) {
        panInertia(panX, drag.vx);
        panInertia(panY, drag.vy);
      }
    },
    [panX, panY, setDraggingUi],
  );

  const beginDrag = useCallback(
    (e: PointerEvent) => {
      // Ignore clicks on zoom toggle button
      const target = e.target as HTMLElement;
      if (target.closest('[data-zoom-toggle="true"]')) return;

      const drag = dragRef.current;
      drag.pending = false;
      drag.active = true;
      drag.startX = e.clientX;
      drag.startY = e.clientY;
      drag.lastX = e.clientX;
      drag.lastY = e.clientY;
      drag.lastTime = performance.now();
      drag.vx = 0;
      drag.vy = 0;
      setDraggingUi(true);
    },
    [setDraggingUi],
  );

  const updatePinch = useCallback(() => {
    const pts = [...pointersRef.current.values()];
    if (pts.length !== 2) return;

    const [a, b] = pts;
    const midX = (a.x + b.x) / 2;
    const midY = (a.y + b.y) / 2;
    const dist = pointerDistance(a, b);
    const pinch = pinchRef.current;

    if (!pinch.active) {
      panX.stop();
      panY.stop();
      scale.stop();
      pinch.active = true;
      pinch.startDistance = dist;
      pinch.startScale = scale.get();
      pinch.startPanX = panX.get();
      pinch.startPanY = panY.get();
      pinch.lastTime = performance.now();
      pinch.lastScale = scale.get();
      pinchZoomVelRef.current = 0;
      pinchFocalRef.current = {
        screenX: midX,
        screenY: midY,
        ...focalWorldPoint(
          midX,
          midY,
          pinch.startPanX,
          pinch.startPanY,
          pinch.lastScale,
        ),
      };
      dragRef.current.pending = false;
      dragRef.current.active = false;
      dragRef.current.pointerId = -1;
      setDraggingUi(false);
      return;
    }

    const rawScale =
      pinch.startScale * (dist / Math.max(pinch.startDistance, 1));
    const next = zoomAtScreenPoint(
      midX,
      midY,
      pinch.startPanX,
      pinch.startPanY,
      pinch.startScale,
      rawScale,
    );
    const now = performance.now();
    const dt = Math.max(now - pinch.lastTime, 1);
    const scaleVel = (next.scale - pinch.lastScale) / dt;
    pinchZoomVelRef.current =
      scaleVel * 0.55 + pinchZoomVelRef.current * 0.45;

    panX.set(next.panX);
    panY.set(next.panY);
    scale.set(next.scale);
    pinch.lastScale = next.scale;
    pinch.lastTime = now;
    pinchFocalRef.current = {
      screenX: midX,
      screenY: midY,
      ...focalWorldPoint(
        midX,
        midY,
        next.panX,
        next.panY,
        next.scale,
      ),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setDraggingUi]);

  useEffect(() => {
    if (!isActive) {
      pointersRef.current.clear();
      dragRef.current.pending = false;
      dragRef.current.active = false;
      dragRef.current.pointerId = -1;
      pinchRef.current.active = false;
      setDraggingUi(false);
      if (wheelPanTimerRef.current) clearTimeout(wheelPanTimerRef.current);
      if (wheelZoomTimerRef.current) clearTimeout(wheelZoomTimerRef.current);
      return;
    }

    if (!didInitialCenterRef.current) {
      recenter();
      didInitialCenterRef.current = true;
    }

    const onPointerDown = (e: PointerEvent) => {
      // Ignore clicks on zoom toggle button
      const target = e.target as HTMLElement;
      if (target.closest('[data-zoom-toggle="true"]')) return;

      pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (pointersRef.current.size >= 2) {
        updatePinch();
        return;
      }

      if (e.button !== 0) return;

      const navTarget = target.closest<HTMLElement>("[data-nav-item]");
      const artworkTarget = target.closest<HTMLElement>("[data-artwork]");

      panX.stop();
      panY.stop();
      scale.stop();

      dragRef.current = {
        pending: true,
        active: false,
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        originPanX: panX.get(),
        originPanY: panY.get(),
        lastX: e.clientX,
        lastY: e.clientY,
        lastTime: performance.now(),
        vx: 0,
        vy: 0,
        navTarget,
        artworkTarget,
      };

      // Don't capture pointer if clicking on zoom toggle
      if (!target.closest('[data-zoom-toggle="true"]')) {
        try {
          document.documentElement.setPointerCapture(e.pointerId);
        } catch {
          /* ignore */
        }
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!pointersRef.current.has(e.pointerId)) return;
      pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (pointersRef.current.size >= 2) {
        updatePinch();
        return;
      }

      const drag = dragRef.current;
      if (e.pointerId !== drag.pointerId) return;

      const dx = e.clientX - drag.startX;
      const dy = e.clientY - drag.startY;

      if (drag.pending && !drag.active) {
        if (Math.hypot(dx, dy) < DRAG_START_THRESHOLD) return;
        beginDrag(e);
      }

      if (!drag.active) return;

      panX.set(drag.originPanX + dx);
      panY.set(drag.originPanY + dy);

      const now = performance.now();
      const dt = Math.max(now - drag.lastTime, 1);
      drag.vx = (e.clientX - drag.lastX) / dt;
      drag.vy = (e.clientY - drag.lastY) / dt;
      drag.lastX = e.clientX;
      drag.lastY = e.clientY;
      drag.lastTime = now;
    };

    const releasePointer = (e: PointerEvent) => {
      const drag = dragRef.current;
      const wasOurs = e.pointerId === drag.pointerId;

      pointersRef.current.delete(e.pointerId);
      if (pointersRef.current.size < 2 && pinchRef.current.active) {
        pinchRef.current.active = false;
        flushPinchZoomInertia();
      }

      try {
        if (document.documentElement.hasPointerCapture(e.pointerId)) {
          document.documentElement.releasePointerCapture(e.pointerId);
        }
      } catch {
        /* ignore */
      }

      if (!wasOurs) return;

      if (drag.active) {
        endActiveDrag(e.clientX, e.clientY);
      } else if (drag.pending) {
        handleTap(drag.navTarget, drag.artworkTarget);
      }

      drag.pending = false;
      drag.active = false;
      drag.pointerId = -1;
      setDraggingUi(false);
    };

    const flushWheelPanInertia = () => {
      const { x: vx, y: vy } = wheelPanVelRef.current;
      wheelPanVelRef.current = { x: 0, y: 0 };
      panInertia(panX, vx * 0.35);
      panInertia(panY, vy * 0.35);
    };

    const flushWheelZoomInertia = () => {
      const v = wheelZoomVelRef.current;
      wheelZoomVelRef.current = 0;
      runZoomInertia(panX, panY, scale, wheelZoomFocalRef.current, v);
    };

    const flushPinchZoomInertia = () => {
      const v = pinchZoomVelRef.current;
      pinchZoomVelRef.current = 0;
      if (Math.abs(v) > 0.00008) {
        runZoomInertia(panX, panY, scale, pinchFocalRef.current, v);
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();

      const px = panX.get();
      const py = panY.get();
      const sc = scale.get();

      scale.stop();
      if (wheelZoomTimerRef.current) clearTimeout(wheelZoomTimerRef.current);

      panX.stop();
      panY.stop();
      panX.set(px - e.deltaX * 0.65);
      panY.set(py - e.deltaY * 0.65);
      wheelPanVelRef.current = { x: -e.deltaX * 0.04, y: -e.deltaY * 0.04 };
      if (wheelPanTimerRef.current) clearTimeout(wheelPanTimerRef.current);
      wheelPanTimerRef.current = setTimeout(flushWheelPanInertia, 90);
    };

    document.addEventListener("pointerdown", onPointerDown, { capture: true });
    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerup", releasePointer);
    document.addEventListener("pointercancel", releasePointer);
    document.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      document.removeEventListener("pointerdown", onPointerDown, {
        capture: true,
      });
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", releasePointer);
      document.removeEventListener("pointercancel", releasePointer);
      document.removeEventListener("wheel", onWheel);
      pointersRef.current.clear();
      setDraggingUi(false);
      if (wheelPanTimerRef.current) clearTimeout(wheelPanTimerRef.current);
      if (wheelZoomTimerRef.current) clearTimeout(wheelZoomTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isActive,
    beginDrag,
    endActiveDrag,
    handleTap,
    recenter,
    setDraggingUi,
    updatePinch,
  ]);

  return {
    panX,
    panY,
    scale,
    recenter,
    zoomBy,
    isDraggingRef,
  };
}
