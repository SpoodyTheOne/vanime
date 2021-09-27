(async function () {
	//get daily featured anime
	let anime = await Wcofun.GetFeatured();
	//get featured element
	let featured = document.querySelector("#featured");

	//set featured element data
	featured.querySelector("img").src = anime.Image;
	featured.querySelector(".text .title").innerText = anime.Name;
	featured.querySelector(".text .description").innerText = anime.Description;

	//get recently added episodes
	let recent = await Wcofun.GetRecentReleases();

	//get template element and parent
	let shows = document.querySelector("#shows");
	let template = document.querySelector("#shows .show:first-child");

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

	//hide loading screen
	Loader.Hide();

	let i = 0;

	for (let episode of recent) {
		let show = elements[i];

		let recent = await episode.GetAnime();

		show.children[0].src = recent.Image;
		show.children[1].children[0].innerText = recent.Name;
		show.children[1].children[1].innerText = recent.Description;

		//add event listener for viewing
		show.addEventListener("click", () => {
			alert("View show " + recent.Url);
		});

		i++;
	}
})(window);
