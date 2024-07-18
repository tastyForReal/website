import { about } from '../modules/contents.ts';
import { generateTableOfContents, markdownToHtml } from '../utils/markdownUtils.ts';
import type { Page } from './index.ts';

export default {
	title: 'About Me',
	pathName: 'about',
	generateContent: async ($) => {
		const aboutMeTableOfContents = await generateTableOfContents(about);
		$('.main-container').append(await markdownToHtml(aboutMeTableOfContents));
	},
} satisfies Page;
