import PropTypes from 'prop-types';
import { List, Flex, Avatar, Image, Typography, Progress, Rate } from 'antd';
import { format } from 'date-fns';
import GenreTag from './GenreTag';
import FetchMovies from '../api/fetchMovies';

const { Text, Paragraph } = Typography;

export default function MovieCard({
  movie,
  guestID,
  getRateByID,
  setRateByID,
}) {
  const pickColor = (rate) => {
    if (rate < 3) return '#E90000';
    if (rate < 5) return '#E97E00';
    if (rate < 7) return '#E9D100';
    return '#66E900';
  };

  const {
    title,
    poster_path: poster,
    overview,
    genre_ids: genresID,
    release_date: releaseDate,
    vote_average: rating,
    id: movieID,
  } = movie;

  const fetchMovies = new FetchMovies();

  return (
    <List.Item className="movie-card">
      <Flex gap={20}>
        <Avatar
          shape="square"
          className="poster"
          src={
            <Image
              preview
              src={`https://image.tmdb.org/t/p/w500/${poster}`}
              fallback="/fallback.jpg"
            />
          }
        />
        <Flex
          vertical
          gap={10}
          style={{ flex: 1, padding: '0.63rem 0.57rem 1rem 0' }}
        >
          <Flex justify="space-between" align="center">
            <Text style={{ fontSize: '1.25rem' }}>{title}</Text>
            <Progress
              type="circle"
              format={() => rating.toFixed(1)}
              percent={99.99}
              strokeWidth={6}
              size={30}
              strokeColor={pickColor(rating)}
            />
          </Flex>
          <Text style={{ color: '#827E7E', fontSize: '0.75rem' }}>
            {releaseDate
              ? format(releaseDate, 'MMMM d, yyyy')
              : 'Unknown release date'}
          </Text>
          <Flex wrap="wrap">
            {genresID.map((genreID) => (
              <GenreTag genreID={genreID} key={genreID} />
            ))}
          </Flex>
          <Flex vertical style={{ flex: 1 }}>
            <Paragraph style={{ fontSize: '0.75rem' }}>
              {FetchMovies.cutText(overview, 34)}
            </Paragraph>
            <Rate
              style={{
                alignSelf: 'flex-end',
                marginTop: 'auto',
                fontSize: '1rem',
              }}
              count={10}
              allowHalf
              onChange={(value) => {
                if (guestID) {
                  setRateByID(movieID, value);
                  fetchMovies.postRating(movieID, guestID, value);
                }
              }}
              value={+getRateByID(movieID)}
            />
          </Flex>
        </Flex>
      </Flex>
    </List.Item>
  );
}

MovieCard.propTypes = {
  movie: PropTypes.object.isRequired,
  guestID: PropTypes.string.isRequired,
  getRateByID: PropTypes.func.isRequired,
  setRateByID: PropTypes.func.isRequired,
};
