import { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  CircularProgress, 
  Pagination,
  Grid,
  Container,
  Paper,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery
} from '@mui/material';
import MovieCard from '../components/MovieCard';
import MovieSlider from '../components/MovieSlider';
import { movieApi } from '../api';
import { useAuth } from '../contexts/AuthContext';
import type { Movie } from '../api';

interface PaginatedMovies {
  movies: Movie[];
  pages: number;
  page: number;
  total: number;
}

export default function HomePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { isAuthenticated } = useAuth();
  const [paginatedMovies, setPaginatedMovies] = useState<PaginatedMovies>({
    movies: [],
    page: 1,
    pages: 0,
    total: 0
  });
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const categories = ['new', 'single', 'series', 'theater'];
  
  const fetchMovies = async (page = 1) => {
    try {
      const category = categories[activeTab];
      const [moviesResponse, favoritesResponse] = await Promise.all([
        movieApi.getMovies(page, 20, category),
        isAuthenticated ? movieApi.getFavorites() : Promise.resolve({ data: [] })
      ]);

      setPaginatedMovies(moviesResponse.data);
      setFavorites(new Set(favoritesResponse.data.map(movie => movie._id)));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };  // Fetch movies when tab changes
  useEffect(() => {
    setLoading(true);
    fetchMovies();
  }, [activeTab]);

  // Fetch featured movies on component mount
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await movieApi.getFeaturedMovies();
        setFeaturedMovies(response.data.data); // response.data.data because of ApiResponse wrapper
      } catch (error) {
        console.error('Error fetching featured movies:', error);
      }
    };
    fetchFeatured();
  }, []);

    const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setLoading(true);
    fetchMovies(value);
    // Scroll to top on page change
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: theme.palette.grey[100], minHeight: '100vh', pb: 4 }}>
      {/* Featured Movies Slider */}
      <Box sx={{ mb: 4 }}>
        <MovieSlider movies={featuredMovies} />
      </Box>

      <Container maxWidth="xl">
        {/* Category Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            variant={isMobile ? "scrollable" : "fullWidth"}
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Phim Mới" />
            <Tab label="Phim Lẻ" />
            <Tab label="Phim Bộ" />
            <Tab label="Phim Chiếu Rạp" />
          </Tabs>
        </Paper>

        {/* Movie Grid */}
        <Grid container spacing={2}>
          {paginatedMovies.movies.map((movie) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={movie._id}>
              <MovieCard 
                movie={movie} 
                isFavorite={favorites.has(movie._id)}
                onToggleFavorite={() => fetchMovies(paginatedMovies.page)}
              />
            </Grid>
          ))}
        </Grid>

        {/* Pagination */}
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination 
            count={paginatedMovies.pages} 
            page={paginatedMovies.page} 
            onChange={(_, page) => fetchMovies(page)}
            color="primary"
            size={isMobile ? "small" : "medium"}
          />
        </Box>
      </Container>
    </Box>
  );
}
