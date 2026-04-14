// src/data/personalDetails.ts

type SocialLinks = {
	github: string;
	linkedin: string;
	email: string;
	portfolio?: string;
};

type PersonalDetails = {
	name: string;
	title: string;
	tagline: string;
	about: string;
	location: string;
	skills: string[];
	social: SocialLinks;
};

// FIXED: Changed from 'const' to 'export const' so App.tsx can find it
export const personalDetails: PersonalDetails = {
	name: "Umesh Kumar Shah",

	// Main role (used across site)
	title: "Software Engineer",

	// Short punchline (used in hero/about)
	tagline: "Building immersive web experiences with React & Three.js",

	// About section (keep it recruiter-focused)
	about: "I am a passionate Software Engineer specializing in full-stack development and 3D web experiences. I build high-performance, interactive applications using React, Three.js, and modern web technologies. I enjoy solving complex problems and creating visually engaging user experiences.",

	location: "India",

	skills: [
		"JavaScript",
		"TypeScript",
		"React.js",
		"Three.js",
		"React Three Fiber",
		"Node.js",
		"MongoDB",
		"MySQL",
		"GSAP",
		"HTML",
		"CSS",
	],

	social: {
		github: "https://github.com/umeshkumar-git",
		linkedin: "https://linkedin.com/in/umeshshah",
		email: "me@umeshshah.in",
		portfolio: "https://umeshshah.in",
	},
};

// FIXED: Removed the 'export default personalDetails;' from here
