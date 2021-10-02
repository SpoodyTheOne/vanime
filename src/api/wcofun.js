"use strict";

const Puppeteer = require("puppeteer");

class Wcofun {
	/** @type {Wcofun} */
	static Instance = null;

	constructor(options = {}) {
		/** @type {Puppeteer.Browser} */
		this.Browser = null;

		this.WorkerPages = {};

		this.options = options;

		/**
		 * @returns {Promise}
		 */
		this.init = async () => {
			if (!Wcofun.Instance) Wcofun.Instance = this;
			else console.error("Tried to create new Wcofun instance when one already exists");

			await Puppeteer.launch(this.options).then((browser) => {
				this.Browser = browser;
			});
		};

		this.RemoveAds = (Page) => {
			if (Page == null) return console.log("Cant remove ads of null");

			return Page.waitForSelector(".vdo_stories_floating").then(() => {
				Page.evaluate(`document.querySelector(".vdo_stories_floating").remove()`);
			});
		};

		/**
		 * @returns {Promise<Anime>} The currently featured anime
		 */
		this.GetFeatured = async () => {
			let page = await this.CreateWorkerPage();
			page.goto("http://wcofun.com");
			await this.RemoveAds(page);
			await page.waitForSelector("#sidebar_today");
			const data = await page.$eval("#sidebar_today", (element) => {
				let url = element.children[1].href;
				let image = element.children[1].children[0].src;
				let description = element.children[3].innerText;

				let name = document.getElementsByClassName("recent-release")[0].children[0].innerText;

				return { url: url, image: image, name: name, description: description };
			});
			page.close();
			return data;
		};

		/**
		 * @returns {Promise<Episode[]>}
		 */
		this.GetRecentReleases = async () => {
			let page = await this.CreateWorkerPage();
			page.goto("http://wcofun.com");
			//await this.RemoveAds(page);
			await page.waitForSelector(".recent-release-main #sidebar_right");
			let data = await page.$$eval(".recent-release-main #sidebar_right .items li", (elements) => {
				return elements.map((x) => {
					return {
						image: x.children[0].children[0].children[0].src,
						url: x.children[1].children[0].href,
						name: x.children[1].innerText,
					};
				});
			});
			page.close();
			return data;
		};

		/**
		 * @param {String} Url
		 * @returns {Promise<Episode[]>} The episodes of this anime
		 */
		this.GetEpisodes = async (Url) => {
			return new Promise(async (resolve, reject) => {
				let page = await this.CreateWorkerPage();
				page.goto(Url);
				await this.RemoveAds(page);
				let data = await page.$$eval("#sidebar_right3 .cat-eps", (elements) => {
					return elements.map((x) => {
						return { name: x.children[0].innerHTML, url: x.children[0].href };
					});
				});
				resolve(data);
				page.close();
			});
		};

		this.EpisodeGetAnime = async (url) => {
			let page = await this.CreateWorkerPage();
			page.goto(url);
			await this.RemoveAds(page);
			await page.waitForSelector(".header-tag h2");
			page.click(".header-tag h2");
			await page.waitForNavigation();
			let data = await page.evaluate(() => {
				let title = document.querySelector(".video-title .h1-tag a");
				let name = title.innerText;
				let url = title.href;

				let description = document.querySelector("#sidebar_cat p").innerText;

				let image = document.querySelector("#sidebar_cat img").src;

				return { name: name, url: url, description: description, image: image };
			});
			page.close();
			return data;
		};

		/**
		 * Gets the image of an anime
		 * @param {Url} Url
		 * @returns {Promise<String>}
		 */
		this.GetImage = async (Url) => {
			let page = await this.CreateWorkerPage();
			return page.goto(Url).then(async () => {
				//await this.RemoveAds(page);
				await page.waitForSelector("#sidebar_cat .img5");
				return page.$eval("#sidebar_cat .img5", (element) => {
					return element.src;
				});
			});
		};

		/**
		 * Searches for anime
		 * @param {String} string
		 */
		this.Search = async (string) => {
			let page = await this.CreateWorkerPage();
			await page.goto("https://wcofun.com/search");
			await this.RemoveAds(page);
			await page.type("#konuara .catara2", string);
			await page.click(".aramabutonu2.button1");
			await page.waitForNavigation();
			let data = await page.$$eval(".items li", (elements) => {
				return elements.map((x) => {
					let Image = x.querySelector(".img a");
					let Url = Image.href;
					let ImageUrl = Image.querySelector("img").src;
					let Name = x.querySelector(".recent-release-episodes").innerText;

					return { image: ImageUrl, url: Url, name: Name };
				});
			});
			page.close();
			return data;
		};

		this.GetEpisodeUrl = async (url) => {
			return new Promise(async (resolve) => {
				let page = await this.CreateWorkerPage();
				await page.goto(url);
				await this.RemoveAds(page);
				let frame = await page.$("#cizgi-js-0, #anime-js-0");

				let content = await frame.contentFrame();

				page.on("request", (req) => {
					let url = req.url().split("?")[0];
					if (url.endsWith(".mp4")) {
						page.close();
						resolve(req.url());
					}
				});

				//click chromecast player button
				await content.click("a");

				await content.waitForSelector("#myJwVideo_display_button");

				await content.click("#myJwVideo_display_button");

				await content.waitForTimeout(500);

				let src = await (await content.waitForSelector("video")).getProperty("src");
			});
		};

		this.GetDescription = async (url) => {
			let page = await this.CreateWorkerPage();
			page.goto(url);
			await page.waitForNavigation();
			await this.RemoveAds();
			let data = await page.$eval("#sidebar_cat p", (element) => {
				return element.innerText;
			});
			page.close();
			return data;
		};

		this.CreateWorkerPage = async () => {
			if (Object.entries(this.WorkerPages).length > 6)
				await new Promise(function (resolve, reject) {
					(function waitForFoo() {
						if (Object.entries(Wcofun.Instance.WorkerPages).length < 7) return resolve();
						setTimeout(waitForFoo, 300);
					})();
				});

			let id = Math.random();
			this.WorkerPages[id] = id;

			let page = await this.Browser.newPage();
			page.once("close", () => {
				delete this.WorkerPages[id];
			});

			this.WorkerPages[id] = page;
			return page;
		};
	}
}

module.exports.Wcofun = Wcofun;
