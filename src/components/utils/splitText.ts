import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// NOTE: Using a custom split logic if GSAP SplitText (Paid) is not available
// If you have the paid version, keep the SplitText import.

interface AnimatableElement extends HTMLElement {
	anim?: gsap.core.Animation;
}

gsap.registerPlugin(ScrollTrigger);

/**
 * Optimized Text Splitting Utility
 * Handles both Titles (character-based) and Paragraphs (word-based)
 */
export const initSplitText = () => {
	ScrollTrigger.config({ ignoreMobileResize: true });

	const paras = document.querySelectorAll<AnimatableElement>(".para");
	const titles = document.querySelectorAll<AnimatableElement>(".title");

	const triggerStart = "top 85%";
	const toggleAction = "play none none reverse"; // Smoother for portfolio feel

	// Cleanup and Animate Paragraphs
	paras.forEach((para) => {
		// Basic innerHTML split (replaces need for paid SplitText for simple use cases)
		if (!para.dataset.split) {
			const text = para.innerText;
			para.innerHTML = text
				.split(" ")
				.map(
					(
						word
					) => `<span class="word-wrap" style="display:inline-block; overflow:hidden;">
                        <span class="word-inner" style="display:inline-block;">${word}&nbsp;</span>
                      </span>`
				)
				.join("");
			para.dataset.split = "true";
		}

		const words = para.querySelectorAll(".word-inner");

		if (para.anim) para.anim.kill();

		para.anim = gsap.fromTo(
			words,
			{ y: "110%", opacity: 0 },
			{
				y: "0%",
				opacity: 1,
				duration: 1,
				ease: "power3.out",
				stagger: 0.01,
				scrollTrigger: {
					trigger: para,
					start: triggerStart,
					toggleActions: toggleAction,
				},
			}
		);
	});

	// Cleanup and Animate Titles
	titles.forEach((title) => {
		if (!title.dataset.split) {
			const text = title.innerText;
			title.innerHTML = text
				.split("")
				.map(
					(char) =>
						`<span class="char-inner" style="display:inline-block;">${
							char === " " ? "&nbsp;" : char
						}</span>`
				)
				.join("");
			title.dataset.split = "true";
		}

		const chars = title.querySelectorAll(".char-inner");

		if (title.anim) title.anim.kill();

		title.anim = gsap.fromTo(
			chars,
			{ y: 50, opacity: 0, rotate: 5 },
			{
				y: 0,
				opacity: 1,
				rotate: 0,
				duration: 0.8,
				ease: "back.out(1.7)",
				stagger: 0.03,
				scrollTrigger: {
					trigger: title,
					start: triggerStart,
					toggleActions: toggleAction,
				},
			}
		);
	});
};
