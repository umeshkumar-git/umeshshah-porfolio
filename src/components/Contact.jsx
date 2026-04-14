import { memo, useState, useCallback } from "react";
import styles from "./Contact.module.css";

// Configuration - easy to update
const CONTACT_CONFIG = {
	email: "umesh@example.com",
	github: "https://github.com/umesh",
	linkedin: "https://linkedin.com/in/umesh",
	twitter: "https://twitter.com/umesh",
};

const CONTACT_METHODS = [
	{
		id: "email",
		label: "Email",
		icon: "✉️",
		type: "email",
		value: CONTACT_CONFIG.email,
		href: `mailto:${CONTACT_CONFIG.email}`,
		color: "email",
	},
	{
		id: "linkedin",
		label: "LinkedIn",
		icon: "💼",
		type: "social",
		href: CONTACT_CONFIG.linkedin,
		target: "_blank",
		color: "linkedin",
	},
	{
		id: "github",
		label: "GitHub",
		icon: "🔗",
		type: "social",
		href: CONTACT_CONFIG.github,
		target: "_blank",
		color: "github",
	},
	{
		id: "twitter",
		label: "Twitter",
		icon: "𝕏",
		type: "social",
		href: CONTACT_CONFIG.twitter,
		target: "_blank",
		color: "twitter",
	},
];

const ContactButton = memo(({ method, onCopy }) => {
	const [copied, setCopied] = useState(false);

	const handleClick = useCallback(() => {
		if (method.type === "email") {
			// Copy email to clipboard and open mailto
			navigator.clipboard.writeText(method.value).then(() => {
				setCopied(true);
				setTimeout(() => setCopied(false), 2000);
				// Also open email client
				window.location.href = method.href;
			});
		} else {
			// Open social link in new tab
			window.open(method.href, "_blank", "noopener,noreferrer");
		}
	}, [method]);

	return (
		<button
			onClick={handleClick}
			className={`${styles.contactButton} ${
				styles[`contactButton--${method.color}`]
			}`}
			aria-label={`Contact via ${method.label}${
				method.type === "email" ? ` at ${method.value}` : ""
			}`}
			title={
				method.type === "email"
					? `Click to copy: ${method.value}`
					: `Open ${method.label}`
			}
		>
			<span className={styles.icon}>{method.icon}</span>
			<div className={styles.buttonContent}>
				<span className={styles.label}>{method.label}</span>
				{method.type === "email" && (
					<span className={styles.value}>{method.value}</span>
				)}
			</div>
			{copied && <span className={styles.copied}>Copied!</span>}
		</button>
	);
});

ContactButton.displayName = "ContactButton";

const Contact = memo(() => {
	return (
		<section
			id="contact"
			className={styles.section}
			role="region"
			aria-labelledby="contact-heading"
		>
			<div className={styles.container}>
				{/* Hero Content */}
				<div className={styles.content}>
					<h2 id="contact-heading" className={styles.heading}>
						Let's Work{" "}
						<span className={styles.accent}>Together</span>
					</h2>

					<p className={styles.description}>
						I'm actively looking for internships and freelance
						opportunities. Reach out and let's create something
						amazing!
					</p>

					<p className={styles.subDescription}>
						Feel free to connect on any platform or send me a direct
						message.
					</p>
				</div>

				{/* Contact Grid */}
				<div className={styles.contactGrid}>
					{CONTACT_METHODS.map((method) => (
						<ContactButton key={method.id} method={method} />
					))}
				</div>

				{/* Bottom CTA */}
				<div className={styles.footer}>
					<p className={styles.footerText}>
						💡 <strong>Tip:</strong> Click email to copy or open
						your mail client
					</p>
				</div>
			</div>
		</section>
	);
});

Contact.displayName = "Contact";

export default Contact;
