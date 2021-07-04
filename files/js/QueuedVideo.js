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
		this.element = element;
	}

	static VideoToQueuedVideo = (video, element) => {
		if (video instanceof DownloadedVideo) {
			return new QueuedDownloadedVideo(video, element);
		} else {
			return new QueuedVideo(video, element);
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
		this.element = element;
	}
}
