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
  Button,
  Divider
} from '@mui/material';
import ReactPlayer from 'react-player';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { movieApi } from '../api';
import MovieCard from '../components/MovieCard';
import type { MovieDetail, VideoStream, Recommendations } from '../api';
import { useAuth } from '../contexts/AuthContext';

export default function MoviePage() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [videoStream, setVideoStream] = useState<VideoStream | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendations | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      if (!slug) return;
      
      try {
        const { data } = await movieApi.getMovie(slug);
        setMovie(data.movie);

        if (data.movie._id) {
          // Get video stream
          const stream = await movieApi.getVideoStream(data.movie._id);
          setVideoStream(stream);

          // Get recommendations
          const recs = await movieApi.getRecommendations(data.movie._id);
          setRecommendations(recs);

          // Add to watch history
          if (user) {
            await movieApi.addToWatchHistory(data.movie._id);
          }
        }
      } catch (error) {
        console.error('Error fetching movie:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [slug, user]);

  const handleFavoriteClick = async () => {
    if (!movie || !user) return;

    try {
      if (isFavorite) {
        await movieApi.removeFromFavorites(movie._id);
      } else {
        await movieApi.addToFavorites(movie._id);
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  };

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
    <Box sx={{ maxWidth: '1200px', mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {movie.title}
        {user && (
          <Button
            onClick={handleFavoriteClick}
            startIcon={isFavorite ? <Favorite /> : <FavoriteBorder />}
            sx={{ ml: 2 }}
          >
            {isFavorite ? 'Đã yêu thích' : 'Yêu thích'}
          </Button>
        )}
      </Typography>

      {/* Video Player */}
      {videoStream && (
        <Box sx={{ position: 'relative', paddingTop: '56.25%', mb: 3 }}>
          <ReactPlayer
            url={videoStream.url}
            controls
            width="100%"
            height="100%"
            style={{ position: 'absolute', top: 0, left: 0 }}
          />
        </Box>
      )}

      {/* Movie Info */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardMedia
              component="img"
              image={movie.thumbnail}
              alt={movie.title}
              sx={{ aspectRatio: '2/3' }}
            />
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="body1" paragraph>
            {movie.description}
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Thể loại:
            </Typography>
            {movie.genres?.map((genre) => (
              <Chip key={genre} label={genre} sx={{ mr: 1, mb: 1 }} />
            ))}
          </Box>
          <Typography variant="subtitle1" gutterBottom>
            Diễn viên: {movie.actors?.join(', ')}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Đạo diễn: {movie.directors?.join(', ')}
          </Typography>
          <Typography variant="subtitle1">
            Năm phát hành: {movie.year}
          </Typography>
        </Grid>
      </Grid>

      {/* Recommendations */}
      {recommendations && (
        <>
          <Divider sx={{ my: 4 }} />
          
          {/* Content-based recommendations */}
          <Typography variant="h5" gutterBottom>
            Phim tương tự
          </Typography>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {recommendations.contentBased.map((rec) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={rec._id}>
                <MovieCard
                  movie={rec}
                  isFavorite={false}
                />
              </Grid>
            ))}
          </Grid>

          {/* Collaborative recommendations */}
          {recommendations.collaborative.length > 0 && (
            <>
              <Typography variant="h5" gutterBottom>
                Có thể bạn sẽ thích
              </Typography>
              <Grid container spacing={2}>
                {recommendations.collaborative.map((rec) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={rec._id}>
                    <MovieCard
                      movie={rec}
                      isFavorite={false}
                    />
                  </Grid>
                ))}
              </Grid>
            </>
          )}
        </>
      )}
    </Box>
  );
}
