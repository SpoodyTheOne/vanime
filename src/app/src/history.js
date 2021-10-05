class WatchHistory {
	static async GetWatched() {
		let data = await window.API.GetWatched();
		let returnData = [];
		for (let index of Object.keys(data)) {
			let raw = data[index];

			let anime = new Anime(raw.Url);
			anime.Name = raw.Name;
			let seasons = await anime.GetSeasons();

			let episode = seasons[raw.Season].Episodes[raw.Episode];
			episode.Anime = anime;

			returnData.push({ Episode: episode, Time: raw.Time });
		}

		return returnData;
	}

	/**
	 * Save the progress of this episode
	 * @param {Episode} Episode
	 */
	static async SetWatched(Episode, Time = 0) {
		return window.API.SetWatched(
			Episode.Anime.Name,
			Episode.Anime.Url,
			Episode.Season.SeasonIndex,
			Episode.EpisodeIndex,
			Time
		);
	}

	/**
	 * Get the saved time for this episode
	 * @param {Episode} Episode
	 */
	static async GetTime(Episode) {
		return await window.API.GetTime(Episode.Anime.Name, Episode.Season.SeasonIndex, Episode.EpisodeIndex);
	}

	/**
	 * Gets the episode of this anime the user has reached, aswell as the timestamp
	 * @param {Anime} Anime
	 */
	static async GetEpisode(anime) {
		let raw = await window.API.HistoryGetEpisode(anime.Name);

		let am = new Anime(raw.Url);
		am.Name = raw.Name;
		let seasons = await am.GetSeasons();

		let episode = seasons[raw.Season].Episodes[raw.Episode];
		episode.Anime = am;

		return episode;
	}
}
