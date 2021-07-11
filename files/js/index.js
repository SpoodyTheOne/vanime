//@ts-check
const { ipcRenderer, contextBridge } = require("electron");

//
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

	static ResizeWindow = (x, y) => {
		return ipcRenderer.invoke("ResizeWindow", { width: x, height: y });
	};

	static GetWatched = () => {
		return ipcRenderer.invoke("GetWatched");
	};

	/**
	 * @param {String} [Anime] Name of the anime
	 * @param {String} [Season] Season
	 * @param {String} [Episode] Episode
	 *
	 * @return {Promise<number>} Number of seconds into the video has been watched.
	 * resolves 0 if not watched.
	 */
	static GetTimestamp = (Anime, Season, Episode) => {
		return ipcRenderer.invoke("GetTimestamp", {
			Anime: Anime,
			Season: Season,
			Episode: Episode,
		});
	};

	/**
	 * @param {String} [Anime] Name of the anime
	 * @param {String} [Season] Season
	 * @param {String} [Episode] Episode
	 * @param {number} [Time] The time in seconds watched
	 *
	 * @return {Promise<void>} Resolves when finnished writing to disk.
	 */
	static SetTimestamp = (Anime, Season, Episode, Time) => {
		return ipcRenderer.invoke("SetTimestamp", {
			Anime: Anime,
			Season: Season,
			Episode: Episode,
			Time: Time,
		});
	};

	/**
	 * @param {String} [Anime] Name of the anime
	 * @param {AnimeVideo} [Video] Video object
	 * @param {boolean} [Watched] State to be set to
	 *
	 * @return {Promise<void>} Resolves when finnished writing to disk.
	 */
	static SetWatched = (Anime, Video, Watched) => {
		return ipcRenderer.invoke("SetWatched", {
			Anime: Anime,
			Video: Video,
			Watched: Watched,
		});
	};
}

//@ts-ignore
window.app = app;
