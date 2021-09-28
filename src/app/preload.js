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
		return ipcRenderer.invoke("Wco.Search",string);
	}
};
