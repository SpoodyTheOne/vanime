const fs = require("fs/promises");
const gayfs = require("fs");
const path = require("path");
const { app } = require("electron");

class History {
	/** @type {{index: {Name: string Url:string Season:number Episode:number Time:number}}} */
	static Watched = null;

	static FilePath = path.join(app.getPath("userData"), "Vanime/watchhistory.json");
	static FolderPath = path.join(app.getPath("userData"), "Vanime");

	static async FileExists() {
		return fs
			.access(this.FilePath, gayfs.constants.F_OK)
			.then(() => true)
			.catch(() => false);
	}

	static async LoadWatched() {
		if (this.Watched == null) {
			if (!(await this.FileExists())) {
				//watchhistory.json doesnt exist, create
				await fs.mkdir(this.FolderPath, { recursive: true });
				await fs.writeFile(this.FilePath, `{"WatchHistory":{}}`);
				this.Watched = {};
			} else {
				let data = JSON.parse(await fs.readFile(this.FilePath));
				this.Watched = data["WatchHistory"];
			}

			setInterval(() => {
				this.SaveData();
			}, 30 * 1000);
		}
	}

	static async GetWatched() {
		await this.LoadWatched();
		return this.Watched;
	}

	static async SetWatched(name, url, season, episode, time) {
		await this.LoadWatched();
		this.Watched[name] = {
			Name: name,
			Url: url,
			Season: season,
			Episode: episode,
			Time: time,
		};
	}

	static async SaveData() {
		await this.LoadWatched();

		let data = JSON.parse(await fs.readFile(this.FilePath));

		data.WatchHistory = this.Watched;

		data = JSON.stringify(data);

		fs.writeFile(this.FilePath, data);
	}

	static async GetTime(name) {
		await this.LoadWatched();

		return this.Watched[name]?.Time ?? 0;
	}
}

module.exports.History = History;
