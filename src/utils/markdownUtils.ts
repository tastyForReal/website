import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import { remark } from 'remark';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import remarkToc from 'remark-toc';
import { unified } from 'unified';

/**
 * Generates a table of contents from a markdown string.
 *
 * @param markdown - The markdown string to generate the table of contents from.
 * @returns The table of contents as a string.
 */
export async function generateTableOfContents(markdown: string) {
	return `${(await remark().use(remarkToc).process(markdown)).value}`;
}

/**
 * Converts a markdown string to HTML.
 *
 * @param markdown - The markdown string to convert to HTML.
 * @returns The HTML string.
 */
export async function markdownToHtml(markdown: string) {
	return `${
		(
			await unified()
				// Enable line breaks.
				.use(remarkBreaks)
				// Enable GitHub Flavored Markdown.
				.use(remarkGfm)
				// Parse the markdown string.
				.use(remarkParse)
				// Convert the markdown to HTML.
				.use(remarkRehype)
				// Automatically link headings.
				.use(rehypeAutolinkHeadings)
				// Generate slugs for headings.
				.use(rehypeSlug)
				// Stringify the HTML.
				.use(rehypeStringify)
				// Process the markdown string.
				.process(markdown)
		).value
	}`;
}
