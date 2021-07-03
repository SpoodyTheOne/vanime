class DownloadedVideo extends AnimeVideo {
	constructor(name, url, episode, season, ova, movie) {
		super(name, url, episode, season, ova, movie);

		this.download = () => {};

		this.play = () => {
			VideoPlayer.SetVideo(this, true).then(() => {
				VideoPlayer.Play();
			});
		};
	}
}
