// @ts-check
const fs = require("fs");
const path = require("path");
const { app } = require("electron");

let data = { Watchlist: [] };

//structure of data inside watched.json
/*

{
    "Anime-Name":
    {
        //Seasons object
        Seasons: {
            //Season object
            "1": {
                //Episodes object
                Episodes: {
                    "1": {
                        //Timestamp in seconds
                        "Timestamp": 0,
                    }
                }
            }
        }
    }
    "Watchlist": [
        1: {
            "anime":"anime-name",
            "season":"1",
            "episode":"1",
			"Url": "url",
			"Anime": {
				"Name": "anime-name",
				"Url": "anime-url",
				"Image": "image-url"
			}
        }
    ]
}

*/

const filePath = path.join(
	app.getPath("appData"),
	"Vanime Video Streamer/watched.json"
);

/**
 * @return {Promise<Object>} returns an array of video-like objects
 */
module.exports.GetWatched = () => {
	// return fs.promises
	// 	.readFile(filePath, { encoding: "utf-8" })
	// 	.then((data) => {
	// 		return JSON.parse(data);
	// 	});

	return new Promise((Resolve, Reject) => {
		Resolve(data.Watchlist);
	});
};

/**
 * @param {String} [Anime] Name of the anime
 * @param {String} [Season] Season
 * @param {String} [Episode] Episode
 *
 * @return {Promise<number>} Number of seconds into the video has been watched.
 * resolves 0 if not watched.
 */
module.exports.GetTimetstamp = (Anime, Season, Episode) => {
	// return fs.promises.open(filePath, "w+").then((file) => {
	// 	return file.readFile({ encoding: "utf-8" }).then((raw) => {
	// 		try {
	// 			let data = JSON.parse(raw);
	// 			let time =
	// 				data[Anime]?.Seasons[Season]?.Episodes[Episode]?.Timestamp;

	// 			return time == undefined ? 0 : time;
	// 			file.close();
	// 		} catch {
	// 			return file.writeFile("{}").then(() => {
	// 				file.close();
	// 				return 0;
	// 			});
	// 		}
	// 	});
	// });

	return new Promise((Resolve, Reject) => {
		let time = data[Anime]?.Seasons[Season]?.Episodes[Episode]?.Timestamp;

		Resolve(time == undefined ? 0 : time);
	});
};

function _setData(anime, season, episode, watched, time) {
	let _anime = {};
	let _season = {};
	let _episode = {};

	if (!watched) {
		delete data[anime]?.Seasons[season]?.Episodes[episode];
	} else {
		if (!data[anime]) {
			data[anime] = { Seasons: {} };
		}

		_anime = data[anime];

		if (!_anime.Seasons[season]) {
			_anime.Seasons[season] = { Episodes: {} };
		}

		_season = _anime.Seasons[season];

		if (!_season.Episodes[episode]) {
			_season.Episodes[episode] = { Timestamp: time ? time : 0 };
			_episode = _season.Episodes[episode];
		} else if (time) {
			_season.Episodes[episode].Timestamp = time;
		}
	}
}

/**
 * @param {String} [Anime] Name of the anime
 * @param {Object} [Video] Video
 * @param {boolean} [Watched] State to be set to
 *
 * @return {Promise<void>} Resolves when finnished writing to disk.
 */
module.exports.SetWatched = (Anime, Video, Watched) => {
	// return fs.promises.open(filePath, "w+").then((file) => {
	// 	return file.readFile({ encoding: "utf-8" }).then((raw) => {
	// 		//if the file is newly created.
	// 		if (raw.length == 0) {
	// 			raw = "{}";
	// 		}

	// 		_setData(JSON.parse(raw), Anime, Season, Episode, Watched);

	// 		file.close();

	// 		return;
	// 	});
	// });

	return new Promise((Resolve, Reject) => {
		_setData(Anime, Video.season, Video.episode, Watched);

		let d = {
			Anime: Anime,
			Season: Video.season,
			Episode: Video.episode,
			Url: Video.url,
			Name: Video.name,
			Downloaded: Video.downloaded
		};

		let exists = data.Watchlist.map((x) => {
			return x.Name;
		}).indexOf(Video.name);

		if (exists != -1) {
			data.Watchlist.splice(exists, 1);
		}

		data.Watchlist.unshift(d);

		if (data.Watchlist.length > 10) data.Watchlist.pop();

		Resolve();
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
module.exports.SetTimestamp = (Anime, Season, Episode, Time) => {
	// return fs.promises.open(filePath, "w+").then((file) => {
	// 	return file.readFile({ encoding: "utf-8" }).then((raw) => {
	// 		//if the file is newly created.
	// 		if (raw.length == 0) {
	// 			raw = "{}";
	// 		}

	// 		_setData(JSON.parse(raw), Anime, Season, Episode, true, Time);

	// 		file.close();

	// 		return;
	// 	});
	// });

	return new Promise((Resolve, Reject) => {
		_setData(Anime, Season, Episode, true, Time);
		Resolve();
	});
};

module.exports.init = () => {
	return new Promise((Resolve, Reject) => {
		if (!fs.existsSync(filePath)) {
			fs.writeFileSync(filePath, JSON.stringify(data), {
				encoding: "utf-8",
			});
		}

		Resolve(
			fs.promises
				.readFile(filePath, { encoding: "utf-8" })
				.then((raw) => {
					data = JSON.parse(raw);
				})
		);
	});
};

module.exports.save = () => {
	return fs.promises.open(filePath, "w+").then((fh) => {
		return fh
			.writeFile(JSON.stringify(data), { encoding: "utf-8" })
			.then(() => {
				fh.close();
				return true;
			});
	});
};
