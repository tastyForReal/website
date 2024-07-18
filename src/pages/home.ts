import type { CheerioAPI } from 'cheerio';
import { load } from 'cheerio';
import { intro } from '../modules/contents.ts';
import { httpGetString } from '../utils/httpUtils.ts';
import { markdownToHtml } from '../utils/markdownUtils.ts';
import type { Page } from './index.ts';

export default {
	title: 'Home',
	pathName: 'index',
	generateContent: async ($: CheerioAPI) => {
		const introSection = $('<div>')
			.addClass('intro')
			.append(await markdownToHtml(intro));
		$('.main-container').append(introSection);

		const youtubeFeedUrl = 'https://www.youtube.com/feeds/videos.xml?channel_id=UCYLgf3MLuaZNlNymMs8PbIQ';
		const youtubeFeedXml = await httpGetString(youtubeFeedUrl);
		const xml = load(youtubeFeedXml, { xmlMode: true });
		const videosSection = $('<div>').addClass('videos').append($('<h1>').text('Videos'));

		for (const entry of xml('entry')) {
			const current = $(entry);
			const videoEntry = $('<div>').addClass('video-entry');

			const videoTitle = current.find('title').text();
			const videoDescription = current.find('media\\:description').text();
			const videoId = current.find('id').text().replace('yt:video:', '');
			const publishedDate = new Date(current.find('published').text()).toUTCString();
			const updatedDate = new Date(current.find('updated').text()).toUTCString();

			videosSection.append($('<hr>'));
			videoEntry.append($('<h2>').text(videoTitle));
			videoEntry.append($('<p>').html(`Published: ${publishedDate}<br />Updated: ${updatedDate}`));
			videoEntry.append(
				$('<iframe>').attr({
					frameborder: '0',
					'aria-label': videoTitle,
					src: `https://www.youtube.com/embed/${videoId}`,
					allowfullscreen: 'true',
					width: '640',
					height: '360',
				}),
			);
			videoEntry.append(
				$('<div>')
					.addClass('video-description')
					.html(await markdownToHtml(videoDescription)),
			);
			videosSection.append(videoEntry);
		}

		$('.main-container').append(videosSection);
	},
} satisfies Page;
