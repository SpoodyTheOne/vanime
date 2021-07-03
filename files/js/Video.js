//@ts-check
class Video {
    constructor(name, url) {
        this.name = name;
        this.url = url;

        this.play = () => {
            VideoPlayer.SetVideo(this).then(() => {
                VideoPlayer.Play();
            });
        };
    }
}
