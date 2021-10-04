class Wcofun {
	/**
	 * Get the episodes of this anime
	 * @param {Anime} Anime
	 * @returns {Promise<Episode>}
	 */
	static GetEpisodes = (Anime) => {
		return window.API.GetEpisodes(Anime.Url).then((data) => {
			return data.map((x) => {
				return new Episode(x.name, Anime, null, x.url);
			});
		});
	};

	/**
	 * 
	 * @param {Anime} Anime 
	 * @returns 
	 */
	static GetImage = async (Anime) => {
		return window.API.GetImage(Anime.Url);
	}

	/**
	 * Gets the daily featured anime
	 * @returns {Promise<Anime>}
	 */
	static GetFeatured = () => {
		return window.API.GetFeatured().then((data) => {
			let anime = new Anime(data.url);
			anime.Image = data.image;
			anime.Description = data.description;
			anime.Name = data.name;
			return anime;
		});
	};

	/**
	 * Gets the recent releases
	 * @returns {Promise<Episode[]>}
	 */
	static GetRecentReleases = () => {
		return window.API.GetRecentReleases().then((data) => {
			return data.map((x) => {
				return new Episode(x.name, null, null, x.url);
			});
		});
	};

	/**
	 * Gets the anime this episode is from
	 * @param {Episode} Episode
	 */
	static EpisodeGetAnime = (Episode) => {
		return window.API.EpisodeGetAnime(Episode.PageUrl).then((data) => {
			let anime = new Anime(data.url);
			anime.Name = data.name;
			anime.Description = data.description;
			anime.Url = data.url;
			anime.Image = data.image;

			return anime;
		});
	};

	/**
	 * Search for anime
	 * @param {String} string
	 */
	static Search = async (string) => {
		let data = await window.API.Search(string);

		return data.map((x) => {
			let anime = new Anime(x.url);
			anime.Name = x.name;
			anime.Image = x.image;
			return anime;
		});
	};

	/**
	 * Gets the description of this anime
	 * @param {Anime} anime 
	 * @returns {Promise<String>}
	 */
	static GetDescription = async (anime) => {
		return window.API.GetDescription(anime.Url);
	}

	/**
	 * Gets the video url of this episode
	 * @param {Episode} episode
	 */
	static GetEpisodeUrl = (episode) => {
		return window.API.GetEpisodeUrl(episode.PageUrl);
	};
}
