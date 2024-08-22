import { Component } from 'react';
import PropTypes from 'prop-types';
import { Layout, Flex, Input, Pagination, Alert, Tabs } from 'antd';
import debounce from 'lodash.debounce';
import Movies from './components/Movies';
import FetchMovies from './api/fetchMovies';
import './App.css';

const { Content } = Layout;

const contentStyle = {
  backgroundColor: '#FFFFFF',
  maxWidth: '1010px',
  minHeight: '100vh',
  padding: '1.5rem',
};

export default class App extends Component {
  fetchService = new FetchMovies();

  tabs = [
    {
      key: '1',
      label: 'Search',
      children: '',
    },
    {
      key: '2',
      label: 'Rated',
      children: '',
    },
  ];

  state = {
    movieData: {},
    loading: true,
    error: false,
    page: 1,
    query: '',
    mode: 'search',
    errorMessage: '',
  };

  componentDidMount() {
    const { page } = this.state;
    this.trendMovies(page);
  }

  componentDidUpdate(prevProps, prevState) {
    const { page: newPage, query: newQuery, mode: newMode } = this.state;
    const { page: prevPage, query: prevQuery, mode: prevMode } = prevState;
    const { guestID } = this.props;

    if (prevMode === 'search' && newMode === 'rated') {
      this.setState({ loading: true });
      this.getRatedMovies(guestID);
    }

    if (prevMode === 'rated' && newMode === 'search') {
      this.setState({ error: false });
      this.setState({ loading: true, page: 1, query: '' });
      this.trendMovies(1);
    }

    if (
      (newMode === 'search' && !prevQuery && newQuery.trim()) ||
      (newMode === 'search' &&
        prevQuery &&
        newQuery &&
        prevQuery !== newQuery.trim())
    ) {
      this.setState({ loading: true });
      this.searchMovies(newQuery, 1);
    }

    if (
      newMode === 'search' &&
      prevQuery === newQuery &&
      prevPage !== newPage
    ) {
      this.setState({ loading: true });
      this.searchMovies(newQuery, newPage);
    }

    if (
      newMode === 'search' &&
      prevQuery !== newQuery &&
      !newQuery.trim() &&
      prevPage === newPage
    ) {
      this.setState({ loading: true, page: 1 });
      this.trendMovies(1);
    }

    if (
      newMode === 'search' &&
      !newQuery.trim() &&
      newQuery === prevQuery &&
      prevPage !== newPage
    ) {
      this.setState({ loading: true });
      this.trendMovies(newPage);
    }
  }

  handleSearch = (e) => {
    this.setState({ query: e.target.value });
  };

  onTabChange = (key) => {
    if (key === '1') this.setState({ mode: 'search' });
    if (key === '2') this.setState({ mode: 'rated' });
  };

  pageChanger = (newPage) => {
    this.setState({ page: newPage, loading: true });
  };

  trendMovies = (page = 1) => {
    this.fetchService
      .fetchTrendMovies(page)
      .then((movieData) => {
        this.setState({
          loading: false,
          movieData,
          page,
        });
      })
      .catch((err) => {
        this.setState({
          loading: false,
          error: true,
          errorMessage: err.message,
        });
      });
  };

  searchMovies = (query, page = 1) => {
    this.fetchService
      .fetchSearchMovies(query, page)
      .then((movieData) => {
        this.setState({
          loading: false,
          movieData,
          page,
        });
      })
      .catch((err) => {
        this.setState({
          loading: false,
          error: true,
          errorMessage: err.message,
        });
      });
  };

  getRatedMovies = (guestID, page = 1) => {
    this.fetchService
      .getRatedMovies(guestID, page)
      .then((movieData) => {
        this.setState({
          loading: false,
          movieData,
          page,
        });
      })
      .catch(() => {
        this.setState({
          loading: false,
          movieData: [],
        });
      });
  };

  render() {
    const { movieData, loading, error, page, mode, errorMessage } = this.state;

    return (
      <Layout className="app">
        <Flex justify="center">
          <Content style={contentStyle}>
            <Flex justify="center" vertical>
              <Tabs
                defaultActiveKey="1"
                items={this.tabs}
                onChange={this.onTabChange}
                centered
                destroyInactiveTabPane
              />
              {mode === 'search' && (
                <Input
                  placeholder="Type to search..."
                  style={{ marginBottom: '3rem' }}
                  onChange={debounce(this.handleSearch, 350)}
                />
              )}
              {error ? (
                <Alert
                  type="error"
                  message="Error"
                  description={errorMessage.message}
                  style={{ alignSelf: 'center', width: '50%' }}
                />
              ) : (
                <>
                  <Movies movieData={movieData.results} loading={loading} />
                  {mode === 'search' && (
                    <Pagination
                      align="center"
                      current={page}
                      total={movieData.total_pages}
                      onChange={this.pageChanger}
                      showSizeChanger={false}
                    />
                  )}
                </>
              )}
            </Flex>
          </Content>
        </Flex>
      </Layout>
    );
  }
}

App.defaultProps = {
  guestID: null,
};

App.propTypes = {
  guestID: PropTypes.string,
};
