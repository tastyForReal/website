import { setTimeout } from 'node:timers/promises';

/**
 * Fetches data from a URL and parses it as JSON.
 *
 * @param url - The URL to fetch data from.
 * @param maxRetries - The maximum number of retries.
 * @param retryDelay - The delay between retries in milliseconds.
 * @returns The parsed JSON data.
 */
export async function httpGetFromJson<T>(url: string, maxRetries = 5, retryDelay = 5_000): Promise<T> {
	let retries = 0;
	while (retries < maxRetries) {
		try {
			// Fetch the data from the URL.
			const response = await fetch(url);

			// Throw an error if the response is not OK.
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			// Parse the response as JSON.
			const data = await response.json();

			// Return the parsed JSON data.
			return data as T;
		} catch (error) {
			// Log the error and retry after a delay.
			console.error(`Error fetching data from ${url}: ${error.message}`);
			retries++;
			await setTimeout(retryDelay);
		}
	}

	// Throw an error if all retries failed.
	throw new Error(`Failed to fetch data from ${url} after ${maxRetries} retries.`);
}

/**
 * Fetches data from a URL and returns it as a string.
 *
 * @param url - The URL to fetch data from.
 * @param maxRetries - The maximum number of retries.
 * @param retryDelay - The delay between retries in milliseconds.
 * @returns The fetched data as a string.
 */
export async function httpGetString(url: string, maxRetries = 5, retryDelay = 5_000): Promise<string> {
	let retries = 0;
	while (retries < maxRetries) {
		try {
			// Fetch the data from the URL.
			const response = await fetch(url);

			// Throw an error if the response is not OK.
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			// Return the response as a string.
			return await response.text();
		} catch (error) {
			// Log the error and retry after a delay.
			console.error(`Error fetching data from ${url}: ${error.message}`);
			retries++;
			await setTimeout(retryDelay);
		}
	}

	// Throw an error if all retries failed.
	throw new Error(`Failed to fetch data from ${url} after ${maxRetries} retries.`);
}
