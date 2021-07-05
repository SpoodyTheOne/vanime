//@ts-check
class QueuedVideo extends AnimeVideo {
	constructor(video, element) {
		//call AnimeVideo constructor
		super(
			video.name,
			video.url,
			video.episode,
			video.season,
			video.ova,
			video.movie
		);

		/** @type {HTMLDivElement} */
		this.element = element;
	}

	static VideoToQueuedVideo = (video, element) => {
		if (video instanceof DownloadedVideo) {
			let newVideo = new QueuedDownloadedVideo(video, element);
			newVideo.id = video.id;
			return newVideo;
		} else {
			let newVideo = new QueuedVideo(video, element);
			newVideo.id = video.id;
			return newVideo;
		}
	};
}

class QueuedDownloadedVideo extends DownloadedVideo {
	constructor(video, element) {
		//call AnimeVideo constructor
		super(
			video.name,
			video.url,
			video.episode,
			video.season,
			video.ova,
			video.movie
		);

		/** @type {HTMLDivElement} */
		this.element = element;
	}
}
