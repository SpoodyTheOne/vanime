"use strict";

class Anime {
	/**
	 * Takes an array of episodes and returns a `Season[]` object
	 * @param {Episode[]} Episodes
	 */
	static SortEpisodesToSeasons(Anime, Episodes) {
		let Seasons = [];
		let CurrentSeason = new Season(Anime);
		let CurrentSeasonIndex = "1";

		Episodes.reverse();

		for (const episode of Episodes) {
			//check if new season
			try {
				let _season = episode.Name.match(/season [1-9]+/gi)[0].substring(7);

				if (CurrentSeasonIndex !== _season) {
					//console.log("New season " + CurrentSeasonIndex);
					//new season
					Seasons.push(CurrentSeason);
					CurrentSeason = new Season(Anime);
					CurrentSeasonIndex = _season;
				}
			} catch (e) {
				//name didnt include a season,
				//assume first season and do nothing
			}

			episode.Season = CurrentSeason;
			CurrentSeason.Episodes.push(episode);
		}

		Seasons.push(CurrentSeason);

		return Seasons;
	}

	constructor(Url) {
		/** @type {String} */
		this.Name = "";
		/** @type {String} */
		this.Image = "";
		/** @type {String} */
		this.Url = Url ?? "";
		/** @type {String} */
		this.Description = "";

		/** @type {Season[]} */
		this._seasons = null;

		/** @returns {Promise<Season[]>} */
		this.GetSeasons = () => {
			return new Promise((resolve, reject) => {
				if (this._seasons) resolve(this._seasons);

				return Wcofun.GetEpisodes(this).then((episodes) => {
					this._seasons = Anime.SortEpisodesToSeasons(this, episodes);
					resolve(this._seasons);
				});
			});
		};

		this.GetImage = () => {
			if (this.Image)
				return new Promise((resolve) => {
					resolve(this.Image);
				});

			return Wcofun.Instance.GetImage(this).then((src) => {
				this.Image = src;
				return src;
			});
		};

		this.GetDescription = () => {
			if (this.Description)
				return new Promise((resolve) => {
					resolve(this.Description);
				});

			return Wcofun.GetDescription(this);
		};
	}
}

class Season {
	/**
	 * Creates a new Season for Episodes
	 * @param {Anime} Anime
	 */
	constructor(Anime) {
		/** @type {Episode[]} */
		this.Episodes = [];

		/** @type {Anime} */
		this.Anime = Anime ?? null;
	}
}

class Episode {
	constructor(Name, Anime, Season, PageUrl) {
		/**
		 * @type {String}
		 * The name of this episode
		 */
		this.Name = Name ?? "";

		/**
		 * @type {Anime}
		 * The anime this episode comes from
		 */
		this.Anime = Anime ?? null;

		/**
		 * @type {Season}
		 * The season this episode is in
		 */
		this.Season = Season ?? null;

		/**
		 * @type {String}
		 * The url of the wcofun.com page this episode is on
		 */
		this.PageUrl = PageUrl ?? "";

		/**
		 * Gets the anime this episode is from
		 * @returns {Promise<Anime>}
		 */
		this.GetAnime = () => {
			if (this.Anime)
				return new Promise((resolve) => {
					resolve(this.Anime);
				});

			return Wcofun.EpisodeGetAnime(this);
		};
	}

	/**
	 * @type {Promise<String>}
	 * The url of the video for this episode
	 */
	get EpisodeUrl() {
		return Wcofun.Instance.GetEpisodeUrl(this.PageUrl);
	}
}
