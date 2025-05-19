import { 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  IconButton, 
  Box,
  Chip,
  Rating,
  CardActionArea,
  Tooltip
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { movieApi } from '../api';
import { useState } from 'react';

import type { MovieCardProps } from './types';

export default function MovieCard({ movie, isFavorite = false, onToggleFavorite }: MovieCardProps) {
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated || isLoading) return;
    setIsLoading(true);
    try {
      if (isFavorite) {
        await movieApi.removeFromFavorites(movie._id);
      } else {
        await movieApi.addToFavorites(movie._id);
      }
      if (onToggleFavorite) onToggleFavorite();
    } catch (error) {
      console.error('Error updating favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <Box sx={{ position: 'relative' }}>
        <CardActionArea component={RouterLink} to={`/movie/${movie.slug}`}>
          <CardMedia
            component="img"
            height="300"
            image={movie.thumbnail}
            alt={movie.title}
            sx={{ objectFit: 'cover' }}
          />
        </CardActionArea>
        {isAuthenticated && (
          <IconButton
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'background.paper',
              '&:hover': { bgcolor: 'background.default' },
            }}
            onClick={handleFavoriteClick}
            disabled={isLoading}
          >            <Tooltip title={isFavorite ? "Xóa khỏi danh sách yêu thích" : "Thêm vào yêu thích"}>
              {isFavorite ? (
                <FavoriteIcon color="error" />
              ) : (
                <FavoriteBorderIcon />
              )}
            </Tooltip>
          </IconButton>
        )}
      </Box>
      <CardContent>
        <Typography gutterBottom variant="h6" component="div" noWrap>
          {movie.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {movie.year}
        </Typography>
      </CardContent>
    </Card>
  );
}
