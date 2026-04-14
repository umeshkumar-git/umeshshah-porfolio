import { useState, useRef, useEffect, memo, useCallback } from "react";
import styles from "./Chatbot.module.css";

const BOT_RESPONSES = {
	default:
		"I'm Umesh's AI assistant! 🤖 Ask me about his projects, skills, or experience.",
	projects:
		"Umesh has worked on full-stack applications, 3D web experiences with Three.js, and AI-powered features. Would you like details on a specific project?",
	skills: "Umesh specializes in React, Three.js, Node.js, and modern web technologies. He's passionate about performance optimization and clean code.",
	contact:
		"You can reach Umesh via LinkedIn, GitHub, or email (check the contact section below). Feel free to connect!",
	experience:
		"Umesh is a Computer Science student at Bangalore Technological Institute, exploring AI, generative models, and full-stack development.",
};

const detectIntent = (userInput) => {
	const input = userInput.toLowerCase();
	if (input.match(/(project|work|built|creation)/))
		return BOT_RESPONSES.projects;
	if (input.match(/(skill|expertise|tech|technology)/))
		return BOT_RESPONSES.skills;
	if (input.match(/(contact|email|linkedin|github|reach)/))
		return BOT_RESPONSES.contact;
	if (input.match(/(experience|background|education|study)/))
		return BOT_RESPONSES.experience;
	return BOT_RESPONSES.default;
};

const MessageBubble = memo(({ message }) => (
	<div
		className={`${styles.messageBubble} ${
			styles[`messageBubble--${message.sender}`]
		}`}
		role="article"
		aria-label={`${
			message.sender === "user" ? "Your message" : "Assistant message"
		}: ${message.text}`}
	>
		{message.sender === "bot" && <span className={styles.botIcon}>🤖</span>}
		<div className={styles.messageContent}>{message.text}</div>
	</div>
));

MessageBubble.displayName = "MessageBubble";

const ChatbotWidget = memo(() => {
	const [isOpen, setIsOpen] = useState(false);
	const [messages, setMessages] = useState([
		{
			id: Date.now(),
			text: "Hi! I'm Umesh's portfolio assistant 👋 Ask me anything!",
			sender: "bot",
			timestamp: new Date(),
		},
	]);
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const messagesEndRef = useRef(null);
	const chatboxRef = useRef(null);
	const inputRef = useRef(null);

	// Auto-scroll to latest message
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	// Focus input when chat opens
	useEffect(() => {
		if (isOpen) {
			setTimeout(() => inputRef.current?.focus(), 100);
		}
	}, [isOpen]);

	const handleSendMessage = useCallback(async () => {
		if (!input.trim()) return;

		const userMessage = {
			id: Date.now(),
			text: input,
			sender: "user",
			timestamp: new Date(),
		};

		setMessages((prev) => [...prev, userMessage]);
		setInput("");
		setIsLoading(true);

		// Simulate API delay (replace with actual API call)
		setTimeout(() => {
			const botReply = {
				id: Date.now() + 1,
				text: detectIntent(input),
				sender: "bot",
				timestamp: new Date(),
			};
			setMessages((prev) => [...prev, botReply]);
			setIsLoading(false);
		}, 600);
	}, [input]);

	const handleKeyPress = useCallback(
		(e) => {
			if (e.key === "Enter" && !e.shiftKey) {
				e.preventDefault();
				handleSendMessage();
			}
		},
		[handleSendMessage]
	);

	const handleToggle = useCallback(() => {
		setIsOpen((prev) => !prev);
	}, []);

	return (
		<div
			className={styles.container}
			role="region"
			aria-label="Chat assistant"
		>
			<button
				className={styles.toggleButton}
				onClick={handleToggle}
				aria-label={isOpen ? "Close chat" : "Open chat"}
				aria-expanded={isOpen}
				aria-controls="chatbot-widget"
			>
				<span className={styles.toggleIcon}>{isOpen ? "✕" : "💬"}</span>
			</button>

			{isOpen && (
				<div
					className={styles.chatbox}
					id="chatbot-widget"
					role="dialog"
					aria-label="Chat with Umesh's assistant"
					ref={chatboxRef}
				>
					<div className={styles.chatHeader}>
						<h3>Umesh's Assistant</h3>
						<button
							onClick={handleToggle}
							className={styles.closeButton}
							aria-label="Close chat"
						>
							✕
						</button>
					</div>

					<div className={styles.messagesContainer}>
						{messages.map((message) => (
							<MessageBubble key={message.id} message={message} />
						))}
						{isLoading && (
							<div className={styles.loadingIndicator}>
								<span></span>
								<span></span>
								<span></span>
							</div>
						)}
						<div ref={messagesEndRef} />
					</div>

					<div className={styles.inputContainer}>
						<input
							ref={inputRef}
							type="text"
							value={input}
							onChange={(e) => setInput(e.target.value)}
							onKeyPress={handleKeyPress}
							placeholder="Ask about projects, skills..."
							className={styles.input}
							disabled={isLoading}
							aria-label="Chat message input"
						/>
						<button
							onClick={handleSendMessage}
							disabled={!input.trim() || isLoading}
							className={styles.sendButton}
							aria-label="Send message"
						>
							{isLoading ? "..." : "→"}
						</button>
					</div>
				</div>
			)}
		</div>
	);
});

ChatbotWidget.displayName = "ChatbotWidget";

export default ChatbotWidget;
