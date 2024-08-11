import { Component } from 'react';
import { Layout, Flex, Input, Pagination, Alert } from 'antd';
// import { SearchOutlined } from '@ant-design/icons';
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

  state = {
    movieData: {},
    loading: true,
    error: false,
    page: 1,
    query: '',
  };

  componentDidMount() {
    const { page } = this.state;
    this.trendMovies(page);
  }

  componentDidUpdate(prevProps, prevState) {
    const { page: newPage, query: newQuery } = this.state;
    const { page: prevPage, query: prevQuery } = prevState;

    if (
      (prevQuery !== newQuery && newQuery.trim()) ||
      (newQuery.trim() && prevPage !== newPage)
    ) {
      this.searchMovies(newQuery, newPage);
    }

    if (
      (!newQuery.trim() && prevPage !== newPage) ||
      (prevQuery !== newQuery && !newQuery.trim())
    ) {
      this.trendMovies(newPage);
    }
  }

  handleSearch = (e) => {
    this.setState({ query: e.target.value });
  };

  pageChanger = (newPage) => {
    this.setState({ page: newPage });
  };

  trendMovies(page) {
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
          error: err,
        });
      });
  }

  searchMovies(query, page = 1) {
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
          error: err,
        });
      });
  }

  render() {
    const { movieData, loading, error, page } = this.state;

    return (
      <Layout className="app">
        <Flex justify="center">
          <Content style={contentStyle}>
            <Flex justify="center" vertical>
              <Input
                placeholder="Type to search..."
                style={{ marginBottom: '3rem' }}
                onChange={debounce(this.handleSearch, 350)}
              />

              {error ? (
                <Alert
                  type="error"
                  message="Error"
                  description={error.message}
                  style={{ alignSelf: 'center', width: '50%' }}
                />
              ) : (
                <>
                  <Movies movieData={movieData.results} loading={loading} />
                  <Pagination
                    align="center"
                    defaultCurrent={page}
                    total={movieData.total_pages}
                    onChange={this.pageChanger}
                    showSizeChanger={false}
                  />
                </>
              )}
            </Flex>
          </Content>
        </Flex>
      </Layout>
    );
  }
}
