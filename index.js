const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const { Wcofun } = require("./src/api/wcofun.js");

/** @type {Electron.BrowserWindow} */
let Window;

function CreateWindow() {
	Window = new BrowserWindow({
		width: 800,
		height: 600,
		minHeight: 600,
		minWidth: 800,
		webPreferences: {
			contextIsolation: false,
			preload: __dirname + "/src/app/preload.js",
			nativeWindowOpen: true,
		},
	});

	let menu = Menu.buildFromTemplate([
		{
			accelerator: "ctrl+r",
			role: "reload",
		},
		{
			accelerator: "ctrl+shift+i",
			role: "toggleDevTools",
		},
	]);

	Window.menuBarVisible = false;

	Window.setMenu(menu);

	Window.loadFile(__dirname + "/src/app/index.html");
}

ipcMain.handle("Wco.GetEpisodes", (event, url) => {
	return Wcofun.Instance.GetEpisodes(url);
});

ipcMain.handle("Wco.GetFeatured", (event) => {
	return Wcofun.Instance.GetFeatured();
});

ipcMain.handle("Wco.GetRecentReleases", (event) => {
	return Wcofun.Instance.GetRecentReleases();
});

ipcMain.handle("Wco.EpisodeGetAnime", (event, url) => {
	return Wcofun.Instance.EpisodeGetAnime(url);
});

ipcMain.handle("Wco.GetEpisodeUrl", (event, url) => {
	return Wcofun.Instance.GetEpisodeUrl(url);
});

ipcMain.handle("Wco.Search", (event, string) => {
	return Wcofun.Instance.Search(string);
});

app.whenReady().then(() => {
	new Wcofun({
		headless: true,
		timeout: 5000,
		args: [
			"--disable-background-timer-throttling",
			"--disable-backgrounding-occluded-windows",
			"--disable-renderer-backgrounding",
		],
		executablePath: __dirname + "/chromium/chrome",
	})
		.init()
		.then(() => {
			CreateWindow();
		});
});
