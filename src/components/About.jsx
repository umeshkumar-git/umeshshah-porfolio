import { skills } from "../constants";

const About = () => {
	return (
		<section>
			<h1>About Me</h1>
			{skills.map((skill) => (
				<p key={skill.name}>{skill.name}</p>
			))}
		</section>
	);
};

export default About;
