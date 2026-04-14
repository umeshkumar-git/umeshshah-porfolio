import { useEffect, useState } from "react";

const DESKTOP_BREAKPOINT = 1024;

export function useIsDesktop(): boolean {
	// Safe initializer — no window access during SSR
	const [isDesktop, setIsDesktop] = useState<boolean>(() => {
		if (typeof window === "undefined") return true;
		return window.innerWidth > DESKTOP_BREAKPOINT;
	});

	useEffect(() => {
		// matchMedia is more performant than resize + innerWidth
		const mql = window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`);
		const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);

		mql.addEventListener("change", handler);
		return () => mql.removeEventListener("change", handler);
	}, []);

	return isDesktop;
}
