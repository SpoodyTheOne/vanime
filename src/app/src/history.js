class WatchHistory {
	static async GetWatched() {
		let data = await window.API.GetWatched();
		let returnData = [];

		let datas = Object.keys(data);

		datas = datas.map((x) => {
			return data[x];
		});

		datas.sort((a, b) => {
			return b.LastWatched - a.LastWatched;
		});

		for (let raw of datas) {
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

	/**
	 * Remove this anime from the history
	 * if not in history does nothing
	 * @param {Anime} anime
	 */
	static async Remove(anime) {
		return window.API.HistoryRemove(anime.Name);
	}

	/**
	 * Creates the show HTML elements
	 */
	static async CreateWatchedList() {
		let watched = document.querySelector("#history");
		let template = document.querySelector("#recent-releases .show:first-child");

		//clear watch list
		watched.innerHTML = "";

		let history = await this.GetWatched();
		let historyElements = [];

		for (let data of history) {
			/** @type {HTMLDivElement} */
			let show = template.cloneNode(true);

			show.children[0].src = "./images/loading.gif";
			show.children[1].children[0].innerText = "Loading...";
			show.children[1].children[1].innerText = "Loading...";

			show.classList.remove("loading");

			//add event listener for viewing
			//plays the latest episode this user watched
			//of this anime
			show.addEventListener("click", async () => {
				console.log("Showing anime");
				Loader.Show();
				let anime = await data.Episode.GetAnime();
				let episode = await WatchHistory.GetEpisode(anime);
				VideoPlayer.PlayEpisode(episode);
				Loader.Hide();
			});

			show.addEventListener("contextmenu", (event) => {
				event.preventDefault();
				Tooltip.CreateContextMenu(
					event,
					data.Episode.Anime.Name,
					new TooltipButton("Favourite", () => {}),
					new TooltipButton("Remove from history", () => {
						Tooltip.CreateContextMenu(
							event,
							"Remove from History?",
							new TooltipButton("Yes", () => {
								show.remove();
								WatchHistory.Remove(data.Episode.Anime);
							}),
							new TooltipButton("No", () => {})
						);
					})
				);
			});

			//parent to #shows
			watched.appendChild(show);
			//save to elements array
			historyElements.push(show);
		}

		setTimeout(async () => {
			let k = 0;

			for (let data of history) {
				let show = historyElements[k];

				let recent = data.Episode.Anime;
				show.children[0].src = await recent.GetImage();
				show.children[1].children[0].innerText = recent.Name;
				show.children[1].children[1].innerText = await recent.GetDescription();

				k++;
			}
		}, 1);
	}
}
