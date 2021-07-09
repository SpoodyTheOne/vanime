//@ts-check
/** @type {HTMLCanvasElement} */
// @ts-ignore
const canvas = document.getElementById("searchCanvas");
const ctx = canvas.getContext("2d");

const searchBox = document.getElementById("searchbox");

let Searching = false;
let tab = "Search";

let DownloadedAnime = [];

window.addEventListener("resize", SearchWindowResize);

let SearchKeyHandler = (ev) => {
	return;
	if (ev.key == "Escape") {
		if (ShowingEpisodes) {
			ShowingEpisodes = false;
		} else {
			if (Searching) CloseSearch();
		}
	}
};

window.addEventListener("keydown", SearchKeyHandler);

canvas.addEventListener("mousemove", (event) => {
	mouse.x = event.clientX;
	mouse.y = event.clientY;
});

canvas.addEventListener("mousedown", (event) => {
	if (event.button == 0) {
		mouse.pressed = true;
		mouse.clicked = true;
	} else if (event.button == 2) {
		mouse.rightclicked = true;
	}
});

canvas.addEventListener("mouseup", (event) => {
	if (event.button == 0) mouse.pressed = false;
});

canvas.addEventListener("wheel", (event) => {
	let amount = event.deltaY / Math.abs(event.deltaY);
	ChangeIndex(isNaN(amount) ? 0 : amount);
});

function SearchWindowResize() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	height = canvas.height / 2;
	width = height / 1.41;
}

let mouse = {
	x: 0,
	y: 0,
	pressed: false,
	clicked: false,
	rightclicked: false,
};

let AnimeList = [];
let EpisodeList = [];
let AnimeIndex = 0;
let EpisodeIndex = 0;

let ShowingEpisodes = false;
let CurrentAnime = null;
let Loading = false;

let height = 0;
let width = 0;

function drawSearchCanvas() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	//if the user clicked this frame
	if (
		(mouse.clicked || mouse.rightclicked) &&
		!Loading &&
		(AnimeList.length > 0 || EpisodeList.length > 0)
	) {
		//calculate what episode they where hovering over
		//as a number relative to the middle episode
		let c = mouse.x - canvas.width / 2;
		let g = Math.round(c / width);

		//check if the episode was the middle (current) one
		if (g == 0) {
			//if the click was a right click
			//download
			if (mouse.rightclicked) {
				//check if viewing anime list, not episode lost
				if (!ShowingEpisodes) {
					//get current anime
					CurrentAnime = AnimeList[Math.round(AnimeIndex)];
					//display loading screen
					Loading = true;
					//loop over each episode in anime
					//and call download.
					//500ms delay, otherwise puppeteer times out.
					CurrentAnime?.getEpisodes().then((episodes) => {
						EpisodeList = episodes;
						let index = 0;
						EpisodeList.forEach((episode) => {
							setTimeout(() => {
								episode.download();
								DownloadedAnime[CurrentAnime.name].seasons[
									episode.season
								].episodes[episode.episode] = true;
							}, 500 * index);
							index++;
						});
						Loading = false;
					});
				} else {
					Loading = true;
					EpisodeList[Math.round(EpisodeIndex)]
						?.download()
						.finally(() => {
							Loading = false;
						});
				}
			} else {
				if (!ShowingEpisodes) {
					CurrentAnime = AnimeList[Math.round(AnimeIndex)];
					EpisodeList = [];
					EpisodeIndex = 0;
					ShowingEpisodes = true;
					Loading = true;
					CurrentAnime?.getEpisodes().then((episodes) => {
						EpisodeList = episodes;
						EpisodeList.forEach((episode) => {
							episode.anime = CurrentAnime;
						});
						Loading = false;
					});
				} else {
					let Episode = EpisodeList[Math.round(EpisodeIndex)];
					//Episode.play();
					//CloseSearch();
					VideoQueue.AddVideo(Episode);
					CloseSearch();
				}
			}
		} else {
			ChangeIndex(g);
		}
	}

	if (Loading) {
		ctx.textAlign = "center";
		ctx.font = "25px Arial";
		ctx.fillStyle = "#ecf0f1";
		ctx.fillText(
			"Loading...",
			canvas.width / 2,
			canvas.height / 2,
			canvas.width - 20
		);
	} else if (!ShowingEpisodes) {
		for (let k = 0; k < 10; k++) {
			let i = Math.round(k + (AnimeIndex - 5));
			let anime = AnimeList[i];
			if (!anime) continue;
			//try {
			let x =
				canvas.width / 2 - width / 2 + (width + 20) * (i - AnimeIndex);
			let y =
				canvas.height / 2 - height / 2 + 15 * Math.abs(i - AnimeIndex);

			ctx.drawImage(anime.image, x, y, width, height);
			if (tab == "Downloaded") {
				let count = 0;

				let seasons = DownloadedAnime[anime.name].seasons;

				for (let season in seasons) {
					count += Object.keys(seasons[season].episodes).length;
				}

				ctx.fillText(
					count + " Episodes",
					x + width / 2,
					y + height + 25,
					width
				);
			}
		}

		ctx.textAlign = "center";
		ctx.font = "25px Arial";
		ctx.fillStyle = "#ecf0f1";
		ctx.fillText(
			AnimeList[Math.round(AnimeIndex)]?.name || "",
			canvas.width / 2,
			90,
			canvas.width - 20
		);
	} else {
		for (let k = 0; k < 10; k++) {
			let i = Math.round(k + (EpisodeIndex - 5));
			let Episode = EpisodeList[i];
			if (!Episode) continue;

			let x =
				canvas.width / 2 -
				width / 2 +
				(width + 20) * (i - EpisodeIndex);
			let y =
				canvas.height / 2 -
				height / 2 +
				15 * Math.abs(i - EpisodeIndex);

			if (tab == "History") {
				ctx.fillRect(x, y, width, height);
			} else {
				if (IsDownloaded(Episode)) {
					ctx.fillText("Downloaded", x + width / 2, y + height + 30);
				}

				try {
					ctx.drawImage(CurrentAnime.image, x, y, width, height);
				} catch {
					//lol
				}
			}
		}

		ctx.textAlign = "center";
		ctx.font = "25px Arial";
		ctx.fillStyle = "#ecf0f1";
		ctx.fillText(
			EpisodeList[Math.round(EpisodeIndex)]?.name || "",
			canvas.width / 2,
			90,
			canvas.width - 20
		);
	}

	mouse.clicked = false;
	mouse.rightclicked = false;
	if (Searching) requestAnimationFrame(drawSearchCanvas);
}

let ChangeTime = 0.25;
let Steps = 30;

function ChangeIndex(amount) {
	if (ShowingEpisodes) {
		let inde = Math.round(EpisodeIndex);
		if (inde + amount >= EpisodeList.length || inde + amount < 0) return;

		let time = (ChangeTime * 1000) / Steps;
		let dif = amount / Steps;
		for (let i = 0; i < Steps; i++) {
			setTimeout(() => {
				EpisodeIndex = Math.max(
					Math.min(EpisodeIndex + dif, EpisodeList.length - 1),
					0
				);
			}, time * i);
		}
	} else {
		let inde = Math.round(AnimeIndex);
		if (inde + amount >= AnimeList.length || inde + amount < 0) return;

		let time = (ChangeTime * 1000) / Steps;
		let dif = amount / Steps;
		for (let i = 0; i < Steps; i++) {
			setTimeout(() => {
				AnimeIndex = Math.max(
					Math.min(AnimeIndex + dif, AnimeList.length - 1),
					0
				);
			}, time * i);
		}
	}
}

function OpenSearch() {
	Searching = true;
	requestAnimationFrame(drawSearchCanvas);
	searchBox.classList.remove("hidden");
	searchBox.querySelector("input").focus();
}

function CloseSearch() {
	Searching = false;
	searchBox.classList.add("hidden");
}

function SearchboxSearch(e) {
	Loading = true;
	search(e.srcElement.value).then((anime) => {
		AnimeList = anime;
		AnimeIndex = 0;
		Loading = false;
	});
}

function GetDownloadedAnime() {
	AnimeList = [];

	Loading = true;

	return getDownloaded().then((data) => {
		AnimeList = data.parsed;
		Loading = false;
		ShowingEpisodes = false;
		AnimeIndex = 0;
		DownloadedAnime = data.raw;
	});
}

function SearchTab(newTab) {
	tab = newTab;
	let buttons = document.querySelectorAll("#searchbox .buttons button");

	for (let button of buttons) {
		button.classList.add("inactive");
	}

	document
		.querySelector("#searchbox .buttons button." + newTab)
		?.classList.remove("inactive");

	switch (newTab) {
		case "Search":
			// @ts-ignore
			let input = document.querySelector("#searchbox input");
			// @ts-ignore
			input.style.display = "block";
			SearchboxSearch({ srcElement: input });
			AnimeList = [];
			ShowingEpisodes = false;

			//@ts-ignore
			input.focus();
			break;

		case "Downloaded":
			// @ts-ignore
			document.querySelector("#searchbox input").style.display = "none";
			GetDownloadedAnime();
			break;

		case "History":
            GetWatchHistory().then((watched) => {
                
            })
			break;
	}
}

function IsDownloaded(video) {
	return DownloadedAnime[video?.anime?.name]?.seasons[video?.season]
		?.episodes[video?.episode]
		? true
		: false;
}

SearchWindowResize();
setTimeout(() => {
	GetDownloadedAnime().then(() => {
		AnimeList = [];
	});
}, 100);
//OpenSearch();
