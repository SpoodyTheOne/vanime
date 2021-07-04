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
		let classes = PlayPauseButton.classList;
		classes.add("fa-pause");
		classes.remove("fa-play");
		ControlsElement.classList.remove("hidden");
	};
	static Pause = () => {
		VideoPlayer.video.pause();
		let classes = PlayPauseButton.classList;
		classes.remove("fa-pause");
		classes.add("fa-play");
	};
	static Toggle = () => {
		VideoPlayer.IsPlaying() ? VideoPlayer.Pause() : VideoPlayer.Play();
	};
	static SetVideo = (video, downloaded) => {
		VideoPlayer.video.src = "";

		VideoNameSpan.innerHTML = "Loading video...";

		if (downloaded)
			return new Promise((resolve) => {
				VideoPlayer.UpdateMediaSession(video);
				VideoPlayer.video.src = video.url;
				VideoNameSpan.innerText = video.GetName();
				VideoSeasonSpan.innerText = video?.season;
				VideoEpisodeSpan.innerText = video?.episode;
				resolve();
			});

		//@ts-ignore
		return app.GetEpisodeVideo(video.url).then((url) => {
			//@ts-ignore
			VideoPlayer.video.src = url;

			VideoPlayer.UpdateMediaSession(video);

			VideoNameSpan.innerText = video.GetName();
			VideoSeasonSpan.innerText = video?.season;
			VideoEpisodeSpan.innerText = video?.episode;

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

	static SeekTo = (time) => {
		VideoPlayer.video.currentTime = time;
	};

	static Seek = (time) => {
		VideoPlayer.video.currentTime += time;
	};

	static ToggleFullscreen = () => {
		if (document.fullscreenElement) {
			document.exitFullscreen();
		} else {
			document.documentElement.requestFullscreen();
			titleBar.classList.add("hidden");
		}
	};

	static Muted = false;
	static Volume = 1;
	static LastInputTimestamp = 0;

	static ToggleMute = () => {
		if (!VideoPlayer.Muted) {
			VideoPlayer.video.volume = 0;
			MuteButton.classList.remove("fa-volume-up");
			MuteButton.classList.add("fa-volume-mute");
		} else {
			VideoPlayer.video.volume = VideoPlayer.Volume;
			MuteButton.classList.add("fa-volume-up");
			MuteButton.classList.remove("fa-volume-mute");
		}
		VideoPlayer.Muted = !VideoPlayer.Muted;
	};
}

VideoPlayer.video.addEventListener("ended", () => {
	VideoQueue.NextVideo();
});

VideoPlayer.video.addEventListener("click", () => {
	VideoPlayer.Toggle();
});

VideoPlayer.video.addEventListener("durationchange", () => {
	progress.max = VideoPlayer.video.duration.toString();
});

/** @type {HTMLInputElement} */
// @ts-ignore
let progress = document.getElementById("video-progress");
let ControlsElement = document.getElementById("controls");
let PlayPauseButton = document.querySelector("#controls .buttons i.fa-play");
let MuteButton = document.querySelector("#controls .buttons i.fa-volume-up");
/** @type {HTMLSpanElement} */
let VideoNameSpan = document.querySelector("#controls .name span.name");
/** @type {HTMLSpanElement} */
let VideoSeasonSpan = document.querySelector(
	"#controls .name span.episode .season"
);
/** @type {HTMLSpanElement} */
let VideoEpisodeSpan = document.querySelector(
	"#controls .name span.episode .episode"
);

progress.addEventListener("mouseenter", () => {
	// @ts-ignore
	progress.seeking = true;
});

progress.addEventListener("mouseleave", () => {
	// @ts-ignore
	progress.seeking = false;
});

progress.addEventListener("change", () => {
	VideoPlayer.SeekTo(parseInt(progress.value));
});

progress.addEventListener("keydown", (event) => {
	event.preventDefault();
	KeyHandler({ key: event.key, target: { tagName: "" } });
});

VideoPlayer.video.addEventListener("timeupdate", () => {
	//@ts-ignore
	if (!progress.seeking)
		progress.value = VideoPlayer.video.currentTime.toString();

	if (VideoPlayer.video.currentTime > VideoPlayer.LastInputTimestamp + 2) {
		ControlsElement.classList.add("hidden");
	}
});

VideoPlayer.video.addEventListener("mousemove", () => {
	ControlsElement.classList.remove("hidden");
	VideoPlayer.LastInputTimestamp = VideoPlayer.video.currentTime;
});
