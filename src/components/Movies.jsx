import PropTypes from 'prop-types';
import { List } from 'antd';
import { SessionContext } from '../context/SessionContext';
import MovieCard from './MovieCard';

export default function Movies({ movieData = [], loading = false }) {
  return (
    <SessionContext.Consumer>
      {({ guestSessionData, getRateByID, setRateByID }) => (
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
          renderItem={(item) => (
            <MovieCard
              movie={item}
              guestID={guestSessionData}
              key={item.id}
              getRateByID={getRateByID}
              setRateByID={setRateByID}
            />
          )}
        />
      )}
    </SessionContext.Consumer>
  );
}

Movies.propTypes = {
  movieData: PropTypes.array,
  loading: PropTypes.bool,
};
