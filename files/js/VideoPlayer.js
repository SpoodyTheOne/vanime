//@ts-check
class VideoPlayer {
	/** @type {HTMLVideoElement} */
	//@ts-ignore
	static video = document.getElementById("video-player");
	static IsPlaying = () => {
		return !VideoPlayer.video.paused;
	};
	static Play = () => {
		VideoPlayer.video.play();
	};
	static Pause = () => {
		VideoPlayer.video.pause();
	};
	static Toggle = () => {
		VideoPlayer.IsPlaying() ? VideoPlayer.Pause() : VideoPlayer.Play();
	};
	static SetVideo = (video, downloaded) => {
		VideoPlayer.video.src = "";

		if (downloaded)
			return new Promise((resolve) => {
				VideoPlayer.UpdateMediaSession(video);
				VideoPlayer.video.src = video.url;
				resolve();
			});

		//@ts-ignore
		return app.GetEpisodeVideo(video.url).then((url) => {
			//@ts-ignore
			VideoPlayer.video.src = url;

			VideoPlayer.UpdateMediaSession(video);

			return;
		});
	};

	static UpdateMediaSession = (video) => {
		// @ts-ignore
		navigator.mediaSession.metadata = new MediaMetadata({
			title: video.name,
			artist: `Season ${video?.season} Episode ${video?.episode}`,
		});

		// @ts-ignore
		navigator.mediaSession.setActionHandler("play", VideoPlayer.Play);
		// @ts-ignore
		navigator.mediaSession.setActionHandler("pause", VideoPlayer.Toggle);
		// @ts-ignore
		navigator.mediaSession.setActionHandler(
			"previoustrack",
			VideoQueue.LastVideo
		);
		// @ts-ignore
		navigator.mediaSession.setActionHandler(
			"nexttrack",
			VideoQueue.NextVideo
		);
	};
}

VideoPlayer.video.addEventListener("ended", () => {
	VideoQueue.NextVideo();
});

VideoPlayer.video.addEventListener("click", () => {
	VideoPlayer.Toggle();
});