class Anime {
    constructor(name, url, image) {
        this.name = name;
        this.url = url;
        this.image = new Image();
        this.image.src = image;

        this.episodes = [];

        this.getEpisodes = () => {
            if (this.episodes.length > 0)
                return new Promise((resolve) => {
                    resolve(this.episodes);
                });

            return getEpisodes(this.url).then((episodes) => {
                this.episodes = episodes.reverse();
                return episodes;
            });
        };
    }
}
