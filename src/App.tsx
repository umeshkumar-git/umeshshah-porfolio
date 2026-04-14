import {
	useState,
	useEffect,
	useRef,
	useCallback,
	Suspense,
	Component,
	PropsWithChildren,
} from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import LoadingScreen from "./components/LoadingScreen";
import MainContainer from "./components/MainContainer";
import Scene from "./components/Scene";
import { personalDetails } from "./data/personalDetails";

// ─── GSAP ─────────────────────────────────────────────────────────────────────
gsap.registerPlugin(ScrollTrigger);

// ─── Constants ────────────────────────────────────────────────────────────────

const CANVAS_CAMERA = {
	position: [0, 0, 6] as [number, number, number],
	fov: 45,
};

const CANVAS_GL = {
	antialias: true, // needed for MeshTransmissionMaterial edges
	alpha: true, // transparent — CSS gradient blob shows through
	powerPreference: "high-performance" as const,
	preserveDrawingBuffer: false,
};

const LOADING_NAME = personalDetails.name.toUpperCase();

// ─── Error Boundary ───────────────────────────────────────────────────────────

interface EBState {
	hasError: boolean;
}

class RootErrorBoundary extends Component<PropsWithChildren, EBState> {
	state: EBState = { hasError: false };

	static getDerivedStateFromError(): EBState {
		return { hasError: true };
	}

	render() {
		if (this.state.hasError) {
			return (
				<div
					className="min-h-screen flex flex-col items-center justify-center
					   bg-black text-white px-6 text-center gap-4"
					role="alert"
				>
					<span className="text-4xl" aria-hidden="true">
						⚠️
					</span>
					<h1 className="text-xl font-bold">Something went wrong</h1>
					<p className="text-white/40 text-sm max-w-xs">
						An unexpected error occurred. Reloading usually fixes
						it.
					</p>
					<button
						onClick={() => window.location.reload()}
						className="mt-2 px-6 py-2.5 bg-white text-black rounded-full
						 text-sm font-semibold hover:bg-white/90
						 transition-colors duration-200"
					>
						Reload
					</button>
				</div>
			);
		}
		return this.props.children;
	}
}

// ─── SceneCanvas ──────────────────────────────────────────────────────────────
// Isolated so WebGL errors don't propagate to RootErrorBoundary.
// Receives the REF, not a value — Scene reads it inside useFrame.
// This means zero React re-renders on scroll.

interface SceneCanvasProps {
	scrollProgressRef: React.RefObject<number>; // ref, not number
}

const SceneCanvas = ({ scrollProgressRef }: SceneCanvasProps) => (
	<div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
		<Canvas
			dpr={[1, 1.5]}
			camera={CANVAS_CAMERA}
			gl={CANVAS_GL}
			shadows={false}
		>
			{/* Pass ref directly — Scene reads in useFrame, no prop re-renders */}
			<Scene scrollProgressRef={scrollProgressRef} />

			<EffectComposer disableNormalPass>
				<Bloom
					intensity={0.5}
					luminanceThreshold={0.6} // lower = more bloom on orb
					luminanceSmoothing={0.9} // high = soft bloom edges
				/>
			</EffectComposer>
		</Canvas>
	</div>
);

// ─── Minimal Suspense Fallback ────────────────────────────────────────────────

const SuspenseFallback = () => (
	<div className="min-h-screen bg-black" aria-hidden="true" />
);

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
	const [loaded, setLoaded] = useState(false);

	// Typed explicitly — MutableRefObject<number>
	const scrollProgressRef = useRef<number>(0);

	// ── Scroll tracking — passive listener, not ScrollTrigger ─────────────
	// ScrollTrigger.create() is element-based — overkill for global progress.
	// A passive scroll listener writes directly to the ref — no overhead.
	useEffect(() => {
		if (!loaded) return;

		const onScroll = () => {
			const total = document.body.scrollHeight - window.innerHeight;
			if (total <= 0) return;
			scrollProgressRef.current = window.scrollY / total;
		};

		// Set initial value
		onScroll();

		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, [loaded]);

	const handleLoadComplete = useCallback(() => setLoaded(true), []);

	return (
		<RootErrorBoundary>
			{/* ── 1. Loading gate ── */}
			{!loaded && (
				<LoadingScreen
					name={LOADING_NAME}
					onComplete={handleLoadComplete}
				/>
			)}

			{/* ── 2. Experience layer ── */}
			<div
				style={{
					opacity: loaded ? 1 : 0,
					visibility: loaded ? "visible" : "hidden",
					transition: "opacity 800ms ease-in-out",
					pointerEvents: loaded ? "auto" : "none",
				}}
			>
				{/* Fixed 3D canvas — ref passed, not value */}
				<SceneCanvas scrollProgressRef={scrollProgressRef} />

				{/* Scrollable content */}
				<Suspense fallback={<SuspenseFallback />}>
					<MainContainer scrollRef={scrollProgressRef} />
				</Suspense>
			</div>
		</RootErrorBoundary>
	);
}
