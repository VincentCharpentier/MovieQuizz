import Net from 'Utils/net';

const TMDB_ENDPOINT = 'https://api.themoviedb.org/3';
const TMDB_IMG_BASE = 'https://image.tmdb.org/t/p/w500/';

const MIN_VOTE_COUNT = 500;
const MOVIE_LIST_LENGTH = 50;

const BREAK_AFTER = 10;

export const TmdbAPI = {
  async getTopMovies() {
    let movies = [];
    let page = 1;
    let hasNextPage = true;

    while (
      page < BREAK_AFTER &&
      hasNextPage &&
      movies.length < MOVIE_LIST_LENGTH
    ) {
      const result = await Net.get(
        `${TMDB_ENDPOINT}/movie/top_rated?page=${page}&api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
      );
      const validMovies = result.results.filter(
        (x) => x.vote_count >= MIN_VOTE_COUNT && x.adult === false,
      );
      movies.push(...validMovies);
      page++;
      hasNextPage = page < result.total_pages;
    }

    movies = await Promise.all(
      movies.map((m) =>
        Net.get(
          `${TMDB_ENDPOINT}/movie/${m.id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&append_to_response=credits`,
        ),
      ),
    );

    movies = movies.map(({ title, poster_path, credits: { cast } }) => {
      return {
        title,
        pic: TMDB_IMG_BASE + poster_path,
        cast: cast
          .filter((x) => x.profile_path && x.order < 2)
          .map(({ name, profile_path }) => ({
            name,
            pic: TMDB_IMG_BASE + profile_path,
          })),
      };
    });
    return movies;
  },
};
