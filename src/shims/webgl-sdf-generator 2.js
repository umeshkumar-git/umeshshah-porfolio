// src/shims/webgl-sdf-generator.js
export default function createSDFGenerator() {
	console.warn("Using local webgl-sdf-generator shim");
}
// You might also need to export it as a named export depending on the version
export { createSDFGenerator };
