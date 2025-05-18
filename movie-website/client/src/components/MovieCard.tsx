import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  CardActionArea,
  IconButton,
  Box,
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

interface MovieCardProps {
  _id: string;
  title: string;
  thumbnail: string;
  slug: string;
  year?: number;
  isFavorite?: boolean;
  onFavoriteChange?: (id: string, isFavorite: boolean) => void;
}

export default function MovieCard({ 
  _id,
  title, 
  thumbnail, 
  slug, 
  year,
  isFavorite = false,
  onFavoriteChange
}: MovieCardProps) {
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [favorite, setFavorite] = useState(isFavorite);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    if (!isAuthenticated || isLoading) return;

    setIsLoading(true);
    try {
      if (favorite) {
        await movieApi.removeFromFavorites(_id);
      } else {
        await movieApi.addToFavorites(_id);
      }
      setFavorite(!favorite);
      if (onFavoriteChange) {
        onFavoriteChange(_id, !favorite);
      }
    } catch (error) {
      console.error('Error updating favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <Box sx={{ position: 'relative' }}>
        <CardActionArea component={RouterLink} to={`/movie/${slug}`}>
          <CardMedia
            component="img"
            height="300"
            image={thumbnail}
            alt={title}
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
          >
            <Tooltip title={favorite ? "Xóa khỏi danh sách yêu thích" : "Thêm vào yêu thích"}>
              {favorite ? (
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
          {title}
        </Typography>
        {year && (
          <Typography variant="body2" color="text.secondary">
            Năm: {year}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
