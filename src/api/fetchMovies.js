export default class FetchMovies {
  options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlOTFhMGNmNGM4ZDcxNzk5NmY5NWFhODEwOWMzMjczYiIsIm5iZiI6MTcyMjExMTc4Ni44MzgwNDcsInN1YiI6IjY2YTUzODgwOWMxZGY5NTE1YmIxNDcxYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.N1YfAHbU3sfLT4Fu0z7ZR6eS4jToCEJxKHRt2WL957E',
    },
  };

  trendingURL =
    'https://api.themoviedb.org/3/trending/movie/day?language=en-US';

  searchURL = 'https://api.themoviedb.org/3/search/movie?query=';

  async getResource(url) {
    const res = await fetch(url, this.options);

    if (!res.ok) {
      throw new Error(`Couldn't fetch ${url}, received ${res.status}`);
    }
    const responseBody = await res.json();

    return responseBody;
  }

  async fetchTrendMovies(page) {
    const res = await this.getResource(`${this.trendingURL}&page=${page}`);
    return res;
  }

  async fetchSearchMovies(query, page) {
    const res = await this.getResource(
      `${this.searchURL}${query}&page=${page}`
    );
    return res;
  }

  static cutText(text, wordLimit) {
    const textArr = text.split(' ');
    if (textArr.length > 34)
      return `${textArr.slice(0, wordLimit).join(' ')}...`;
    return text;
  }
}
