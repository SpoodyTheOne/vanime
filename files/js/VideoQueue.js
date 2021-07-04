// @ts-check
class VideoQueue {
	/** @type {Video[]} */
	static Videos = [];

	static index = 0;

	static AddVideo = (video) => {
		let queuedVideo = VideoQueue.AddQueueElement(video);

		VideoQueue.Videos.push(queuedVideo);

		if (VideoQueue.Videos.length - 1 == VideoQueue.index) video.play();

		//return index of this video
		return VideoQueue.Videos.length - 1;
	};

	static RemoveVideo = (video) => {
		let i = 0;
		for (let vid of VideoQueue.Videos) {
			if (vid == video) {
				VideoQueue.Videos.splice(i, 1);

				//clamp index between 0 and the
				//amount of videos
				VideoQueue.index = Math.min(
					Math.max(VideoQueue.index, VideoQueue.Videos.length - 1),
					0
				);

				if (VideoQueue.Videos.length == 0) {
					VideoPlayer.video.src = "";
					return;
				}

				let vid = VideoQueue.Videos[VideoQueue.index];
				VideoPlayer.SetVideo(vid, vid instanceof DownloadedVideo);
				break;
			}
			i++;
		}
	};

	static NextVideo = () => {
		VideoQueue.index++;

		if (VideoQueue.index >= VideoQueue.Videos.length) {
			let video = VideoQueue.Videos[VideoQueue.index - 1];

			if (video instanceof AnimeVideo) {
				let playNext = false;

				for (let vid of video?.anime.episodes) {
					if (playNext) {
						VideoQueue.AddVideo(vid);
						break;
					} else if (vid == video) {
						playNext = true;
					}
				}

				if (!playNext) {
					VideoQueue.index--;
					return;
				}
			} else {
			}
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

	//html part

	static controls = document.getElementById("controls");
	static button = document.querySelector("#controls .top button");

	static ToggleVisible = () => {
		VideoQueue.controls.classList.toggle("queue-visible");
		VideoQueue.button.classList.toggle("fa-flip-vertical");

		VideoPlayer.Pause();
	};

	static AddQueueElement = (video) => {
		//really hoping I define AnimeVideo.anime all places where this is called.
		//because im gonna use anime.image for this
		let queue = document.querySelector("#video-queue .queue");

		let newVideo = document.createElement("div");
		newVideo.classList.add("video");
		newVideo.innerHTML = `<img src="${
			video.anime.image.src
		}" class="image"><marquee class="name">${video.GetName()}</marquee><span class="episode">Season ${
			video.season
		} Episode ${video.episode}</span>`;
		queue.appendChild(newVideo);

		return QueuedVideo.VideoToQueuedVideo(video, newVideo);
	};
}
