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
		this.BackButton = this.InfoElement.querySelector("button");

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

		this.Container.addEventListener("mousemove", () => {
			this.LastInteraction = performance.now();

			if (this.InfoElement.style.display !== "none") {
				this.HideInfo();
			}
		});

		//check if the last interaction was more than 5 seconds ago
		//if so, show #video-info
		setInterval(() => {
			if (this.LastInteraction + 5000 < performance.now() && !this.Playing) {
				this.ShowInfo();
			}
		}, 1000);
	};

	static Show = () => {
		if (this.Container.style.display == "block") return;

		Loader.Show();

		setTimeout(() => {
			this.Container.classList.remove("hidden");
			this.Container.style.display = "block";
		}, 500);
	};

	static Hide = () => {
		this.Pause();

		this.Container.classList.add("hidden");
		setTimeout(() => {
			this.Container.style.display = "none";
		}, 500);
	};

	static HideInfo = () => {
		this.InfoElement.classList.add("hidden");
		if (this._HideInfoTimeout) clearTimeout(this._HideInfoTimeout);

		this._HideInfoTimeout = setTimeout(() => {
			this.InfoElement.style.display = "none";
		}, 500);
	};

	static ShowInfo = () => {
		this.InfoElement.style.display = "block";

		if (this._HideInfoTimeout) clearTimeout(this._HideInfoTimeout);

		this._HideInfoTimeout = setTimeout(() => {
			this.InfoElement.classList.remove("hidden");
		}, 1);
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

		//play the video
		this.VideoElement.play();

		//hide the loader
		Loader.Hide();
	};

	/**
	 * Pauses the video
	 */
	static Pause = () => {
		//this.ShowInfo();
		this.VideoElement.pause();
	};

	/**
	 * Plays the video
	 */
	static Play = () => {
		this.HideInfo();
		this.VideoElement.play();
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
}
