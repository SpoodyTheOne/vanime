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
