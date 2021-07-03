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

		return out;
	});
}
