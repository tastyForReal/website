import { terms } from '../modules/contents.ts';
import { generateTableOfContents, markdownToHtml } from '../utils/markdownUtils.ts';
import type { Page } from './index.ts';

export default {
	title: 'Terms of Use',
	pathName: 'terms',
	generateContent: async ($) => {
		const termsOfUseTableOfContents = await generateTableOfContents(terms);
		$('.main-container').append(await markdownToHtml(termsOfUseTableOfContents));
	},
} satisfies Page;
