class AnimeVideo extends Video {
	constructor(name, url, episode, season, ova, movie) {
		super(name, url);

		this.episode = episode;
		this.season = season;
		this.ova = ova;
		this.movie = movie;
		/** @type {Anime} */
		this.anime = null;

		this.download = () => {
			//return promise that resolves
			//to a instance of a DownloadedVideo

			return download(this);
		};
	}
}
