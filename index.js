// @ts-check
//initialize process.env variables
const { app, BrowserWindow, ipcMain, Menu } = require("electron");
require("dotenv").config();
const Anime = require("./modules/requestAnime");
const DownloadManager = require("./modules/downloadManager");
const Watched = require("./modules/watchedManager");

const path = require("path");

/** @type {BrowserWindow} */
let window = null;

let ReadyToQuit = false;

function CreateWindow() {
	window = new BrowserWindow({
		width: 800,
		height: 600,
		minWidth: 800,
		minHeight: 600,
		icon: path.join(__dirname, "/icons/icon.png"),
		frame: false,
		webPreferences: {
			preload: path.join(__dirname, "/files/js/index.js"),
			contextIsolation: false,
		},
	});

	window.loadFile(path.join(__dirname, "/pages/index.html"));

	const template = [
		{
			label: "Vanime",
			submenu: [
				{ role: "reload" },
				{ role: "forceReload" },
				{ role: "toggleDevTools" },
			],
		},
	];

	// @ts-ignore
	const menu = Menu.buildFromTemplate(template);
	Menu.setApplicationMenu(menu);

	// setTimeout(() => {
	//     Anime.search("tensei slime").then((data) => {
	//         Anime.getEpisodes(data[0].url).then((d) => {
	//             Anime.getEpisodeVideo(d[0].url).then((url) => {
	//                 console.log(url);
	//             });
	//         });
	//     });
	// }, 2500);
}

ipcMain.on("Minimize", () => {
	window.minimize();
});

ipcMain.on("ToggleMaximize", () => {
	window.isMaximized() ? window.unmaximize() : window.maximize();
});

ipcMain.handle("Search", (event, str) => {
	return Anime.search(str);
});

ipcMain.handle("GetEpisodes", (event, url) => {
	return Anime.getEpisodes(url);
});

ipcMain.handle("GetEpisodeVideo", (event, url) => {
	return Anime.getEpisodeVideo(url);
});

ipcMain.handle("Download", (event, data) => {
	DownloadManager.download(
		data.url,
		data.anime,
		data.season,
		data.episode,
		data.name
	);
});

ipcMain.handle("GetDownloaded", () => {
	return DownloadManager.getDownloaded();
});

ipcMain.handle("ResizeWindow", (event, size) => {
	console.log("resize window");

	let diff = 1;

	if (size.width < 800) {
		diff = 800 / size.width;
	} else if (size.height < 600) {
		diff = 600 / size.height;
	}

	size.width = Math.round(size.width * diff);
	size.height = Math.round(size.height * diff);

	console.log(size);

	window.setSize(size.width, size.height, true);
});

ipcMain.handle("SetWatched", (event, data) => {
	return Watched.SetWatched(data.Anime, data.Video);
});

ipcMain.handle("SetTimestamp", (event, data) => {
	return Watched.SetTimestamp(
		data.Anime.name,
		data.Season,
		data.Episode,
		data.Time
	);
});

ipcMain.handle("GetWatched", (event, data) => {
	return Watched.GetWatched();
});

ipcMain.handle("GetTimestamp", (event, data) => {
	return Watched.GetTimetstamp(data.Anime.name, data.Season, data.Episode);
});

app.on("before-quit", (event) => {
	if (!ReadyToQuit) {
		event.preventDefault();

		Watched.save().then(() => {
			ReadyToQuit = true;
			app.quit();
		});

		return false;
	}
});

app.whenReady().then(() => {
	Watched.init().then(() => {
		CreateWindow();
	});
});
