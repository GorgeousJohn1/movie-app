import { List, Flex, Avatar, Image, Typography, Progress, Tag } from 'antd';
import { format } from 'date-fns';
import PropTypes from 'prop-types';
import FetchMovies from '../api/fetchMovies';

const { Text, Paragraph } = Typography;

export default function MovieCard({ movie = {} }) {
  const {
    title,
    poster_path: poster,
    overview,
    // genre_ids: genres,
    release_date: releaseDate,
    vote_average: rating,
  } = movie;

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
              fallback="../public/fallback.jpg"
            />
          }
        />
        <Flex
          vertical
          gap={10}
          style={{ flex: 1, padding: '10px 9px 2px 0px' }}
        >
          <Flex justify="space-between" align="center">
            <Text style={{ fontSize: '1.66rem' }}>{title}</Text>
            <Progress
              type="circle"
              format={() => rating.toFixed(1)}
              percent={99.99}
              strokeWidth={6}
              size={30}
              strokeColor="yellow"
            />
          </Flex>
          <Text style={{ color: '#827E7E', fontSize: '1rem' }}>
            {releaseDate
              ? format(releaseDate, 'MMMM d, yyyy')
              : 'Unknown release date'}
          </Text>
          <Flex gap={8}>
            <Tag>Action</Tag>
            <Tag>Drama</Tag>
          </Flex>
          <Paragraph style={{ fontSize: '1rem' }}>
            {FetchMovies.cutText(overview, 34)}
          </Paragraph>
        </Flex>
      </Flex>
    </List.Item>
  );
}

MovieCard.propTypes = {
  movie: PropTypes.object,
};
