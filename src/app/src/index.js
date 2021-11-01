(async function () {
	//temporary for testing
	//Loader.Hide();

	//VideoPlayer.Hide();

	Tooltip.init();

	//get daily featured anime
	let anime = await Wcofun.GetFeatured();
	//get featured element
	let featured = document.querySelector("#featured");

	//set featured element data
	featured.querySelector("img").src = anime.Image;
	featured.querySelector(".text .title").innerText = anime.Name;
	featured.querySelector(".text .description").innerText = anime.Description;

	featured.addEventListener("click", () => {
		ShowPage.ShowAnime(anime);
	});

	let sidebar = document.getElementById("side-bar");

	sidebar.querySelector(".fa-home").addEventListener("click", () => {
		Searchbar.Hide();
	});

	VideoPlayer.init(document.getElementById("video-player"));
	Searchbar.init(document.getElementById("search-page"), sidebar.querySelector(".fa-search"));

	//get recently added episodes
	let recent = await Wcofun.GetRecentReleases();

	//get template element and parent
	let shows = document.querySelector("#recent-releases");
	let template = document.querySelector("#recent-releases .show:first-child");

	//array for saving show elements
	let elements = [];

	for (let episode of recent) {
		//clone template for each show
		let show = template.cloneNode(true);

		//set image and text to temporary loading text
		show.children[0].src = "./images/loading.gif";
		show.children[1].children[0].innerText = "Loading...";
		show.children[1].children[1].innerText = "Loading...";

		//parent to #shows
		shows.appendChild(show);
		//save to elements array
		elements.push(show);
	}

	//hide show episode selector
	ShowPage.ShowInfoElement.style.display = "none";

	await WatchHistory.CreateWatchedList();

	//hide loading screen
	Loader.Hide();

	let i = 0;

	for (let episode of recent) {
		let show = elements[i];

		episode
			.GetAnime()
			.then((recent) => {
				show.children[0].src = recent.Image;
				show.children[1].children[0].innerText = episode.Name;
				show.children[1].children[1].innerText = recent.Description;
				show.classList.remove("loading");

				//add event listener for viewing
				show.addEventListener("click", () => {
					console.log("Showing anime");
					ShowPage.ShowAnime(recent);
				});
			})
			.catch(() => {
				show.classList.add("broken");
			});

		i++;
	}
})(window);
