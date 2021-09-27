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
}
