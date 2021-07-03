//@ts-check
const path = require("path");
const fetch = require("node-fetch");
const { app } = require("electron");
const fs = require("fs");

let canDownload = true;

function getPath() {
	//path for storing videos.
	return path.join(
		app.getPath("appData"),
		"Vanime Video Streamer/downloaded"
	);
}

function createIfNotExist(path) {
	//check if folder exists, if not, create it
	if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true });
}

function download(url, anime, season, episode, name) {
	addToList(anime, season, episode, name).then((data) => {
		//Download episode video file
		//@ts-ignore
		fetch(url).then(
			(
				/** @type {{ body: { pipe: (arg0: fs.WriteStream) => void; }; }} */ res
			) => {
				createIfNotExist(path.join(data.url, "../"));
				const dest = fs.createWriteStream(data.url);
				res.body.pipe(dest);
				canDownload = true;
			}
		);

		//download anime image if not already downloaded
		let p = path.join(data.url, "../../");
		let imgFile = path.join(p, "image.jpg");

		if (!fs.existsSync(imgFile)) {
			//@ts-ignore
			fetch(anime.image).then((res) => {
				createIfNotExist(p);
				const dest = fs.createWriteStream(imgFile);
				res.body.pipe(dest);
			});
		}
	});
}

/*

{
    anime-name:
    {
        episodes: [
            {
                name,
                episode,
                season
            }
        ]
    }
}

*/

//add data to downloaded.json
function addToList(anime, season, episode, name) {
	let p = getPath();
	createIfNotExist(p);

	let file = path.join(p, "downloaded.json");

	//create file if doesn't exist
	if (!fs.existsSync(file)) fs.writeFileSync(file, "{}");

	//read data, if any
	return fs.promises.readFile(file, { encoding: "utf-8" }).then((raw) => {
		//parse data as json
		let data = JSON.parse(raw);

		//check if data from this anime already exists
		if (!data[anime.name]) {
			data[anime.name] = {
				url: path.join(
					getPath(),
					anime.name.replace(/[\\/:"*?<>|]+/g, ""),
					"image.jpg"
				),
				episodes: [],
			};
		}

		let episodeData = {
			name: name,
			episode: episode,
			season: season,
			url: path.join(
				getPath(),
				anime.name.replace(/[\\/:"*?<>|]+/g, ""),
				"Season " + season,
				"Episode " + episode + ".mp4"
			),
		};

		data[anime.name].episodes.push(episodeData);

		fs.promises.writeFile(file, JSON.stringify(data));

		return episodeData;
	});
}

module.exports.canDownload = () => {
	return canDownload;
};
module.exports.download = download;
module.exports.getDownloaded = () => {
	let p = getPath();
	createIfNotExist(p);

	let file = path.join(p, "downloaded.json");

	//create file if doesn't exist
	if (!fs.existsSync(file)) fs.writeFileSync(file, "{}");

	//read data, if any
	return fs.promises.readFile(file, { encoding: "utf-8" }).then((raw) => {
		return JSON.parse(raw);
	});
};
