//@ts-check
class Video {
	constructor(name, url) {
		this.name = name;
		this._url = url;

		this.GetName = () => {
			return this.name.split("Season").shift().split("Episode").shift();
		};

		//random id so i can compare videos across classes
		this.id = Math.random();
	}

	get url() {
		return this._url;
	}

	play(downloaded) {
		VideoPlayer.SetVideo(this, downloaded ? true : false).then(() => {
			VideoPlayer.Play();
		});
	}

	static GetWatched = () => {
		// @ts-ignore
		return app.GetWatched();
	};
}
