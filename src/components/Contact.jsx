import { useState, ChangeEvent, FormEvent } from "react";
import emailjs from "@emailjs/browser";

const Contact = () => {
	const [form, setForm] = useState({
		name: "",
		email: "",
		message: "",
	});

	// Updates the state whenever you type in an input
	const handleChange = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setForm({ ...form, [name]: value });
	};

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		emailjs
			.send(
				import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
				import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
				form,
				import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY
			)
			.then(() => {
				alert("Message sent successfully!");
				// Clears the form after a successful send
				setForm({ name: "", email: "", message: "" });
			})
			.catch((error) => {
				console.error("EmailJS Error:", error);
				alert("Something went wrong. Please try again.");
			});
	};

	return (
		<form onSubmit={handleSubmit}>
			<input
				type="text"
				name="name"
				value={form.name}
				onChange={handleChange}
				placeholder="Your Name"
				required
			/>
			<input
				type="email"
				name="email"
				value={form.email}
				onChange={handleChange}
				placeholder="Your Email"
				required
			/>
			<textarea
				name="message"
				value={form.message}
				onChange={handleChange}
				placeholder="Your Message"
				required
			/>
			<button type="submit">Send</button>
		</form>
	);
};

export default Contact;
