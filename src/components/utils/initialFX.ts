import gsap from "gsap";

export function initialFX() {
  document.body.style.overflowY = "auto";
  const main = document.getElementsByTagName("main")[0];
  if (main) {
    main.classList.add("main-active");
    main.style.opacity = "1";
  }
  gsap.fromTo(".landing-container", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, delay: 0.5 });
}