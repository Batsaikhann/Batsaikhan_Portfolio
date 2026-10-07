"use client";

import { useEffect, useRef } from "react";

// Deterministic value noise so the rocks look the same on every load.
function hash(x: number, y: number, z: number) {
  const s = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453;
  return s - Math.floor(s);
}

/**
 * Low-poly dark rock terrain lit by a red rim light, rendered behind the hero portrait.
 * three.js is loaded lazily after first paint; nothing is rendered on touch / small
 * screens or with reduced motion — the CSS glow underneath is the fallback.
 */
export function HeroScene() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    if (
      matchMedia("(prefers-reduced-motion: reduce)").matches ||
      matchMedia("(max-width: 900px), (pointer: coarse)").matches
    ) {
      return;
    }

    let disposed = false;
    let teardown = () => {};

    const start = async () => {
      const THREE = await import("three");
      if (disposed) return;

      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
      } catch {
        return; // No WebGL — keep the CSS fallback.
      }
      // Soft, masked background terrain: 1× resolution is visually identical and far cheaper.
      renderer.setPixelRatio(1);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      host.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      scene.fog = new THREE.Fog(0x0a0a0a, 8, 17);
      const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 60);
      camera.position.set(0, 0.4, 10);

      const rockMaterial = new THREE.MeshStandardMaterial({
        color: 0x161313,
        roughness: 0.82,
        metalness: 0.2,
        flatShading: true,
      });
      const disposables: Array<{ dispose: () => void }> = [rockMaterial];

      const rocks = new THREE.Group();
      const rockSpecs: Array<[number, number, number, number, number, number]> = [
        // x, y, z, radius, stretchY, spin
        [1.9, -3.0, -0.8, 2.3, 0.8, 0.3],
        [-1.6, -3.3, -1.4, 2.0, 0.7, 1.2],
        [3.8, -2.4, -2.8, 1.9, 1.1, 2.1],
        [0.4, -1.6, -4.4, 1.6, 1.6, 0.8],
        [-3.6, -2.6, -3.6, 1.7, 0.9, 2.7],
      ];
      rockSpecs.forEach(([x, y, z, radius, stretch, spin], i) => {
        const geometry = new THREE.IcosahedronGeometry(radius, 1);
        const pos = geometry.attributes.position;
        for (let v = 0; v < pos.count; v++) {
          const px = pos.getX(v);
          const py = pos.getY(v);
          const pz = pos.getZ(v);
          const k = 0.78 + hash(px + i, py, pz) * 0.42;
          pos.setXYZ(v, px * k, py * k * stretch, pz * k);
        }
        geometry.computeVertexNormals();
        disposables.push(geometry);
        const mesh = new THREE.Mesh(geometry, rockMaterial);
        mesh.position.set(x, y, z);
        mesh.rotation.set(spin * 0.4, spin, spin * 0.2);
        rocks.add(mesh);
      });
      scene.add(rocks);

      // Two thin red glass panes standing in the terrain.
      const paneMaterial = new THREE.MeshBasicMaterial({
        color: 0xff2440,
        transparent: true,
        opacity: 0.14,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      disposables.push(paneMaterial);
      const panes = new THREE.Group();
      [
        [-0.2, 0.2, -2.6, 0.8, 3.4, 0.3],
        [2.4, -0.2, -3.6, 0.5, 2.2, -0.5],
      ].forEach(([x, y, z, w, h, ry]) => {
        const geometry = new THREE.PlaneGeometry(w, h);
        disposables.push(geometry);
        const pane = new THREE.Mesh(geometry, paneMaterial);
        pane.position.set(x, y, z);
        pane.rotation.y = ry;
        panes.add(pane);
      });
      scene.add(panes);

      scene.add(new THREE.AmbientLight(0x2a1416, 1.4));
      const key = new THREE.DirectionalLight(0xfff0ee, 0.35);
      key.position.set(-4, 5, 6);
      const rim = new THREE.DirectionalLight(0xff2a40, 1.9);
      rim.position.set(5, 3, -6);
      const glow = new THREE.PointLight(0xff3048, 30, 12, 1.6);
      glow.position.set(1.2, -0.4, -2.2);
      scene.add(key, rim, glow);

      const resize = () => {
        const { width, height } = host.getBoundingClientRect();
        renderer.setSize(width, height, false);
        camera.aspect = width / Math.max(height, 1);
        camera.updateProjectionMatrix();
      };
      resize();
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(host);

      let pointerX = 0;
      let pointerY = 0;
      const onPointer = (event: PointerEvent) => {
        pointerX = event.clientX / innerWidth - 0.5;
        pointerY = event.clientY / innerHeight - 0.5;
      };
      window.addEventListener("pointermove", onPointer, { passive: true });

      let inView = true;
      const viewObserver = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        schedule();
      });
      viewObserver.observe(host);
      const onVisibility = () => schedule();
      document.addEventListener("visibilitychange", onVisibility);

      let frame = 0;
      const timer = new THREE.Timer();
      const story = host.closest<HTMLElement>(".story");
      // Faded out once the hero story leaves the hero, so the loop stops until it comes back.
      const storyAway = () => !!story && /portal|work|next/.test(story.dataset.phase ?? "");
      const phaseObserver = new MutationObserver(() => schedule());
      if (story) phaseObserver.observe(story, { attributeFilter: ["data-phase"] });
      const render = (now: number) => {
        frame = 0;
        timer.update(now);
        const t = timer.getElapsed();
        camera.position.x += (pointerX * 0.7 + Math.sin(t * 0.12) * 0.25 - camera.position.x) * 0.04;
        camera.position.y += (0.4 - pointerY * 0.35 - camera.position.y) * 0.04;
        camera.lookAt(0.6, -1, -2);
        rocks.rotation.y = Math.sin(t * 0.05) * 0.06;
        panes.position.y = Math.sin(t * 0.6) * 0.06;
        glow.intensity = 28 + Math.sin(t * 1.4) * 5;
        renderer.render(scene, camera);
        schedule();
      };
      function schedule() {
        const active = inView && document.visibilityState === "visible" && !storyAway();
        if (active && !frame) frame = requestAnimationFrame(render);
        if (!active && frame) {
          cancelAnimationFrame(frame);
          frame = 0;
        }
      }
      schedule();
      host.classList.add("is-ready");

      teardown = () => {
        cancelAnimationFrame(frame);
        resizeObserver.disconnect();
        viewObserver.disconnect();
        phaseObserver.disconnect();
        window.removeEventListener("pointermove", onPointer);
        document.removeEventListener("visibilitychange", onVisibility);
        disposables.forEach((item) => item.dispose());
        renderer.dispose();
        renderer.domElement.remove();
      };
    };

    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(() => void start(), { timeout: 1200 })
      : window.setTimeout(() => void start(), 500);

    return () => {
      disposed = true;
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      teardown();
    };
  }, []);

  return <div className="hero-scene" ref={hostRef} aria-hidden="true" />;
}
