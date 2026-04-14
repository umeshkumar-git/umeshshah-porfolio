// src/components/StarField.tsx
import { useRef, useMemo, memo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

// ─── Types ────────────────────────────────────────────────────────────────────
interface StarFieldProps {
	radius?: number; // sphere distribution radius
	rotationSpeed?: number; // base radians/sec for outer layer
	color?: string; // primary star color
	accentColor?: string; // brand-tinted star color (purple by default)
}

// ─── Device tier detection ────────────────────────────────────────────────────
// Scales star count to device capability — checked once at module load
function getDeviceTier(): "low" | "mid" | "high" {
	if (typeof navigator === "undefined") return "high";
	const cores = navigator.hardwareConcurrency ?? 4;
	// Rough heuristic: <4 cores = low-end mobile, 4-7 = mid, 8+ = desktop
	if (cores <= 2) return "low";
	if (cores <= 6) return "mid";
	return "high";
}

const TIER_COUNTS: Record<
	ReturnType<typeof getDeviceTier>,
	{
		outer: number,
		mid: number,
		inner: number,
	}
> = {
	low: { outer: 600, mid: 300, inner: 100 },
	mid: { outer: 1200, mid: 600, inner: 200 },
	high: { outer: 2000, mid: 800, inner: 300 },
};

// ─── Utility ──────────────────────────────────────────────────────────────────
/**
 * Marsaglia uniform sphere sampling.
 * Returns Float32Array of (count * 3) XYZ positions.
 * Expected rejection rate: ~1 - π/6 ≈ 47% per iteration → avg 1.91 tries/star.
 * For count ≤ 2000 this is negligible (< 1ms).
 */
function generateSpherePositions(
	count: number,
	radius: number,
	spread: number = 0 // random spread around radius for depth variation
): Float32Array {
	const positions = new Float32Array(count * 3);

	for (let i = 0; i < count; i++) {
		let x: number, y: number, z: number, d: number;
		do {
			x = Math.random() * 2 - 1;
			y = Math.random() * 2 - 1;
			z = Math.random() * 2 - 1;
			d = x * x + y * y + z * z;
		} while (d > 1 || d === 0);

		// Add spread for depth variation within a layer
		const r = radius + (Math.random() - 0.5) * spread;
		const scale = r / Math.sqrt(d);
		positions[i * 3] = x * scale;
		positions[i * 3 + 1] = y * scale;
		positions[i * 3 + 2] = z * scale;
	}

	return positions;
}

// ─── Single star layer ────────────────────────────────────────────────────────
interface LayerProps {
	count: number;
	radius: number;
	spread: number;
	size: number;
	opacity: number;
	color: string;
	speedX: number;
	speedY: number;
	twinkle?: boolean;
}

const StarLayer = memo(
	({
		count,
		radius,
		spread,
		size,
		opacity,
		color,
		speedX,
		speedY,
		twinkle = false,
	}: LayerProps) => {
		const pointsRef = useRef < THREE.Points > null; // ✅ Fixed syntax
		const matRef = useRef < THREE.PointsMaterial > null;
		const clockRef = useRef(Math.random() * 100); // random phase offset

		const positions = useMemo(
			() => generateSpherePositions(count, radius, spread),
			[count, radius, spread]
		);

		useFrame((_, delta) => {
			if (!pointsRef.current) return;

			// Rotation
			pointsRef.current.rotation.x += delta * speedX;
			pointsRef.current.rotation.y += delta * speedY;

			// Twinkle — subtle sine-wave opacity on this layer
			if (twinkle && matRef.current) {
				clockRef.current += delta;
				matRef.current.opacity =
					opacity + Math.sin(clockRef.current * 0.8) * 0.12;
			}
		});

		return (
			<Points
				ref={pointsRef}
				positions={positions}
				stride={3}
				frustumCulled={false} // camera is inside sphere — culling would hide all stars
			>
				<PointMaterial
					ref={matRef}
					transparent
					color={color}
					size={size}
					sizeAttenuation
					depthWrite={false} // prevents z-fighting with scene meshes
					opacity={opacity}
				/>
			</Points>
		);
	}
);

StarLayer.displayName = "StarLayer";

// ─── Main StarField — 3 depth layers ─────────────────────────────────────────
const StarField = memo(
	({
		radius = 80,
		rotationSpeed = 0.04,
		color = "#ffffff",
		accentColor = "#c084fc", // purple-400 — ties to brand accent
	}: StarFieldProps) => {
		const tier = useMemo(() => getDeviceTier(), []);
		const counts = TIER_COUNTS[tier];

		return (
			<>
				{/*
				 * Layer 1 — Outer ring: many small dim stars, slow rotation
				 * Creates the sense of a vast field far away
				 */}
				<StarLayer
					count={counts.outer}
					radius={radius}
					spread={12}
					size={0.12}
					opacity={0.5}
					color={color}
					speedX={rotationSpeed * 0.1}
					speedY={rotationSpeed * 0.5}
				/>

				{/*
				 * Layer 2 — Mid ring: medium stars, slightly faster, some purple
				 * Adds depth — these "pass by" the outer layer as speed differs
				 */}
				<StarLayer
					count={counts.mid}
					radius={radius * 0.7}
					spread={8}
					size={0.18}
					opacity={0.65}
					color={accentColor}
					speedX={rotationSpeed * 0.15}
					speedY={rotationSpeed * 0.8}
					twinkle
				/>

				{/*
				 * Layer 3 — Inner bright stars: few, large, vivid, twinkle
				 * These are the "foreground" stars — closest to camera
				 */}
				<StarLayer
					count={counts.inner}
					radius={radius * 0.45}
					spread={5}
					size={0.28}
					opacity={0.9}
					color={color}
					speedX={rotationSpeed * 0.2}
					speedY={rotationSpeed * 1.1}
					twinkle
				/>
			</>
		);
	}
);

StarField.displayName = "StarField";
export default StarField;
