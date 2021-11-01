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

	static async GetEpisode(name) {
		await this.LoadWatched();
		return this.Watched[name] ?? { Name: name, Episode: 0, Season: 0, Time: 0 };
	}

	static async SetWatched(name, url, season, episode, time) {
		await this.LoadWatched();
		this.Watched[name] = {
			Name: name,
			Url: url,
			Season: season,
			Episode: episode,
			Time: time,
			LastWatched: Date.now(),
		};
	}

	static async SaveData() {
		await this.LoadWatched();

		let data = JSON.parse(await fs.readFile(this.FilePath));

		data.WatchHistory = this.Watched;

		data = JSON.stringify(data);

		await fs.writeFile(this.FilePath, data);
	}

	static async GetTime(name, season, episode) {
		await this.LoadWatched();

		if (season != this.Watched[name]?.Season || episode != this.Watched[name]?.Episode) return 0;

		return this.Watched[name]?.Time ?? 0;
	}

	static async Remove(name) {
		await this.LoadWatched();

		delete this.Watched[name];
	}
}

module.exports.History = History;
