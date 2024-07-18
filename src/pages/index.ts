import type { CheerioAPI } from 'cheerio';
import { z } from 'zod';
import type { StructurePredicate } from '../utils/loaders.ts';

/**
 * Represents a page with content that can be generated.
 */
export type ContentPage = {
	/**
	 * Generates the content for the page using Cheerio.
	 *
	 * @param $ - The Cheerio instance.
	 */
	generateContent($: CheerioAPI): Promise<void> | void;
	/**
	 * The path name of the page.
	 */
	pathName: string;
	/**
	 * The title of the page.
	 */
	title: string;
};

/**
 * Represents a page that redirects to another URL.
 */
export type RedirectPage = {
	/**
	 * The path name of the page.
	 */
	pathName: string;
	/**
	 * The URL to redirect to.
	 */
	redirectUrl: string;
	/**
	 * The title of the page.
	 */
	title: string;
};

/**
 * Represents a page, which can be either a content page or a redirect page.
 */
export type Page = ContentPage | RedirectPage;

/**
 * Zod schema for a content page.
 */
const contentPageSchema = {
	generateContent: z.function(),
	pathName: z.string(),
	title: z.string(),
};

/**
 * Zod schema for a redirect page.
 */
const redirectPageSchema = {
	pathName: z.string(),
	redirectUrl: z.string(),
	title: z.string(),
};

/**
 * Zod schema for a page.
 */
const pageSchema = z.object(contentPageSchema).or(z.object(redirectPageSchema));

/**
 * Predicate function to check if a given structure is a Page.
 *
 * @param structure - The structure to check.
 * @returns True if the structure is a Page, false otherwise.
 */
export const predicate: StructurePredicate<Page> = (structure: unknown): structure is Page =>
	pageSchema.safeParse(structure).success;
