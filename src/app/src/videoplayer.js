class VideoPlayer {
	/** @type {HTMLDivElement} */
	static Container;
	/** @type {HTMLVideoElement} */
	static VideoElement;
	/** @type {HTMLDivElement} */
	static ControlsElement;
	/** @type {HTMLDivElement} */
	static InfoElement;
	/** @type {HTMLButtonElement} */
	static BackButton;
	/** @type {HTMLDivElement} */
	static ProgressContainer;
	/** @type {HTMLDivElement} */
	static ProgressBar;
	/** @type {HTMLDivElement} */
	static ProgressBuffer;
	/** @type {HTMLHeadingElement} */
	static TimeInfo;
	/** @type {HTMLLIElement} */
	static PlaybackButton;

	static _HideInfoTimeout = null;

	/**
	 * The episode that is currently playing
	 * @type {Episode}
	 */
	static CurrentlyPlaying;
	/**
	 * The anime that the episode currently playing belongs to
	 * @type {Anime}
	 */
	static CurrentAnime;

	/**
	 * Is the video player waiting for data
	 */
	static IsWaiting = true;

	/**
	 * The last time the mouse was moved, or keyboard pressed etc.
	 * used for showing the show info;
	 */
	static LastInteraction = 0;

	/**
	 * Initialize videoplayer with the parent element of the video element
	 * @param {HTMLDivElement} element
	 */
	static init = (element) => {
		this.Container = element;
		this.VideoElement = element.querySelector("#video-element");
		this.ControlsElement = element.querySelector("#video-controls");
		this.InfoElement = element.querySelector("#video-info");
		this.BackButton = this.Container.querySelector("button");

		//this.Container.style.display = "none";
		this.Show();
		this.HideInfo();
		this.LastInteraction = performance.now();

		this.BackButton.addEventListener("click", () => {
			this.Hide();
		});

		this.VideoElement.addEventListener("click", () => {
			if (this.Visible) {
				this.TogglePlayback();
			}
		});

		this.InfoElement.addEventListener("click", (event) => {
			if (this.Visible && event.target != this.BackButton) {
				this.TogglePlayback();
			}
		});

		window.addEventListener("keydown", (event) => {
			if (this.Visible) {
				switch (event.key) {
					case " ":
						this.TogglePlayback();
						break;
				}
			}
		});

		this.ControlsElement.querySelector(".fullscreen-btn").addEventListener("click", (event) => {
			if (document.fullscreenElement) {
				document.exitFullscreen();
				event.target.classList.remove("fa-compress");
				event.target.classList.add("fa-expand");
			} else {
				this.Container.requestFullscreen();
				event.target.classList.remove("fa-expand");
				event.target.classList.add("fa-compress");
			}
		});

		this.PlaybackButton = this.ControlsElement.querySelector(".buttons .toggle-playback-btn");

		this.PlaybackButton.addEventListener("click", () => {
			this.TogglePlayback();
		});

		this.ControlsElement.querySelector(".buttons .fast-forward-btn").addEventListener("click", async () => {
			await PlayNextEpisode();
		});

		this.Container.addEventListener("mousemove", () => {
			this.LastInteraction = performance.now();

			if (this.InfoElement.style.display !== "none") {
				this.HideInfo();
			}

			if (this.Playing) {
				this.ShowControls();
			}
		});

		//check if the last interaction was more than 5 seconds ago
		//if so, show #video-info
		setInterval(() => {
			if (!this.IsWaiting && this.LastInteraction + 5000 < performance.now() && !this.Playing) {
				this.ShowInfo();
			} else if (!this.IsWaiting && this.LastInteraction + 3000 < performance.now() && this.Playing) {
				this.HideControls();
			}
		}, 1000);

		this.VideoElement.addEventListener("waiting", () => {
			this.IsWaiting = true;
			this.Container.querySelector(".loader").classList.remove("hidden");
		});

		this.VideoElement.addEventListener("playing", () => {
			this.IsWaiting = false;
			this.Container.querySelector(".loader").classList.add("hidden");
		});

		this.InitProgressBar();
	};

	/**
	 * Initialize progress bar and events
	 */
	static InitProgressBar = () => {
		this.ProgressContainer = this.Container.querySelector("#video-controls .progress-container");
		this.ProgressBar = this.ProgressContainer.querySelector(".progress");
		this.ProgressBuffer = this.ProgressContainer.querySelector(".buffered");

		this.TimeInfo = this.Container.querySelector("#video-controls .info h2");

		this.VideoElement.addEventListener("progress", () => {
			for (var i = 0; i < this.VideoElement.buffered.length; i++) {
				if (
					this.VideoElement.buffered.start(this.VideoElement.buffered.length - 1 - i) <=
					this.VideoElement.currentTime
				) {
					this.ProgressBuffer.style.width =
						(this.VideoElement.buffered.end(this.VideoElement.buffered.length - 1 - i) /
							this.VideoElement.duration) *
							100 +
						"%";
					break;
				}
			}
		});

		this.VideoElement.addEventListener("timeupdate", () => {
			this.ProgressBar.style.width = (this.VideoElement.currentTime / this.VideoElement.duration) * 100 + "%";
			this.TimeInfo.innerText =
				this.FormatTime(this.VideoElement.currentTime) + " / " + this.FormatTime(this.VideoElement.duration);
		});

		this.ProgressContainer.addEventListener("mousemove", (event) => {
			let offset = this.ProgressContainer.offsetWidth;
			let pos = this.ProgressContainer.offsetLeft;

			let mpos = event.clientX - pos;

			let percent = mpos / offset;

			Tooltip.ShowTooltip(event, this.FormatTime(this.VideoElement.duration * percent));
		});

		this.ProgressContainer.addEventListener("click", (event) => {
			let offset = this.ProgressContainer.offsetWidth;
			let pos = this.ProgressContainer.offsetLeft;

			let mpos = event.clientX - pos;

			let percent = mpos / offset;

			this.VideoElement.currentTime = this.VideoElement.duration * percent;
		});

		this.ProgressContainer.addEventListener("mouseleave", () => {
			Tooltip.HideTooltip();
		});
	};

	static UpdateMediaSession = () => {
		navigator.mediaSession.metadata = new MediaMetadata({
			title: this.CurrentAnime.Name,
			artist: `Season ${this.CurrentlyPlaying.Season.SeasonIndex + 1} Episode ${
				this.CurrentlyPlaying.EpisodeIndex + 1
			}`,
		});

		navigator.mediaSession.playbackState = "playing";

		// @ts-ignore
		navigator.mediaSession.setActionHandler("play", VideoPlayer.Play);
		// @ts-ignore
		navigator.mediaSession.setActionHandler("pause", VideoPlayer.TogglePlayback);

		navigator.mediaSession.setActionHandler("nexttrack", VideoPlayer.PlayNextEpisode);
	};

	static PlayNextEpisode = async () => {
		if (this.IsWaiting) return;

		this.IsWaiting = true;
		this.Container.querySelector(".loader").classList.remove("hidden");

		this.VideoElement.pause();

		let nextEpisode = await this.CurrentlyPlaying.GetNextEpisode();
		if (nextEpisode == null) {
			return this.Hide();
		}
		this.PlayEpisode(nextEpisode);
	};

	/**
	 * Show the video player
	 */
	static Show = () => {
		if (this.Container.style.display == "block") return;

		Loader.Show();

		setTimeout(() => {
			this.Container.classList.remove("hidden");
			this.Container.style.display = "block";
		}, 500);
	};

	/**
	 * hide video player
	 */
	static Hide = () => {
		this.Pause();

		this.Container.classList.add("hidden");
		setTimeout(() => {
			this.Container.style.display = "none";
		}, 500);
	};

	/**
	 * Hides the anime info
	 */
	static HideInfo = () => {
		this.InfoElement.classList.add("hidden");
		if (this._HideInfoTimeout) clearTimeout(this._HideInfoTimeout);

		this._HideInfoTimeout = setTimeout(() => {
			this.InfoElement.style.display = "none";
		}, 500);
	};

	/**
	 * Shows the anime title and description
	 */
	static ShowInfo = () => {
		this.InfoElement.style.display = "block";

		if (this._HideInfoTimeout) clearTimeout(this._HideInfoTimeout);

		this._HideInfoTimeout = setTimeout(() => {
			this.InfoElement.classList.remove("hidden");
		}, 1);
	};

	/**
	 * Shows the video controls
	 */
	static ShowControls = () => {
		this.ControlsElement.classList.remove("hidden");
		this.Container.style.cursor = "inherit";
	};

	/**
	 *  Hides the video controls
	 */
	static HideControls = () => {
		this.ControlsElement.classList.add("hidden");
		this.Container.style.cursor = "none";
	};

	/**
	 * Plays this episode of the anime
	 * @param {Episode} episode
	 */
	static PlayEpisode = async (episode) => {
		this.Show();
		this.CurrentlyPlaying = episode;

		this.LastInteraction = performance.now();

		//load episode url first, the other stuff is for details
		this.VideoElement.src = await episode.EpisodeUrl;

		//get the anime this episode is from,
		//used for getting the next or previous episode
		//aswell as description
		this.CurrentAnime = await episode.GetAnime();

		//set the info title to the name of the episode
		this.InfoElement.querySelector(".episode-name").innerText = this.CurrentlyPlaying.Name;
		//set the description of the info to the description of the anime
		this.InfoElement.querySelector(".anime-description").innerText = await this.CurrentAnime.GetDescription();

		this.HideInfo();

		if (this.Visible)
			//play the video
			this.VideoElement.play();

		//hide back button
		this.BackButton.style.display = "none";

		this.ShowControls();

		this.UpdateMediaSession();

		//hide the loader
		Loader.Hide();
	};

	/**
	 * Pauses the video
	 */
	static Pause = () => {
		//this.ShowInfo();
		this.VideoElement.pause();

		//show back button
		this.BackButton.style.display = "block";

		this.PlaybackButton.classList.remove("fa-pause");
		this.PlaybackButton.classList.add("fa-play");

		this.ShowControls();
	};

	/**
	 * Plays the video
	 */
	static Play = () => {
		this.HideInfo();
		this.VideoElement.play();

		//hide back button
		this.BackButton.style.display = "none";

		this.PlaybackButton.classList.remove("fa-play");
		this.PlaybackButton.classList.add("fa-pause");
	};

	/**
	 * Plays/Pauses the video depending on its current state
	 */
	static TogglePlayback = () => {
		this.Playing ? this.Pause() : this.Play();
	};

	/**
	 * Gets the playstate of the video
	 */
	static get Playing() {
		return !this.VideoElement.paused;
	}

	static get Visible() {
		return this.Container.style.display == "block";
	}

	static FormatTime = (seconds) => {
		let formatSeconds = Math.floor(seconds % 60);
		let formatMinutes = Math.floor(seconds - formatSeconds) / 60;
		let formatHours = Math.floor(formatMinutes / 60);

		formatMinutes = formatMinutes % 60;

		return `${formatHours > 0 ? formatHours.toString().padStart(2, "0") + ":" : ""}${formatMinutes
			.toString()
			.padStart(2, "0")}:${formatSeconds.toString().padStart(2, "0")}`;
	};
}
