import PropTypes from 'prop-types';
import { Tag } from 'antd';
import FetchMovies from '../api/fetchMovies';

const fetchService = new FetchMovies();
const { genres } = fetchService;

export default function GenreTag({ genreID = '' }) {
  const findGenreName = () => genres.find(({ id }) => id === genreID).name;

  return <Tag style={{ marginBottom: '0.3rem' }}>{findGenreName()}</Tag>;
}

GenreTag.propTypes = {
  genreID: PropTypes.number,
};
