import { Component, createContext } from 'react';
import { PropTypes } from 'prop-types';
import { Alert, Flex, Spin } from 'antd';
import FetchMovies from '../api/fetchMovies';

export const SessionContext = createContext();

export class SessionProvider extends Component {
  fetchMovies = new FetchMovies();

  state = {
    guestSessionData: null,
    ratedMovies: new Map(),
    loaded: false,
    error: false,
    errorMessage: '',
  };

  componentDidMount() {
    if (sessionStorage.length) {
      const guestSessionData = sessionStorage.getItem('guestSessionData');
      const ratedMovies = sessionStorage.getItem('ratedMovies');

      if (guestSessionData) {
        this.setState({
          guestSessionData: JSON.parse(guestSessionData),
          loaded: true,
        });
      }

      if (ratedMovies) {
        this.setState(() => ({
          ratedMovies: new Map(Object.entries(JSON.parse(ratedMovies))),
        }));
      }
      return;
    }

    this.fetchMovies
      .getGuestSessionID()
      .then((res) => {
        this.setState({ guestSessionData: res, loaded: true });
        sessionStorage.setItem('guestSessionData', JSON.stringify(res));
      })
      .catch((err) => {
        this.setState({ loaded: true, error: true, errorMessage: err.message });
      });
  }

  componentDidUpdate() {
    const { ratedMovies } = this.state;
    sessionStorage.setItem(
      'ratedMovies',
      JSON.stringify(Object.fromEntries(ratedMovies))
    );
  }

  getRateByID = (id) => {
    const { ratedMovies } = this.state;
    return ratedMovies.get(`${id}`);
  };

  setRateByID = (id, rate) => {
    const { ratedMovies } = this.state;
    ratedMovies.set(`${id}`, `${rate}`);
    this.setState({ ratedMovies });
  };

  render() {
    const { children } = this.props;
    const { guestSessionData, loaded, error, errorMessage } = this.state;

    if (error)
      return (
        <Flex vertical justify="space-around" align="center">
          <Alert
            style={{
              width: '50%',
              marginTop: '25%',
            }}
            type="error"
            message="Error"
            description={errorMessage}
          />
        </Flex>
      );

    return loaded ? (
      <SessionContext.Provider
        // eslint-disable-next-line react/jsx-no-constructed-context-values
        value={{
          guestSessionData,
          getRateByID: this.getRateByID,
          setRateByID: this.setRateByID,
        }}
      >
        {children}
      </SessionContext.Provider>
    ) : (
      <Spin fullscreen />
    );
  }
}

SessionProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
