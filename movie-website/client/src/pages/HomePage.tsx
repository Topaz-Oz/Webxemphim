import { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  CircularProgress, 
  Pagination,
  Stack,
  Paper
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
  const { isAuthenticated } = useAuth();
  const [paginatedMovies, setPaginatedMovies] = useState<PaginatedMovies>({
    movies: [],
    page: 1,
    pages: 0,
    total: 0
  });
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const fetchMovies = async (page = 1) => {
    try {
      const [moviesResponse, favoritesResponse] = await Promise.all([
        movieApi.getMovies(page),
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

  useEffect(() => {
    fetchMovies();
  }, [isAuthenticated]);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setLoading(true);
    fetchMovies(value);
    // Scroll to top on page change
    window.scrollTo(0, 0);
  };

  const handleFavoriteChange = (movieId: string, isFavorite: boolean) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (isFavorite) {
        newFavorites.add(movieId);
      } else {
        newFavorites.delete(movieId);
      }
      return newFavorites;
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {paginatedMovies.movies.length > 0 && (
        <MovieSlider 
          movies={paginatedMovies.movies.slice(0, 5)} 
        />
      )}
      
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Phim Mới Cập Nhật
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {`${paginatedMovies.total} phim`}
        </Typography>
      </Box>

      <Box component="div" sx={{ display: 'grid', gap: 3, mb: 4,
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)'
        }
      }}>
        {paginatedMovies.movies.map((movie) => (
          <MovieCard
            key={movie._id}
            _id={movie._id}
            title={movie.title}
            thumbnail={movie.thumbnail}
            slug={movie.slug}
            year={movie.year}
            isFavorite={favorites.has(movie._id)}
            onFavoriteChange={handleFavoriteChange}
          />
        ))}
      </Box>

      {paginatedMovies.pages > 1 && (
        <Paper elevation={0} sx={{ mt: 4, py: 3 }}>
          <Stack spacing={2} alignItems="center">
            <Typography variant="body2" color="text.secondary">
              {`Trang ${paginatedMovies.page} / ${paginatedMovies.pages}`}
            </Typography>
            <Pagination
              count={paginatedMovies.pages}
              page={paginatedMovies.page}
              onChange={handlePageChange}
              color="primary"
              size="large"
              siblingCount={1}
              boundaryCount={2}
            />
          </Stack>
        </Paper>
      )}
    </Box>
  );
}
