import { readFile, writeFile } from 'node:fs/promises';
import { build } from 'esbuild';

/**
 * Deploys the static assets for the application.
 *
 * This function reads the favicon.ico file from the src/front directory,
 * writes it to the build directory, and then builds the CSS file using esbuild.
 */
export async function buildAssets() {
	try {
		// Read the favicon.ico file from the src/front directory.
		const favicon = await readFile('src/front/favicon.ico');

		// Write the favicon.ico file to the build directory.
		await writeFile('build/favicon.ico', favicon);

		// Build the CSS file using esbuild.
		await build({
			// Specify the entry point for the CSS file.
			entryPoints: ['src/front/style.css'],
			// Specify the output directory for the built files.
			outdir: 'build',
			// Enable minification for the CSS file.
			minify: true,
			// Specify the loader for CSS files.
			loader: { '.css': 'css' },
			// Specify the character set for the output files.
			charset: 'utf8',
		});
	} catch (error) {
		// Log any errors that occur during the deployment process.
		console.error(error);
	}
}
