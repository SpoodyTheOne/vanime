//@ts-check
/** @type {HTMLCanvasElement} */
// @ts-ignore
const canvas = document.getElementById("searchCanvas");
const ctx = canvas.getContext("2d");

const searchBox = document.getElementById("searchbox");

let Searching = false;

window.addEventListener("resize", SearchWindowResize);

window.addEventListener("keydown", (ev) => {
	if (ev.key == "Escape") {
		if (ShowingEpisodes) {
			ShowingEpisodes = false;
		} else {
			if (Searching) CloseSearch();
			else OpenSearch();
		}
	}
});

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
	ChangeIndex(event.deltaY / Math.abs(event.deltaY));
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

	if (
		(mouse.clicked || mouse.rightclicked) &&
		!Loading &&
		(AnimeList.length > 0 || EpisodeList.length > 0)
	) {
		let c = mouse.x - canvas.width / 2;

		let g = Math.round(c / width);

		if (g == 0) {
			if (mouse.rightclicked) {
				if (!ShowingEpisodes) {
					CurrentAnime = AnimeList[Math.round(AnimeIndex)];
					Loading = true;
					CurrentAnime?.getEpisodes().then((episodes) => {
						EpisodeList = episodes;
						Loading = false;
						let index = 0;
						EpisodeList.forEach((episode) => {
							setTimeout(() => {
								episode.download();
							}, 500 * index);
							index++;
						});
					});
				} else {
					Loading = true;
					EpisodeList[Math.round(EpisodeIndex)]
						?.download()
						.then(() => {
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
						Loading = false;
					});
				} else {
					let Episode = EpisodeList[Math.round(EpisodeIndex)];
					//Episode.play();
					//CloseSearch();
					if (!Episode.InQueue) {
						VideoQueue.AddVideo(Episode);
						Episode.InQueue = true;
					} else {
						VideoQueue.RemoveVideo(Episode);
						Episode.InQueue = false;
					}
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
		ctx.globalAlpha = 1;
		for (let i = 0; i < AnimeList.length; i++) {
			try {
				let anime = AnimeList[i];
				ctx.drawImage(
					anime.image,
					canvas.width / 2 -
						width / 2 +
						(width + 20) * (i - AnimeIndex),
					canvas.height / 2 -
						height / 2 +
						15 * Math.abs(i - AnimeIndex),
					width,
					height
				);
			} catch {
				//lol
			}
		}

		ctx.textAlign = "center";
		ctx.font = "25px Arial";
		ctx.fillStyle = "#ecf0f1";
		ctx.fillText(
			AnimeList[Math.round(AnimeIndex)]?.name || "",
			canvas.width / 2,
			120,
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

			if (Episode.InQueue) {
				ctx.fillStyle = "#f1c40f";
				ctx.beginPath();
				ctx.ellipse(x + width / 2, y - 30, 20, 20, 0, 0, 2 * Math.PI);
				ctx.fill();
			}

			try {
				ctx.drawImage(CurrentAnime.image, x, y, width, height);
			} catch {
				//lol
			}
		}

		ctx.textAlign = "center";
		ctx.font = "25px Arial";
		ctx.fillStyle = "#ecf0f1";
		ctx.fillText(
			EpisodeList[Math.round(EpisodeIndex)]?.name || "",
			canvas.width / 2,
			120,
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

function SearchShowDownloaded() {
	let buttons = document.querySelectorAll("#searchbox .buttons button");
	buttons[0].classList.add("inactive");
	buttons[1].classList.remove("inactive");
	// @ts-ignore
	document.querySelector("#searchbox input").style.display = "none";

	//TODO: set AnimeList to data from /appdata/downloaded.json
	AnimeList = [];

	Loading = true;

	getDownloaded().then((data) => {
		AnimeList = data;
		Loading = false;
	});
}

function SearchShowSearch() {
	let buttons = document.querySelectorAll("#searchbox .buttons button");
	buttons[1].classList.add("inactive");
	buttons[0].classList.remove("inactive");
	// @ts-ignore
	document.querySelector("#searchbox input").style.display = "block";
    AnimeList = [];
}

SearchWindowResize();
//OpenSearch();
