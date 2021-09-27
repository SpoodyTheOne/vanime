"use strict";

const Puppeteer = require("puppeteer");

class Wcofun {
	/** @type {Wcofun} */
	static Instance = null;

	constructor(options = {}) {
		/** @type {Puppeteer.Page} */
		this.WorkerPage = null;
		/** @type {Puppeteer.Browser} */
		this.Browser = null;

		this.options = options;

		/**
		 * @returns {Promise}
		 */
		this.init = async () => {
			if (!Wcofun.Instance) Wcofun.Instance = this;
			else console.error("Tried to create new Wcofun instance when one already exists");

			await Puppeteer.launch(this.options).then((browser) => {
				this.Browser = browser;

				return this.Browser.pages().then((pages) => {
					this.WorkerPage = pages[0];
				});
			});
		};

		this.RemoveAds = () => {
			return this.WorkerPage.waitForSelector(".vdo_stories_floating").then(() => {
				this.WorkerPage.evaluate(`document.querySelector(".vdo_stories_floating").remove()`);
			});
		};

		/**
		 * @returns {Promise<Anime>} The currently featured anime
		 */
		this.GetFeatured = async () => {
			this.WorkerPage.goto("http://wcofun.com");
			await this.RemoveAds();
			await this.WorkerPage.waitForSelector("#sidebar_today");
			const data = await this.WorkerPage.$eval("#sidebar_today", (element) => {
				let url = element.children[1].href;
				let image = element.children[1].children[0].src;
				let description = element.children[3].innerText;

				let name = document.getElementsByClassName("recent-release")[0].children[0].innerText;

				return { url: url, image: image, name: name, description: description };
			});
			return data;
		};

		/**
		 * @returns {Promise<Episode[]>}
		 */
		this.GetRecentReleases = async () => {
			this.WorkerPage.goto("http://wcofun.com/");
			await this.RemoveAds();
			await this.WorkerPage.waitForSelector(".recent-release-main #sidebar_right");
			let data = this.WorkerPage.$$eval(".recent-release-main #sidebar_right .items li", (elements) => {
				return elements.map((x) => {
					return {
						image: x.children[0].children[0].children[0].src,
						url: x.children[1].children[0].href,
						name: x.children[1].innerText,
					};
				});
			});
			return data;
		};

		/**
		 * @param {String} Url
		 * @returns {Promise<Episode[]>} The episodes of this anime
		 */
		this.GetEpisodes = (Url) => {
			return new Promise(async (resolve, reject) => {
				this.WorkerPage.goto(Url);
				await this.RemoveAds();
				let data = await this.WorkerPage.$$eval("#sidebar_right3 .cat-eps", (elements) => {
					return elements.map((x) => {
						return { name: x.children[0].innerHTML, url: x.children[0].href };
					});
				});

				resolve(data);
			});
		};

		this.EpisodeGetAnime = async (url) => {
			this.WorkerPage.goto(url);
			await this.RemoveAds();
            await this.WorkerPage.waitForSelector(".header-tag h2")
			this.WorkerPage.click(".header-tag h2");
			await this.WorkerPage.waitForNavigation();
			return this.WorkerPage.evaluate(() => {
				let title = document.querySelector(".video-title .h1-tag a");
				let name = title.innerText;
				let url = title.href;

				let description = document.querySelector("#sidebar_cat p").innerText;

				let image = document.querySelector("#sidebar_cat img").src;

				return { name: name, url: url, description: description, image: image };
			});
		};

		/**
		 * Gets the image of an anime
		 * @param {Url} Url
		 * @returns {Promise<String>}
		 */
		this.GetImage = (Url) => {
			return this.WorkerPage.goto(Url).then(async () => {
				await this.RemoveAds();
				await this.WorkerPage.waitForSelector("#sidebar_cat .img5");
				return this.WorkerPage.$eval("#sidebar_cat .img5", (element) => {
					return element.src;
				});
			});
		};
	}
}

module.exports.Wcofun = Wcofun;
