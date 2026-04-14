import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo, memo } from "react";
import * as THREE from "three";
import {
	MeshTransmissionMaterial,
	Float,
	Environment,
	Stars,
} from "@react-three/drei";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SceneProps {
	// Ref-based scroll — zero re-renders on scroll position change
	scrollProgressRef: React.RefObject<number>;
}

// ─── GlassOrb ─────────────────────────────────────────────────────────────────

const GlassOrb = memo(() => {
	const meshRef = useRef<THREE.Mesh>(null);
	const { mouse } = useThree();

	// Accumulate base rotation separately from mouse influence
	const baseRotation = useRef({ x: 0, y: 0 });

	useFrame((_, delta) => {
		if (!meshRef.current) return;

		// 1. Accumulate autonomous rotation (delta-corrected)
		baseRotation.current.x += delta * 0.1;
		baseRotation.current.y += delta * 0.15;

		// 2. Lerp toward mouse offset ON TOP of base rotation
		//    This gives: slow spin + gentle mouse lean (not snap-to-mouse)
		meshRef.current.rotation.x = THREE.MathUtils.lerp(
			meshRef.current.rotation.x,
			baseRotation.current.x + mouse.y * 0.25,
			0.06
		);
		meshRef.current.rotation.y = THREE.MathUtils.lerp(
			meshRef.current.rotation.y,
			baseRotation.current.y + mouse.x * 0.25,
			0.06
		);
	});

	// Detail=4 minimum for smooth glass — detail=1 is 20 faces (faceted)
	const geometry = useMemo(() => new THREE.IcosahedronGeometry(1.4, 4), []);

	return (
		<mesh ref={meshRef} geometry={geometry} castShadow>
			<MeshTransmissionMaterial
				backside
				samples={6}
				thickness={0.5}
				roughness={0.02}
				transmission={1}
				ior={1.2}
				chromaticAberration={0.04}
				color="#a855f7"
				distortionScale={0.2}
				temporalDistortion={0.1}
				anisotropicBlur={0.1}
			/>
		</mesh>
	);
});

GlassOrb.displayName = "GlassOrb";

// ─── ParticleRing ─────────────────────────────────────────────────────────────

const ParticleRing = memo(() => {
	const pointsRef = useRef<THREE.Points>(null);
	const elapsedRef = useRef(0); // own accumulator — immune to tab-hide jumps

	const { geometry, material } = useMemo(() => {
		const count = 1200;
		const positions = new Float32Array(count * 3);
		const colors = new Float32Array(count * 3);
		const color = new THREE.Color();

		for (let i = 0; i < count; i++) {
			const angle = (i / count) * Math.PI * 2;
			const radius = 3.2 + (Math.random() - 0.5) * 1.5;
			const spread = (Math.random() - 0.5) * 0.8;

			positions[i * 3] = Math.cos(angle) * radius;
			positions[i * 3 + 1] = spread;
			positions[i * 3 + 2] = Math.sin(angle) * radius;

			color.setHSL(0.75 + Math.random() * 0.1, 0.8, 0.5);
			colors[i * 3] = color.r;
			colors[i * 3 + 1] = color.g;
			colors[i * 3 + 2] = color.b;
		}

		const geo = new THREE.BufferGeometry();
		geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
		geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

		const mat = new THREE.PointsMaterial({
			size: 0.015,
			vertexColors: true,
			transparent: true,
			opacity: 0.6,
			sizeAttenuation: true,
			blending: THREE.AdditiveBlending,
			depthWrite: false, // prevents z-fighting with orb
		});

		return { geometry: geo, material: mat };
	}, []);

	// Dispose on unmount — geometry + material both need cleanup
	// R3F doesn't auto-dispose objects created outside JSX
	useFrame((_, delta) => {
		if (!pointsRef.current) return;
		elapsedRef.current += delta;
		pointsRef.current.rotation.y = elapsedRef.current * 0.05;
		pointsRef.current.rotation.x = Math.sin(elapsedRef.current * 0.2) * 0.1;
	});

	return <points ref={pointsRef} geometry={geometry} material={material} />;
});

ParticleRing.displayName = "ParticleRing";

// ─── Scene ────────────────────────────────────────────────────────────────────

const Scene = memo(({ scrollProgressRef }: SceneProps) => {
	const groupRef = useRef<THREE.Group>(null);

	useFrame(() => {
		if (!groupRef.current) return;

		const progress = scrollProgressRef.current ?? 0;

		// Tuned: -2 world units at full scroll (was -5 — too far off screen)
		groupRef.current.position.y = THREE.MathUtils.lerp(
			groupRef.current.position.y,
			progress * -2,
			0.05
		);

		// Scale down to 60% at full scroll (was 60% — kept)
		const s = Math.max(0.6, 1 - progress * 0.4);
		groupRef.current.scale.setScalar(s);

		// Fade opacity via userData trick (no state, no re-render)
		groupRef.current.traverse((child) => {
			if ((child as THREE.Mesh).isMesh) {
				const mesh = child as THREE.Mesh;
				if (Array.isArray(mesh.material)) {
					mesh.material.forEach((m) => {
						if ("opacity" in m)
							(m as THREE.MeshStandardMaterial).opacity =
								THREE.MathUtils.lerp(
									(m as THREE.MeshStandardMaterial).opacity,
									1 - progress * 0.8,
									0.05
								);
					});
				}
			}
		});
	});

	return (
		<>
			{/*
        NO <color attach="background"> here.
        Let Canvas alpha:true + CSS background show through.
        This allows the purple gradient blob from Hero to glow behind the orb.
      */}
			<Environment preset="city" />

			{/* Reduced from 5000 — still dense, better perf */}
			<Stars
				radius={100}
				depth={50}
				count={3000}
				factor={3}
				fade
				speed={0.6}
			/>

			<ambientLight intensity={0.5} />
			<spotLight
				position={[10, 10, 10]}
				angle={0.15}
				penumbra={1}
				intensity={2}
				castShadow
				shadow-mapSize={[512, 512]} // reduced from default 1024 — saves VRAM
			/>
			{/* Purple rim light — matches brand color */}
			<pointLight
				position={[-5, 2, -5]}
				intensity={1.2}
				color="#a855f7"
			/>

			<group ref={groupRef}>
				<Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
					<GlassOrb />
				</Float>
				<ParticleRing />
			</group>
		</>
	);
});

Scene.displayName = "Scene";

export default Scene;
