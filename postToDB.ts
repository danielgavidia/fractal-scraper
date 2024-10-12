import prisma from "./prisma/prisma";
import getScrapedMovies from "./getScrapedMovies";

const postToDB = async () => {
	const scrapedMovies = await getScrapedMovies();

	for (const movie of scrapedMovies) {
		await prisma.movie.upsert({
			where: {
				title: movie.title,
			},
			update: {
				imageUrl: movie.imageUrl,
				description: movie.description,
			},
		});
	}
};

await postToDB();
