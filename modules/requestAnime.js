//@ts-check
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

let Pages = {
	/** @type {puppeteer.Page} */
	search: null,
};

/** @type {puppeteer.Browser} */
let Browser = null;

function search(str) {
	//check if puppeteer is ready
	if (!Pages.search)
		return new Promise((res, err) => {
			err("Not Ready");
		});

	Pages.search.bringToFront();

	//type in search box
	return (
		Pages.search
			.type("#konuara .catara2", str)
			//click search button
			.then(async () => {
				await Pages.search.click("input.aramabutonu2.button1");
				await Pages.search.waitForNavigation();
				return Pages.search.content();
			})
			.then((content) => {
				//parse scraped content from website
				let $ = cheerio.load(content);
				//find all anime li's and map to object
				return $("#sidebar_right2 .items li")
					.toArray()
					.map((element) => {
						/*
                    {
                        url: URL,
                        image: URL,
                        name: String
                    }
                    */
						let e = $(element);
						let a = e.find("a");
						let img = e.find("img");
						return {
							url: a.attr("href"),
							image: img.attr("src"),
							name: img.attr("alt"),
						};
					});
			})
	);
}

function getEpisodes(url) {
	/*
    let page = Pages.load;

    //check if puppeteer is ready
    if (!page)
        return new Promise((res, reject) => {
            reject("Not Ready");
        });

    page.bringToFront();
    */

	return Browser.newPage().then((page) => {
		return page
			.goto(url)
			.then(() => {
				return page.content();
			})
			.then((content) => {
				let $ = cheerio.load(content);
				page.close();
				return $("#sidebar_right3 .cat-eps")
					.toArray()
					.map((x) => {
						let element = $(x);
						let a = element.find("a");
						let url = a.attr("href");
						let name = a.text();
						let episode =
							name
								?.match(/Episode [0-9]+/g)
								?.shift()
								?.split(" ")
								.pop() || -1;
						let season =
							name
								?.match(/Season [0-9]+/g)
								?.shift()
								?.split(" ")
								.pop() || 1;

						let movie = episode == -1;
						let ova =
							name?.match(/OVA Episode [0-9]+/g)?.shift() !=
							undefined;

						return {
							url: url,
							name: name,
							// @ts-ignore
							episode: parseInt(episode),
							// @ts-ignore
							season: parseInt(season),
							movie: movie,
							ova: ova,
						};
					});
			});
	});
}

function getEpisodeVideo(url) {
	/*
	let page = Pages.episode;

	if (!page)
		return new Promise((res, err) => {
			err("Not Ready");
		});

	page.bringToFront();
    */

	return Browser.newPage().then((page) => {
		return page.goto(url).then(() => {
			return page.$("iframe#cizgi-js-0, iframe#anime-js-0").then((e) => {
				return e.contentFrame().then(async (c) => {
					await c.click("a");
					let video = await c.waitForSelector("#myJwVideo_media");
					await video.click();
					return c.$("video").then((video) => {
						return video.getProperty("src").then(async (v) => {
							page.close();
							//@ts-ignore
							return v._remoteObject.value;
						});
					});
				});
			});
		});
	});
}

puppeteer
	.launch({
		executablePath: process.env.CHROME_PATH_WINDOWS,
		headless: true,
		timeout: 60000,
	})
	.then((browser) => {
		Browser = browser;
		browser.pages().then((pages) => {
			Pages.search = pages[0];
			Pages.search.goto("http://thewatchcartoononline.tv/search");
		});
	});

module.exports.Pages = Pages;
module.exports.search = search;
module.exports.getEpisodes = getEpisodes;
module.exports.getEpisodeVideo = getEpisodeVideo;
