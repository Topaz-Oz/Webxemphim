import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Chip,
  CircularProgress,
  Card,
  CardMedia,
} from '@mui/material';
import { movieApi } from '../api';
import MovieCard from '../components/MovieCard';
import type { MovieDetail, Movie } from '../api';

export default function MoviePage() {
  const { slug } = useParams<{ slug: string }>();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      if (!slug) return;
      
      try {
        const { data } = await movieApi.getMovie(slug);
        setMovie(data.movie);
        setSimilarMovies(data.similarMovies);
      } catch (error) {
        console.error('Error fetching movie:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [slug]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!movie) {
    return (
      <Typography variant="h5" color="error" align="center">
        Không tìm thấy phim
      </Typography>
    );
  }

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardMedia
              component="img"
              image={movie.thumbnail}
              alt={movie.title}
              sx={{ width: '100%', height: 'auto' }}
            />
          </Card>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Typography variant="h4" gutterBottom>
            {movie.title}
          </Typography>
          
          <Typography variant="body1" paragraph>
            {movie.description}
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Thể loại:
            </Typography>
            {movie.genres.map((genre) => (
              <Chip
                key={genre}
                label={genre}
                sx={{ mr: 1, mb: 1 }}
              />
            ))}
          </Box>
          
          <Typography variant="subtitle1" gutterBottom>
            Năm: {movie.year}
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Diễn viên:
            </Typography>
            {movie.actors.map((actor) => (
              <Chip
                key={actor}
                label={actor}
                variant="outlined"
                sx={{ mr: 1, mb: 1 }}
              />
            ))}
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Đạo diễn:
            </Typography>
            {movie.directors.map((director) => (
              <Chip
                key={director}
                label={director}
                variant="outlined"
                sx={{ mr: 1, mb: 1 }}
              />
            ))}
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ width: '100%', height: '600px' }}>
            <iframe
              src={movie.url}
              width="100%"
              height="100%"
              frameBorder="0"
              allowFullScreen
            />
          </Box>
        </Grid>

        {similarMovies.length > 0 && (
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              Phim tương tự
            </Typography>
            <Grid container spacing={3}>
              {similarMovies.map((similar) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={similar._id}>
                  <MovieCard
                    _id={similar._id}
                    title={similar.title}
                    thumbnail={similar.thumbnail}
                    slug={similar.slug}
                    year={similar.year}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
