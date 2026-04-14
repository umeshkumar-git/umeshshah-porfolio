import { memo } from "react";
import styles from "./About.module.css";

function About() {
	return (
		<section className={styles.section}>
			<div className={styles.container}>
				<h2 className={styles.title}>About Me</h2>
				<p className={styles.description}>
					I'm a Computer Science student passionate about building
					full-stack applications. I focus on performance, clean code,
					and solving real-world problems using modern technologies.
				</p>
			</div>
		</section>
	);
}

export default memo(About);
