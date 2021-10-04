const { ipcRenderer } = require("electron");

window.API = {
	GetEpisodes: (Url) => {
		return ipcRenderer.invoke("Wco.GetEpisodes", Url);
	},
	GetFeatured: () => {
		return ipcRenderer.invoke("Wco.GetFeatured");
	},
	GetRecentReleases: () => {
		return ipcRenderer.invoke("Wco.GetRecentReleases");
	},
	EpisodeGetAnime: (Url) => {
		return ipcRenderer.invoke("Wco.EpisodeGetAnime", Url);
	},
	GetEpisodeUrl: (Url) => {
		return ipcRenderer.invoke("Wco.GetEpisodeUrl", Url);
	},
	Search: (string) => {
		return ipcRenderer.invoke("Wco.Search", string);
	},
	GetDescription: (Url) => {
		return ipcRenderer.invoke("Wco.GetDescription", Url);
	},
	GetImage: (Url) => {
		return ipcRenderer.invoke("Wco.GetImage", Url);
	},

	GetWatched: () => {
		return ipcRenderer.invoke("History.GetWatched");
	},

	SetWatched: (name, url, season, episode, time) => {
		return ipcRenderer.invoke("History.SetWatched", name, url, season, episode, time);
	},

	GetTime: (name) => {
		return ipcRenderer.invoke("History.GetTime", name);
	},
};
