import { access, rm, mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { URL } from 'node:url';
import { fileURLToPath } from 'bun';
import { load } from 'cheerio';
import { format } from 'prettier';
import { startServer } from './core/server.ts';
import { noscript } from './modules/contents.ts';
import { template } from './modules/template.ts';
import { buildAssets } from './utils/buildAssets.ts';
import { loadPages } from './utils/loaders.ts';
import { markdownToHtml } from './utils/markdownUtils.ts';

/**
 * Generates the static site for the application.
 *
 * This function loads pages from the 'pages' directory, generates HTML for each page,
 * writes the HTML to the 'build' directory, and then builds the static assets.
 *
 * @returns An array of generated pages.
 */
export async function generateSite() {
	try {
		// Try to access the 'build' directory.
		await access('./build');
		// If the directory exists, remove it recursively.
		await rm('./build', { recursive: true, force: true });
	} catch {
		// If the directory doesn't exist, do nothing.
	} finally {
		// Create the 'build' directory.
		await mkdir('./build');
	}

	// Load pages from the 'pages' directory.
	const pages = await loadPages(new URL('pages/', import.meta.url));

	// Iterate over the pages and generate HTML for each page.
	for (const page of pages) {
		// Load the template HTML using Cheerio.
		const $ = load(template);
		// Set the title of the page.
		$('title').text(`${page.title} | tastyForReal`);

		// Create a navigation bar.
		const nav = $('<nav>');
		// Iterate over the pages and add links to the navigation bar.
		for (const linkPage of pages) {
			const link = $('<a>');

			// If the page is a redirect page, set the link attributes accordingly.
			if ('redirectUrl' in linkPage && !('generateContent' in linkPage)) {
				link.attr({
					href: linkPage.redirectUrl,
					target: '_blank',
					rel: 'noopener noreferrer',
				});
			} else {
				// Otherwise, set the link attributes based on the page path.
				let href = '/';
				if (linkPage.pathName !== 'index') {
					href += linkPage.pathName;
				}

				link.attr({ href });
			}

			// Add the link to the navigation bar.
			nav.append(link.text(linkPage.title));
		}

		// Append the navigation bar to the body.
		$('body').append(nav);

		// Create a main container.
		const mainContainer = $('<div>').addClass('main-container');
		// Add the noscript content to the main container.
		mainContainer.append(`<noscript>${await markdownToHtml(noscript)}</noscript>`);
		// Append the main container to the body.
		$('body').append(mainContainer);

		// If the page is a content page, generate the content.
		if (!('redirectUrl' in page) && 'generateContent' in page) {
			await page.generateContent($);
		}

		// Add a copyright notice to the body.
		const copyright = $('<p>')
			.addClass('copyright')
			.html(`This website \u00A9 ${new Date().getUTCFullYear()} tastyForReal.<br />All rights reserved.`);
		$('body').append(copyright);

		// Format the HTML using Prettier.
		const formattedHtml = await format($.html(), {
			parser: 'html',
			printWidth: 120,
			useTabs: true,
			singleQuote: true,
			quoteProps: 'as-needed',
			trailingComma: 'all',
			endOfLine: 'lf',
		});

		// Write the formatted HTML to the build directory.
		await writeFile(`./build/${page.pathName}.html`, formattedHtml, 'utf8');
	}

	// Build the static assets.
	await buildAssets();

	// Return the generated pages.
	return pages;
}

// Generate the site.
const generatedPages = await generateSite();

// Get the current file URL and directory.
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename).slice(0, -4);

// Start the server.
startServer(generatedPages, __dirname);
