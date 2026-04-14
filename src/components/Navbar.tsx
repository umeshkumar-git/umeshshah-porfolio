import { useState } from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false);

	const links = [
		{ label: "Home", to: "/" },
		{ label: "About", to: "/about" },
		{ label: "Projects", to: "/projects" },
		{ label: "Contact", to: "/contact" },
	];

	return (
		<header className="header">
			<NavLink to="/">U</NavLink>

			<nav>
				{links.map(({ label, to }) => (
					<NavLink key={to} to={to}>
						{label}
					</NavLink>
				))}
			</nav>

			<button onClick={() => setIsOpen(!isOpen)}>Menu</button>
		</header>
	);
};

export default Navbar;
