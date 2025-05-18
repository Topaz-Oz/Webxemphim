import { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  CircularProgress,
  Alert
} from '@mui/material';
import MovieCard from '../components/MovieCard';
import { movieApi } from '../api';
import type { Movie } from '../api';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchFavorites = async () => {
    try {
      const { data } = await movieApi.getFavorites();
      setFavorites(data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setError('Không thể tải danh sách phim yêu thích');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleFavoriteChange = (movieId: string, isFavorite: boolean) => {
    if (!isFavorite) {
      setFavorites(prev => prev.filter(movie => movie._id !== movieId));
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Phim Yêu Thích
      </Typography>

      {favorites.length === 0 ? (
        <Typography color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
          Bạn chưa thêm phim nào vào danh sách yêu thích
        </Typography>
      ) : (
        <>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            {`${favorites.length} phim`}
          </Typography>

          <Box sx={{ 
            display: 'grid', 
            gap: 3,
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)'
            }
          }}>
            {favorites.map((movie) => (
              <MovieCard
                key={movie._id}
                movie={movie}
                isFavorite={true}
                onFavoriteClick={() => handleFavoriteChange(movie._id, false)}
              />
            ))}
          </Box>
        </>
      )}
    </Box>
  );
}
