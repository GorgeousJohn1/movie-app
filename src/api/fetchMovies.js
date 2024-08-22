export default class FetchMovies {
  getOptions = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlOTFhMGNmNGM4ZDcxNzk5NmY5NWFhODEwOWMzMjczYiIsIm5iZiI6MTcyMjExMTc4Ni44MzgwNDcsInN1YiI6IjY2YTUzODgwOWMxZGY5NTE1YmIxNDcxYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.N1YfAHbU3sfLT4Fu0z7ZR6eS4jToCEJxKHRt2WL957E',
    },
  };

  postOptions = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json;charset=utf-8',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlOTFhMGNmNGM4ZDcxNzk5NmY5NWFhODEwOWMzMjczYiIsIm5iZiI6MTcyNDAwNTU3NS41MjMxMDMsInN1YiI6IjY2YTUzODgwOWMxZGY5NTE1YmIxNDcxYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.zGRPKKCiP3JYuK8k17AiQekWs7vIZVKMAQ1l61Q_d20',
    },
  };

  trendingURL =
    'https://api.themoviedb.org/3/trending/movie/day?language=en-US';

  searchURL = 'https://api.themoviedb.org/3/search/movie?query=';

  guestSessionURL =
    'https://api.themoviedb.org/3/authentication/guest_session/new';

  genres = [
    {
      id: 28,
      name: 'Action',
    },
    {
      id: 12,
      name: 'Adventure',
    },
    {
      id: 16,
      name: 'Animation',
    },
    {
      id: 35,
      name: 'Comedy',
    },
    {
      id: 80,
      name: 'Crime',
    },
    {
      id: 99,
      name: 'Documentary',
    },
    {
      id: 18,
      name: 'Drama',
    },
    {
      id: 10751,
      name: 'Family',
    },
    {
      id: 14,
      name: 'Fantasy',
    },
    {
      id: 36,
      name: 'History',
    },
    {
      id: 27,
      name: 'Horror',
    },
    {
      id: 10402,
      name: 'Music',
    },
    {
      id: 9648,
      name: 'Mystery',
    },
    {
      id: 10749,
      name: 'Romance',
    },
    {
      id: 878,
      name: 'Science Fiction',
    },
    {
      id: 10770,
      name: 'TV Movie',
    },
    {
      id: 53,
      name: 'Thriller',
    },
    {
      id: 10752,
      name: 'War',
    },
    {
      id: 37,
      name: 'Western',
    },
  ];

  async getResource(url) {
    const res = await fetch(url, this.getOptions);

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

  async getGuestSessionID() {
    const res = await this.getResource(this.guestSessionURL);
    if (!res.success) throw new Error();
    const { guest_session_id: guestSessionID } = res;
    return guestSessionID;
  }

  async postRating(movieID, guestSessionID, value) {
    const body = `{"value": "${value}"}`;
    const newOptions = { ...this.postOptions, body };

    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${movieID}/rating?guest_session_id=${guestSessionID}`,
        newOptions
      );
      if (res.success === false) throw new Error(`Couldn't post rating`);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async getRatedMovies(guestSessionID, page) {
    const url = `https://api.themoviedb.org/3/guest_session/${guestSessionID}/rated/movies?language=en-US&page=${page}`;
    const res = await this.getResource(url, this.getOptions);
    return res;
  }

  static cutText(text, wordLimit) {
    const textArr = text.split(' ');
    if (textArr.length > 34)
      return `${textArr.slice(0, wordLimit).join(' ')}...`;
    return text;
  }
}
