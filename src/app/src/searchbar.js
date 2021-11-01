class Searchbar {
	/** @type {HTMLInputElement} */
	static SearchElement;

	/** @type {HTMLDivElement} */
	static ListElement;

	/** @type {Anime[]} */
	static SearchedAnime = [];

	/** @type {HTMLInputElement} */
	static InputElement;

	/** @type {Anime} */
	static CurrentlyShownAnime = null;

	/** @type {HTMLDivElement} */
	static TooltipElement;

	/**
	 * Initializes the searchbar with an input element
	 * @param {HTMLDivElement} page
	 */
	static init = (page, button) => {
		this.SearchElement = page;
		this.ListElement = this.SearchElement.querySelector(".list");
		this.InputElement = this.SearchElement.querySelector(".info .search-box");
		this.TooltipElement = this.SearchElement.querySelector(".tooltip");

		this.Hide();

		button.addEventListener("click", () => {
			this.Show();
		});

		this.InputElement.addEventListener("keydown", (event) => {
			if (event.key == "Enter") {
				this.Search(this.InputElement.value);
				this.InputElement.blur();
			}
		});

		//this.Hide();
	};

	/**
	 * Shows the search page
	 */
	static Show = () => {
		this.SearchElement.style.display = "flex";
		setTimeout(() => {
			this.SearchElement.classList.remove("hidden");
		}, 1);
		this.InputElement.focus();
	};

	/**
	 * Hides the search page
	 */
	static Hide = () => {
		this.SearchElement.classList.add("hidden");
		setTimeout(() => {
			this.SearchElement.style.display = "none";
		}, 500);
	};

	/**
	 * Searches for this string and displays the anime' in the list
	 * @param {String} string
	 */
	static Search = async (string) => {
		//clear list
		this.ListElement.innerHTML = "Loading...";
		this.SearchedAnime = [];

		Wcofun.Search(string).then((data) => {
			this.SearchedAnime = data;

			this.ListElement.innerHTML = "";

			for (let anime of this.SearchedAnime) {
				let image = document.createElement("img");
				image.classList.add("searched-show");
				image.src = anime.Image;
				image.onclick = () => {
					//if (this.CurrentlyShownAnime == anime)
					ShowPage.ShowAnime(anime);
					//else this.ShowInfo(anime);
				};
				image.onmousemove = (event) => {
					Tooltip.ShowTooltip(event, anime.Name);
				};
				image.onmouseleave = () => {
					Tooltip.HideTooltip();
				};
				this.ListElement.appendChild(image);
			}
		});
	};

	/**
	 * Shows this anime in the info field
	 * @param {Anime} anime
	 */
	static ShowInfo = async (anime) => {
		for (let element of this.ListElement.querySelectorAll(".searched-show")) {
			element.classList.remove("active");
		}

		this.CurrentlyShownAnime = anime;

		let title = this.SearchElement.querySelector(".info h1");
		let img = this.SearchElement.querySelector(".info img");
		let pre = this.SearchElement.querySelector(".info pre");

		pre.innerText = "Loading...";
		img.src = "";
		title.innerText = "";

		let name = anime.Name;
		title.innerText = name;
		let image = await anime.GetImage();
		img.src = image;
		let desc = await anime.GetDescription();
		if (this.CurrentlyShownAnime == anime) pre.innerText = desc;
	};
}
