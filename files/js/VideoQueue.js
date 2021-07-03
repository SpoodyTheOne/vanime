// @ts-check
class VideoQueue {
    /** @type {Video[]} */
    static Videos = [];

    static index = 0;

    static AddVideo = (video) => {
        VideoQueue.Videos.push(video);

        if (VideoQueue.Videos.length - 1 == VideoQueue.index) video.play();

        //return index of this video
        return VideoQueue.Videos.length - 1;
    };

    static RemoveVideo = (video) => {
        let i = 0;
        for (let vid of VideoQueue.Videos) {
            if (vid == video) {
                VideoQueue.Videos.splice(i, 1);
                break;
            }
            i++;
        }
    };

    static NextVideo = () => {
        VideoQueue.index++;

        if (VideoQueue.index >= VideoQueue.Videos.length) {
            VideoQueue.index--;
            return;
        }

        VideoPlayer.Pause();
        VideoQueue.Videos[VideoQueue.index].play();
    };

    static LastVideo = () => {
        VideoQueue.index--;

        if (VideoQueue.index < 0) {
            VideoQueue.index++;
            return;
        }

        VideoPlayer.Pause();
        VideoQueue.Videos[VideoQueue.index].play();
    };
}
