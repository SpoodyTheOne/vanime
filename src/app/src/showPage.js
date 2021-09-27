class ShowPage {
	/** @type {HTMLDivElement} */
	static ShowInfoElement = document.getElementById("show-info");
	/** @type {HTMLDivElement} */
	static ShowInfoImage = this.ShowInfoElement.querySelector(".image");
	static ShowInfoTitle = this.ShowInfoImage.querySelector("h1");
	static ShowInfoDescription = this.ShowInfoImage.querySelector("pre");
	static ShowInfoSeasonSelector = this.ShowInfoElement.querySelector("select");
	static ShowInfoEpisodeList = this.ShowInfoElement.querySelector(".episodes");

	static BackButton = this.ShowInfoElement.querySelector(".image button");

	/**
	 * Shows the episode selector for this anime
	 * @param {Anime} Anime
	 */
	static ShowAnime = async (Anime) => {
		Loader.Show();
		this.ShowInfoTitle.innerText = Anime.Name;
		this.ShowInfoDescription.innerText = await Anime.GetDescription();
		this.ShowInfoImage.style.backgroundImage = `url("${await Anime.GetImage()}")`;

		this.ShowInfoSeasonSelector.innerHTML = "";

		this.BackButton.onclick = this.ShowClose;

		this.ShowInfoSeasonSelector.onchange = async () => {
			let seasons = await Anime.GetSeasons();

			let index = Number(this.ShowInfoSeasonSelector.value);

			this.ShowSeason(seasons[index]);
		};

		let i = 0;

		for (let season of await Anime.GetSeasons()) {
			let option = document.createElement("option");
			option.value = i;
			option.innerText = `Season ${i + 1}`;

			this.ShowInfoSeasonSelector.appendChild(option);

			i++;
		}

		this.ShowSeason((await Anime.GetSeasons())[0]);

		this.ShowInfoElement.style.display = "block";
		setTimeout(() => {
			this.ShowInfoElement.classList.remove("hidden");
		}, 1);

		Loader.Hide();
	};

	/**
	 * Show this seasons episodes
	 * @param {Season} season
	 */
	static ShowSeason = (season) => {
		//clear previous episodes
		this.ShowInfoEpisodeList.innerHTML = "";

		for (let episode of season.Episodes) {
			let element = document.createElement("li");

			element.classList.add("episode");
			element.innerText = episode.Name;

			element.onclick = async () => {
				VideoPlayer.PlayEpisode(episode);
                
			};

			this.ShowInfoEpisodeList.appendChild(element);
		}
	};

	/**
	 * Close the episode selector
	 */
	static ShowClose = () => {
		this.ShowInfoElement.classList.add("hidden");
		setTimeout(() => {
			this.ShowInfoElement.style.display = "none";
		}, 500);
	};
}
