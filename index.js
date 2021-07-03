// @ts-check
//initialize process.env variables
const { app, BrowserWindow, ipcMain } = require("electron");
require("dotenv").config();
const Anime = require("./modules/requestAnime");
const DownloadManager = require("./modules/downloadManager");

const path = require("path");

/** @type {BrowserWindow} */
let window = null;

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

app.whenReady().then(() => {
	CreateWindow();
});
