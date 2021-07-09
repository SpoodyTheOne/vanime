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

		this.GetTimestamp = () => {
			// @ts-check
			return app.GetTimestamp(
				{ name: this.anime.name },
				this.season,
				this.episode
			);
		};

		this.SetTimestamp = (time) => {
			// @ts-check
			return app.SetTimestamp(
				{ name: this.anime.name },
				this.season,
				this.episode,
				time
			);
		};
	}
	
	play(downloaded) {
		super.play(downloaded);
		//@ts-ignore
		app.SetWatched(
			{ name: this.anime.name },
			this.season,
			this.episode,
			true
		);
	};
}
