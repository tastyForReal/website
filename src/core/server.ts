import process from 'node:process';
import express from 'express';
import type { Page } from '../pages/index.ts';

/**
 * Starts the server for the application.
 *
 * @param pages - An array of pages to serve.
 * @param __dirname - The directory name of the current module.
 */
export function startServer(pages: Page[], __dirname: string) {
	// Create an Express application.
	const app = express();

	// Disable the "X-Powered-By" header.
	app.disable('x-powered-by');

	// Serve static files from the build directory.
	app.use('/', express.static('./build'));

	// Serve the index.html file for the root path.
	app.get('/', (request, response) => response.sendFile(`${__dirname}/build/index.html`));

	// Iterate over the pages and set up routes for each page.
	for (const page of pages) {
		// Skip the index page.
		if (page.pathName !== 'index') {
			// If the page is a redirect page, set up a redirect route.
			if ('redirectUrl' in page) {
				app.get(`/${page.pathName}`, (request, response) => {
					response.redirect(page.redirectUrl);
				});
				continue;
			}

			// If the page is a content page, set up a route to serve the HTML file.
			if ('generateContent' in page) {
				app.get(`/${page.pathName}`, (request, response) => {
					response.sendFile(`${__dirname}/build/${page.pathName}.html`);
				});
			}
		}
	}

	// Redirect all other requests to the root path.
	app.get('*', (request, response) => response.redirect('/'));

	// Get the port from the environment variable or use the default port 8080.
	const port = Number.parseInt(process.env.PORT!, 10) || 8_080;

	// Start the server and log a message to the console.
	app.listen(port, () => {
		console.log(`Listening on port ${port}`);
	});
}
