// ─── src/data/personalDetails.ts ─────────────────────────────────────────────
// All your personal info lives here. Edit this file to update the whole site.

export const personalDetails = {
	name: "Umesh Kumar Shah",
	title: "Full Stack Developer",
	tagline: "Building immersive web experiences with React & Three.js",
	about: "I'm a passionate Full Stack Developer specialising in React, Three.js, and modern web technologies. I build high-performance, interactive applications and enjoy solving complex problems through clean, scalable code.",
	location: "Bengaluru, India",
	institution: "Bangalore Technological Institute",
	cgpa: "8.12",

	social: {
		github: "https://github.com/umeshkumar-git",
		linkedin: "https://linkedin.com/in/umesh-kumar-shah",
		email: "me@umeshshah.in",
		resume: "/iamumesh_resume (1).pdf",
	},

	projects: [
		{
			id: "ecommerce",
			title: "E-commerce Platform",
			category: "Full Stack Web Application",
			description:
				"Multi-vendor marketplace with cart, Stripe payments, and an admin dashboard. Handles inventory, orders, and role-based access for vendors and buyers.",
			tools: ["React", "Node.js", "Express", "MongoDB", "Stripe"],
			image: "/images/ecommerce.png",
			github: "https://github.com/umeshkumar-git/ecommerce",
			live: "https://ecommerce-demo.vercel.app",
			year: "2024",
		},
		{
			id: "lavoro",
			title: "Lavoro Task System",
			category: "Productivity Management",
			description:
				"Kanban-style task manager with drag-and-drop boards, real-time sync via WebSockets, and GitHub Issues API integration for dev workflow management.",
			tools: ["React", "TypeScript", "Socket.io", "GitHub API"],
			image: "/images/lavoro.png",
			github: "https://github.com/umeshkumar-git/lavoro",
			year: "2024",
		},
		{
			id: "eventics",
			title: "Eventics",
			category: "Event Management System",
			description:
				"Full-featured event platform with ticketing, RSVP management, and QR code check-in. Built with a focus on mobile UX and offline support.",
			tools: ["React", "Node.js", "MongoDB", "QR Code API"],
			image: "/images/eventics.png",
			github: "https://github.com/umeshkumar-git/eventics",
			year: "2023",
		},
	],

	career: [
		{
			id: 1,
			type: "education",
			title: "Bachelor of Engineering",
			institution: "Bangalore Technological Institute",
			date: "NOW",
			description:
				"Computer Science and Engineering (2023–Present). CGPA: 8.12",
			icon: "🎓",
		},
		{
			id: 2,
			type: "certification",
			title: "Generative AI Mastermind",
			institution: "Outskill",
			date: "2026",
			description:
				"Mastered Generative AI concepts and application development.",
			icon: "⚡",
		},
		{
			id: 3,
			type: "certification",
			title: "AI Agents Intensive",
			institution: "Kaggle / Google",
			date: "2025",
			description:
				"Completed specialised training in developing and implementing AI agents.",
			icon: "🤖",
		},
	],
};
