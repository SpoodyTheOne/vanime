//@ts-check
//extended class of AnimeVideo
//with download() disabled.
class DownloadedVideo extends AnimeVideo {
	constructor(name, url, episode, season, ova, movie) {
		//call AnimeVideo constructor
		super(name, url, episode, season, ova, movie);

		//disable download
		this.download = () => {
			return new Promise((resolve, reject) => {
				reject("Already downloaded");
			});
		};

		//tell VideoPlayer that his is a downloaded video when playing.
		this.play = () => {
			super.play(true);
		};
	}
}
