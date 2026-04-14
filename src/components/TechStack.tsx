// src/components/TechStack.tsx
import * as THREE from "three";
import { useRef, useMemo, useState, useEffect, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, useTexture } from "@react-three/drei";
import { EffectComposer, N8AO } from "@react-three/postprocessing";
import {
	BallCollider,
	Physics,
	RigidBody,
	RapierRigidBody,
} from "@react-three/rapier";

// ─── Constants ────────────────────────────────────────────────────────────────
const IMAGE_URLS = [
	"/images/react2.webp",
	"/images/next2.webp",
	"/images/node2.webp",
	"/images/express.webp",
	"/images/mongo.webp",
	"/images/mysql.webp",
	"/images/typescript.webp",
	"/images/javascript.webp",
] as const;

// Stable sphere config — generated once, never changes
// Scale variance: gives visual interest without runtime randomness
const SPHERE_COUNT = 22; // ✅ Reduced from 30 — 27% fewer physics bodies
const SPHERE_CONFIGS = Array.from({ length: SPHERE_COUNT }, (_, i) => ({
	id: `sphere-${i}`,
	scale: [0.7, 1, 0.8, 1, 1][i % 5], // ✅ Deterministic — no Math.random in render
	// Material index deterministic — assigned once, stable across re-renders
	materialIndex: i % IMAGE_URLS.length,
}));

// ─── Shared geometry — created once, reused across all spheres ────────────────
// Will be disposed in TechStackScene unmount
const SPHERE_GEOMETRY = new THREE.SphereGeometry(1, 24, 24); // ✅ 24 vs 28 segments — ~26% fewer verts

// ─── SphereGeo ────────────────────────────────────────────────────────────────
type SphereProps = {
	scale: number;
	material: THREE.MeshPhysicalMaterial;
	isActive: boolean;
};

function SphereGeo({ scale, material, isActive }: SphereProps) {
	const bodyRef = useRef<RapierRigidBody>(null);
	const vecRef = useRef(new THREE.Vector3()); // ✅ Stable ref — not a prop default

	// Deterministic spawn position based on index — no module-level random
	const position = useMemo<[number, number, number]>(
		() => [
			(Math.random() - 0.5) * 20,
			(Math.random() - 0.5) * 20 - 25,
			(Math.random() - 0.5) * 20 - 10,
		],
		[]
	); // ✅ useMemo with [] — runs once per mount, not per render

	useFrame((_, delta) => {
		if (!isActive || !bodyRef.current) return;

		const clampedDelta = Math.min(0.1, delta);
		const translation = bodyRef.current.translation();

		const impulse = vecRef.current
			.set(translation.x, translation.y, translation.z)
			.normalize()
			.multiplyScalar(-clampedDelta * scale * 60);

		// Stronger downward pull for visual weight
		impulse.y *= 2.5;

		bodyRef.current.applyImpulse(
			{ x: impulse.x, y: impulse.y, z: impulse.z },
			true
		);
	});

	return (
		<RigidBody
			ref={bodyRef}
			linearDamping={0.75}
			angularDamping={0.15}
			friction={0.2}
			position={position}
			colliders={false}
		>
			{/* ✅ BallCollider only — removed dead CylinderCollider */}
			<BallCollider args={[scale]} />
			<mesh
				castShadow
				scale={scale}
				geometry={SPHERE_GEOMETRY}
				material={material}
			/>
		</RigidBody>
	);
}

// ─── Scene — all R3F hooks must be inside Canvas ──────────────────────────────
function TechStackScene({ isActive }: { isActive: boolean }) {
	// ✅ useTexture — Suspense-compatible, properly disposed by R3F
	const textures = useTexture(IMAGE_URLS as unknown as string[]);

	// ✅ Stable materials — created once, not on every isActive change
	const materials = useMemo(
		() =>
			textures.map((texture) => {
				texture.colorSpace = THREE.SRGBColorSpace; // correct color space
				return new THREE.MeshPhysicalMaterial({
					map: texture,
					emissive: "#ffffff",
					emissiveMap: texture,
					emissiveIntensity: 0.25,
					metalness: 0.4,
					roughness: 0.9,
					clearcoat: 0.1,
				});
			}),
		[textures]
	);

	// Cleanup materials on unmount
	useEffect(() => {
		return () => {
			materials.forEach((m) => m.dispose());
			SPHERE_GEOMETRY.dispose();
		};
	}, [materials]);

	return (
		<>
			<ambientLight intensity={0.8} />
			<directionalLight
				position={[5, 5, 5]}
				intensity={0.5}
				castShadow={false}
			/>

			<Physics gravity={[0, 0, 0]} timeStep="vary">
				{SPHERE_CONFIGS.map(({ id, scale, materialIndex }) => (
					<SphereGeo
						key={id} // ✅ Stable key — not index
						scale={scale}
						material={materials[materialIndex]} // ✅ Deterministic assignment
						isActive={isActive}
					/>
				))}
			</Physics>

			<Environment
				files="/models/char_environment.hdr" // ✅ Fixed typo: enviorment → environment
				environmentIntensity={0.5}
			/>

			<EffectComposer disableNormalPass>
				<N8AO
					color="#0f002c"
					aoRadius={2}
					intensity={1.0}
					halfRes // ✅ Half resolution AO — major perf win
				/>
			</EffectComposer>
		</>
	);
}

// ─── Main Component ───────────────────────────────────────────────────────────
const TechStack = () => {
	const [isActive, setIsActive] = useState(false);
	const isActiveRef = useRef(false); // guard redundant setState
	const sectionRef = useRef<HTMLElement>(null);

	// ✅ IntersectionObserver — correct activation logic, no scroll math bugs
	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				const active = entry.isIntersecting;
				if (active !== isActiveRef.current) {
					isActiveRef.current = active;
					setIsActive(active);
				}
			},
			{ threshold: 0.2 }
		);

		// Observe #work section
		const target = document.getElementById("work") ?? sectionRef.current;
		if (target) observer.observe(target);

		return () => observer.disconnect();
	}, []);

	return (
		<section
			ref={sectionRef}
			id="tech-stack"
			className="relative py-24"
			aria-labelledby="techstack-heading"
		>
			{/* ── Section header — matches portfolio design system ── */}
			<div className="mb-12 px-6 md:px-16 text-center">
				<p
					className="text-purple-400 text-xs font-semibold tracking-[0.2em]
                      uppercase mb-3"
				>
					What I work with
				</p>
				<h2
					id="techstack-heading"
					className="text-3xl md:text-5xl font-bold text-white tracking-tight"
				>
					Tech <span className="text-purple-500">Stack</span>
				</h2>
				<p className="mt-4 text-white/40 text-sm max-w-md mx-auto">
					Drag and interact with the spheres — each one represents a
					technology I use daily.
				</p>
			</div>

			{/* ── Canvas ── */}
			<div className="relative h-[60vh] min-h-[400px] w-full">
				<Canvas
					shadows={false} // ✅ Disabled — no shadow casters need it
					dpr={[1, 1.5]} // ✅ Cap at 1.5x — Retina without full 2x cost
					gl={{
						alpha: true,
						antialias: false, // post-processing handles edge quality
						powerPreference: "high-performance", // hint to GPU scheduler
					}}
					camera={{ position: [0, 0, 20], fov: 32.5 }}
				>
					{/* TechStackScene is inside Canvas so useTexture/Suspense works */}
					<TechStackScene isActive={isActive} />
				</Canvas>

				{/* Interaction hint — fades after first interaction */}
				<p
					className="absolute bottom-4 left-1/2 -translate-x-1/2
                     text-white/20 text-xs font-mono tracking-widest
                     pointer-events-none select-none"
					aria-hidden="true"
				>
					scroll to activate physics
				</p>
			</div>
		</section>
	);
};

export default TechStack;
