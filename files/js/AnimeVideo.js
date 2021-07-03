class AnimeVideo extends Video {
    constructor(name, url, episode, season, ova, movie) {
        super(name, url);

        this.episode = episode;
        this.season = season;
        this.ova = ova;
        this.movie = movie;

        this.download = () => {
            //TODO: fetch url and download to folder
            //return DownloadedVideo
        };
    }
}
