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
			label:"",
			visible:false
		},
		{
			accelerator: "ctrl+shift+i",
			role: "toggleDevTools",
			label:"",
			visible:false,
		},
	]);

	Window.menuBarVisible = false;
	Window.setMenuBarVisibility(false)

	Window.on("leave-full-screen",() => {
		Window.setMenuBarVisibility(false);
	})

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

ipcMain.handle("Wco.GetDescription", (event, url) => {
	return Wcofun.Instance.GetDescription(url);
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
		executablePath:
			__dirname + (process.platform === "win32" ? "/chromium/windows/chrome" : "/chromium/linux/chrome"),
	})
		.init()
		.then(() => {
			CreateWindow();
		});
});
