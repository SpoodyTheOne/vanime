function search(str) {
    return app.Search(str).then((data) => {
        return data.map((x) => {
            return new Anime(x.name, x.url, x.image);
        });
    });
}

function getEpisodes(url) {
    return app.GetEpisodes(url).then((data) => {
        return data.map((x) => {
            return new AnimeVideo(x.name, x.url, x.episode, x.season, x.ova, x.movie);
        });
    });
}
