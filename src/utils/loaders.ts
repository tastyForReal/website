import type { PathLike } from 'node:fs';
import { readdir, stat } from 'node:fs/promises';
import { URL } from 'node:url';
import { predicate as pagePredicate, type Page } from '../pages/index.ts';

/**
 * Loads structures from a directory recursively.
 *
 * @param dir - The directory to load structures from.
 * @param predicate - A predicate function to check if a structure is valid.
 * @param recursive - Whether to load structures recursively.
 * @returns An array of structures.
 */
export async function loadStructures<T>(
	dir: PathLike,
	predicate: StructurePredicate<T>,
	recursive = true,
): Promise<T[]> {
	// Get the stats of the directory.
	const statDir = await stat(dir);

	// Throw an error if the directory is not a directory.
	if (!statDir.isDirectory()) {
		throw new Error(`The directory '${dir}' is not a directory.`);
	}

	// Read the files in the directory.
	const files = await readdir(dir);

	// Initialize an empty array to store the structures.
	const structures: T[] = [];

	// Iterate over the files in the directory.
	for (const file of files) {
		// Skip the index.ts file and any files that don't end with .ts.
		if (file === 'index.ts' || !file.endsWith('.ts')) {
			continue;
		}

		// Get the stats of the file.
		const statFile = await stat(new URL(`${dir}/${file}`));

		// If the file is a directory and recursive is true, recursively load structures from the directory.
		if (statFile.isDirectory() && recursive) {
			structures.push(...(await loadStructures(`${dir}/${file}`, predicate, recursive)));
			continue;
		}

		// Import the structure dynamically from the file.
		const structure = (await import(`${dir}/${file}`)).default;

		// If the structure is valid according to the predicate, add it to the structures array.
		if (predicate(structure)) structures.push(structure);
	}

	// Return the array of structures.
	return structures;
}

/**
 * Loads pages from a directory recursively.
 *
 * @param dir - The directory to load pages from.
 * @param recursive - Whether to load pages recursively.
 * @returns An array of pages.
 */
export async function loadPages(dir: PathLike, recursive = true): Promise<Page[]> {
	// Load structures from the directory using the page predicate.
	return loadStructures(dir, pagePredicate, recursive);
}

export type StructurePredicate<T> = (structure: unknown) => structure is T;
