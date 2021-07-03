//@ts-check
const { ipcRenderer, contextBridge } = require("electron");

class app {
	static Minimize = () => {
		ipcRenderer.send("Minimize");
	};

	static ToggleMaximize = () => {
		ipcRenderer.send("ToggleMaximize");
	};

	static Close = () => {
		//no need to contact app.
		//widow.close() will call events
		window.close();
	};

	static Search = (str) => {
		return ipcRenderer.invoke("Search", str);
	};

	static GetEpisodes = (str) => {
		return ipcRenderer.invoke("GetEpisodes", str);
	};

	static GetEpisodeVideo = (str) => {
		return ipcRenderer.invoke("GetEpisodeVideo", str);
	};

	static Download = (/** @type {AnimeVideo} */ video) => {
		return app.GetEpisodeVideo(video.url).then((url) => {
			return ipcRenderer.invoke("Download", {
				url: url,
				anime: {
					name: video.anime.name,
					image: video.anime.image.src,
				},
				season: video.season,
				episode: video.episode,
				name: video.name,
			});
		});
	};

	static GetDownloaded = () => {
		return ipcRenderer.invoke("GetDownloaded");
	};
}

//@ts-ignore
window.app = app;
