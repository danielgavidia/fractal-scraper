const puppeteer = require("puppeteer");
const UserAgent = require("user-agents");

const url = "https://www.imdb.com/chart/top/";

async function main() {
	// Start a browser instance
	const browser = await puppeteer.launch({
		headless: true,
	});

	// Start a browser tab
	let page = await browser.newPage();

	// Set user agent to mimic a real browser
	const userAgent = new UserAgent().toString();
	await page.setUserAgent(userAgent);

	// Take page to url
	await page.goto(url);

	// Console log HTML content of the site
	console.log(await page.content());

	// Close browser and tab
	await page.close();
	await browser.close();
}

main();
