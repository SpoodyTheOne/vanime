const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const { Wcofun } = require("./src/api/wcofun.js");

/** @type {Electron.BrowserWindow} */
let Window;

function CreateWindow() {
	Window = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			contextIsolation: false,
			preload: __dirname + "/src/app/preload.js",
			nativeWindowOpen: true,
		},
		autoHideMenuBar: true,
	});

	let menu = Menu.buildFromTemplate([
		{
			label: "reload",
			accelerator: "ctrl+r",
		},
	]);

	Window.menuBarVisible = false;

	Window.loadFile(__dirname + "/src/app/index.html");
}

ipcMain.handle("Wco.GetEpisodes", (event,url) => {
	return Wcofun.Instance.GetEpisodes(url);
});

ipcMain.handle("Wco.GetFeatured", (event) => {
	return Wcofun.Instance.GetFeatured();
});

ipcMain.handle("Wco.GetRecentReleases", (event) => {
	return Wcofun.Instance.GetRecentReleases();
});

ipcMain.handle("Wco.EpisodeGetAnime", (event,url) => {
	return Wcofun.Instance.EpisodeGetAnime(url);
});

app.whenReady().then(() => {
	new Wcofun({ headless: true, timeout: 5000 }).init().then(() => {
		CreateWindow();
	});
});
