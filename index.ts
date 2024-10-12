import puppeteer from "puppeteer";
const UserAgent = require("user-agents");

const url = "https://www.imdb.com/chart/top/";

type Movie = {
	title: string;
	img: string;
	imdbLink: string;
	description?: string;
};

const moviesMain = async (): Promise<Movie[]> => {
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

	// Get movie data
	const movieData: Movie[] = await page.evaluate(() => {
		const movies = Array.from(document.querySelectorAll(".ipc-metadata-list-summary-item"));
		const moviesParsed = movies.map((movie) => {
			const title = movie.querySelector(".ipc-title__text")?.textContent?.trim();
			const img = movie.querySelector(".ipc-image")?.getAttribute("src");
			const imdbLink = movie.querySelector(".ipc-title-link-wrapper")?.getAttribute("href");
			return {
				title: title ? title : "",
				img: img ? img : "",
				imdbLink: imdbLink ? `https://www.imdb.com${imdbLink}` : "",
			};
		});
		return moviesParsed;
	});

	// Get movie description from individual movie pages
	const moviesParsed: Movie[] = await Promise.all(
		movieData.slice(0, 10).map(async (movie) => {
			// Navigate to movie page
			if (movie.imdbLink === "") {
				return { ...movie, description: "" };
			}
			const moviePage = await browser.newPage();
			await moviePage.setUserAgent(userAgent);
			await moviePage.goto(movie.imdbLink);

			// Get description
			const description = await moviePage.evaluate(() => {
				return document.querySelector(".sc-55855a9b-0")?.textContent?.trim();
			});
			// console.log(description);
			await moviePage.close();
			return { ...movie, description: description ? description : "" };
		})
	);

	// Close browser and tab
	await page.close();
	await browser.close();

	// Return data;
	return moviesParsed;
};

await moviesMain();
