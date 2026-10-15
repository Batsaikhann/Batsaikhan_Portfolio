"use client";

import { useEffect, useRef, useState } from "react";
import type { L } from "./T";
import { Tx } from "./T";

/**
 * A rigged GLB avatar that turns its head toward the cursor and hops when clicked.
 * three.js is loaded lazily once the stage nears the viewport, and frames are only rendered
 * while something is still moving — an idle avatar costs nothing, like the hero scene.
 */
export function SparkAvatar({ src, caption }: { src: string; caption: L }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"idle" | "ready" | "failed">("idle");

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    let disposed = false;
    let teardown = () => {};

    const start = async () => {
      const [THREE, { GLTFLoader }, { MeshoptDecoder }, { RoomEnvironment }] = await Promise.all([
        import("three"),
        import("three/addons/loaders/GLTFLoader.js"),
        import("three/addons/libs/meshopt_decoder.module.js"),
        import("three/addons/environments/RoomEnvironment.js"),
      ]);
      if (disposed) return;

      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
      } catch {
        setState("failed");
        return;
      }
      const lite = document.documentElement.classList.contains("is-lite");
      renderer.setPixelRatio(Math.min(devicePixelRatio, lite ? 1 : 1.5));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      host.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const pmrem = new THREE.PMREMGenerator(renderer);
      const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environment = envTexture;
      scene.environmentIntensity = 0.55;
      pmrem.dispose();

      const key = new THREE.DirectionalLight(0xfff4ec, 2.2);
      key.position.set(-2.5, 3, 4);
      const rim = new THREE.DirectionalLight(0x9b6bff, 2.4);
      rim.position.set(3, 2, -3);
      scene.add(key, rim, new THREE.AmbientLight(0xffffff, 0.35));

      const camera = new THREE.PerspectiveCamera(26, 1, 0.01, 100);

      const loader = new GLTFLoader();
      loader.setMeshoptDecoder(MeshoptDecoder);
      let gltf: Awaited<ReturnType<typeof loader.loadAsync>>;
      try {
        gltf = await loader.loadAsync(src);
      } catch {
        renderer.dispose();
        renderer.domElement.remove();
        if (!disposed) setState("failed");
        return;
      }
      if (disposed) {
        renderer.dispose();
        return;
      }

      const model = gltf.scene;
      scene.add(model);

      // Frame the bust: centre it and pull the camera back until the whole thing fits.
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      model.position.sub(center);
      const fitHeight = size.y / 2 / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      camera.position.set(0, size.y * 0.04, fitHeight * 1.18 + size.z / 2);
      camera.lookAt(0, 0, 0);

      // Bones share the turn so it reads as a body moving, not a head on a stick.
      const bone = (name: string) => model.getObjectByName(name);
      const turners = (
        [
          ["Head", 0.55],
          ["Neck", 0.3],
          ["Chest", 0.15],
        ] as const
      )
        .map(([name, share]) => {
          const node = bone(name);
          return node ? { node, share, rest: node.quaternion.clone() } : null;
        })
        .filter((t) => t !== null);
      const ears = ["ear_1.l", "ear_1.r"]
        .map((name) => bone(name))
        .filter((node) => node !== undefined)
        .map((node) => ({ node, rest: node.quaternion.clone() }));
      const baseY = model.position.y;

      const resize = () => {
        const { width, height } = host.getBoundingClientRect();
        renderer.setSize(width, height, false);
        camera.aspect = width / Math.max(height, 1);
        // On narrow stages the bust is width-bound — back the camera off so the hoodie still fits.
        const widthFit = size.x / 2 / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) / camera.aspect;
        camera.position.z = Math.max(fitHeight * 1.18, widthFit * 1.25) + size.z / 2;
        camera.updateProjectionMatrix();
        schedule();
      };
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(host);

      let targetYaw = 0;
      let targetPitch = 0;
      let yaw = 0;
      let pitch = 0;
      const onPointer = (event: PointerEvent) => {
        if (reduced) return;
        const r = host.getBoundingClientRect();
        // Normalised against the viewport so he keeps watching the cursor anywhere on screen.
        const nx = (event.clientX - (r.left + r.width / 2)) / innerWidth;
        const ny = (event.clientY - (r.top + r.height * 0.4)) / innerHeight;
        targetYaw = THREE.MathUtils.clamp(nx * 1.6, -0.75, 0.75);
        targetPitch = THREE.MathUtils.clamp(ny * 1.1, -0.35, 0.45);
        schedule();
      };
      window.addEventListener("pointermove", onPointer, { passive: true });

      let hopStart = -1;
      const HOP_MS = 720;
      const onClick = () => {
        if (reduced || hopStart >= 0) return;
        hopStart = performance.now();
        schedule();
      };
      host.addEventListener("click", onClick);

      let inView = true;
      const viewObserver = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        schedule();
      });
      viewObserver.observe(host);
      const onVisibility = () => schedule();
      document.addEventListener("visibilitychange", onVisibility);

      const euler = new THREE.Euler();
      const offset = new THREE.Quaternion();
      let frame = 0;
      const render = (now: number) => {
        frame = 0;
        const dYaw = (targetYaw - yaw) * 0.09;
        const dPitch = (targetPitch - pitch) * 0.09;
        yaw += dYaw;
        pitch += dPitch;
        for (const t of turners) {
          euler.set(pitch * t.share, yaw * t.share, 0);
          t.node.quaternion.copy(t.rest).multiply(offset.setFromEuler(euler));
        }

        let hopping = false;
        if (hopStart >= 0) {
          const k = Math.min(1, (now - hopStart) / HOP_MS);
          // Crouch, jump, land with a little squash.
          const lift = Math.sin(Math.min(1, Math.max(0, (k - 0.15) / 0.7)) * Math.PI);
          const squash = k < 0.15 ? Math.sin((k / 0.15) * Math.PI) : k > 0.85 ? Math.sin(((k - 0.85) / 0.15) * Math.PI) : 0;
          model.position.y = baseY + lift * size.y * 0.12;
          model.scale.set(1 + squash * 0.04, 1 - squash * 0.06 + lift * 0.02, 1 + squash * 0.04);
          for (const [i, ear] of ears.entries()) {
            euler.set(-lift * 0.35, 0, (i === 0 ? 1 : -1) * lift * 0.12);
            ear.node.quaternion.copy(ear.rest).multiply(offset.setFromEuler(euler));
          }
          if (k >= 1) {
            hopStart = -1;
            model.position.y = baseY;
            model.scale.set(1, 1, 1);
          } else hopping = true;
        }

        renderer.render(scene, camera);
        if (hopping || Math.abs(dYaw) + Math.abs(dPitch) > 0.0002) schedule();
      };
      function schedule() {
        const active = inView && document.visibilityState === "visible";
        if (active && !frame) frame = requestAnimationFrame(render);
        if (!active && frame) {
          cancelAnimationFrame(frame);
          frame = 0;
        }
      }
      resize();
      setState("ready");

      teardown = () => {
        cancelAnimationFrame(frame);
        resizeObserver.disconnect();
        viewObserver.disconnect();
        window.removeEventListener("pointermove", onPointer);
        host.removeEventListener("click", onClick);
        document.removeEventListener("visibilitychange", onVisibility);
        model.traverse((node) => {
          const mesh = node as InstanceType<typeof THREE.Mesh>;
          if (!mesh.isMesh) return;
          mesh.geometry.dispose();
          for (const material of [mesh.material].flat()) {
            for (const value of Object.values(material)) if (value instanceof THREE.Texture) value.dispose();
            material.dispose();
          }
        });
        envTexture.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    };

    // Only fetch three.js and the model once the stage is about to scroll into view.
    const nearObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        nearObserver.disconnect();
        void start();
      },
      { rootMargin: "400px 0px" },
    );
    nearObserver.observe(host);

    return () => {
      disposed = true;
      nearObserver.disconnect();
      teardown();
    };
  }, [src]);

  return (
    <figure className={`spark-avatar is-${state}`}>
      <div className="spark-avatar-stage" ref={hostRef} data-cursor="Hop" role="img" aria-label={caption.en}>
        {state === "idle" && <span className="spark-avatar-loading">Loading Spark…</span>}
      </div>
      <figcaption>
        <Tx text={caption} />
      </figcaption>
    </figure>
  );
}
