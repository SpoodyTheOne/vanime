class VideoPlayer {
	/** @type {HTMLDivElement} */
	static Container;
	/** @type {HTMLVideoElement} */
	static VideoElement;

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
	 * Initialize videoplayer with the parent element of the video element
	 * @param {HTMLDivElement} element
	 */
	static init = (element) => {
		this.Container = element;
		this.VideoElement = element.querySelector("video");

		this.Container.style.display = "none";
	};

	static Show = () => {
		if (this.Container.style.display == "block") return;

		Loader.Show();

		setTimeout(() => {
			this.Container.style.display = "block";
		}, 500);
	};

	/**
	 * Plays this episode of the anime
	 * @param {Episode} episode
	 */
	static PlayEpisode = async (episode) => {
		this.Show();
		this.CurrentlyPlaying = episode;
		this.CurrentAnime = await episode.GetAnime();

		this.VideoElement.src = await episode.EpisodeUrl;

		this.VideoElement.play();

		Loader.Hide();
	};
}
