/**
 *
 * @param {String} [str] The string to search for
 * @returns {Promise<Anime[]>}
 */
function search(str) {
	return app.Search(str).then((data) => {
		return data.map((x) => {
			return new Anime(x.name, x.url, x.image);
		});
	});
}

function getEpisodes(url) {
	return app.GetEpisodes(url).then((data) => {
		return data.map((x) => {
			return new AnimeVideo(
				x.name,
				x.url,
				x.episode,
				x.season,
				x.ova,
				x.movie
			);
		});
	});
}

function download(video) {
	return app.Download(video);
}

function getDownloaded() {
	return app.GetDownloaded().then((data) => {
		let out = [];
		for (let anime in data) {
			let a = new Anime(anime, "", data[anime].url);
			a.episodes = data[anime].episodes.map((episode) => {
				return new DownloadedVideo(
					episode.name,
					episode.url,
					episode.episode,
					episode.season,
					false,
					false
				);
			});
			out.push(a);
		}

		// out.forEach((anime) => {
		// 	anime.episodes.sort((a, b) => {
		// 		return a.season - b.season || a.episode - b.episode;
		// 	});
		// });

		return { parsed: out, raw: data };
	});
}

function ResizeWindow(x, y) {
	return app.ResizeWindow(x, y);
}

function GetWatchHistory() {
	return app.GetWatched().then((data) => {
		return data.map((x) => {
			//console.log(x);
			let anime = new Anime(x.Anime.name, x.Anime.url, x.Anime.image);
			let video = null;
			if (!x.Downloaded) {
				video = new AnimeVideo(
					x.Name,
					x.Url,
					x.Episode,
					x.Season,
					false,
					false
				);
			} else {
				video = new DownloadedVideo(
					x.Name,
					x.Url,
					x.Episode,
					x.Season,
					false,
					false
				);
			}
			video.anime = anime;
			return video;
		});
	});
}

let KeyHandler = (event) => {
	/** @type {HTMLElement} */
	let target = event.target;

	if (target.tagName != "INPUT") {
		switch (event.key) {
			//pause / play
			case "Enter":
				target.blur();
				break;
			case " ":
				VideoPlayer.Toggle();
				target.blur();
				event.preventDefault();
				return false;
			//fullscreen
			case "f":
				VideoPlayer.ToggleFullscreen();
				break;
			//seek back
			case "ArrowLeft":
				VideoPlayer.Seek(-5);
				break;
			//seek forward
			case "ArrowRight":
				VideoPlayer.Seek(5);
				break;
			//toggle mute
			case "m":
				VideoPlayer.ToggleMute();
				break;
		}
	}
};

window.addEventListener("keydown", KeyHandler);
