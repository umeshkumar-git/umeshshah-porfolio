import { useState } from "react";
import emailjs from "@emailjs/browser";

const Contact = () => {
	const [form, setForm] = useState({
		name: "",
		email: "",
		message: "",
	});

	const handleSubmit = (e) => {
		e.preventDefault();

		emailjs.send(
			import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
			import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
			form,
			import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY
		);
	};

	return (
		<form onSubmit={handleSubmit}>
			<input name="name" />
			<input name="email" />
			<textarea name="message" />
			<button type="submit">Send</button>
		</form>
	);
};

export default Contact;
