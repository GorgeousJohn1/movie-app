import { List } from 'antd';
import PropTypes from 'prop-types';
import MovieCard from './MovieCard';

export default function Movies({ movieData = [], loading = false }) {
  return (
    <List
      grid={{
        gutter: 36,
        column: 2,
        xs: 1,
        sm: 1,
        md: 2,
      }}
      loading={loading}
      itemLayout="vertical"
      dataSource={movieData}
      renderItem={(item) => <MovieCard movie={item} />}
    />
  );
}

Movies.propTypes = {
  movieData: PropTypes.array,
  loading: PropTypes.bool,
};
