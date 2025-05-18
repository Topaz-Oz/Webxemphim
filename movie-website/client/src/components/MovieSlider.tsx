import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  IconButton,
  Typography,
  Paper,
  useTheme,
  alpha,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import type { Movie as MovieType } from '../api';

interface MovieSliderProps {
  movies: MovieType[];
}

export default function MovieSlider({ movies }: MovieSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const theme = useTheme();
  const navigate = useNavigate();

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? movies.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === movies.length - 1 ? 0 : prev + 1));
  };

  if (!movies.length) return null;

  const currentMovie = movies[currentIndex];

  return (
    <Paper 
      sx={{
        position: 'relative',
        height: { xs: 300, sm: 400, md: 500 },
        mb: 4,
        overflow: 'hidden',
        cursor: 'pointer',
      }}
      onClick={() => navigate(`/movie/${currentMovie.slug}`)}
    >
      <Box
        component="img"
        src={currentMovie.thumbnail}
        alt={currentMovie.title}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />

      {/* Gradient overlay */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '70%',
          background: `linear-gradient(to top, ${theme.palette.background.default} 0%, ${alpha(
            theme.palette.background.default,
            0
          )} 100%)`,
        }}
      />

      {/* Content */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          p: 3,
          color: 'white',
        }}
      >
        <Typography variant="h4" gutterBottom>
          {currentMovie.title}
        </Typography>
        {currentMovie.description && (
          <Typography
            variant="body1"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {currentMovie.description}
          </Typography>
        )}
      </Box>

      {/* Navigation buttons */}
      <IconButton
        sx={{
          position: 'absolute',
          left: 16,
          top: '50%',
          transform: 'translateY(-50%)',
          bgcolor: 'background.paper',
          '&:hover': { bgcolor: 'background.default' },
        }}
        onClick={(e) => {
          e.stopPropagation();
          handlePrevious();
        }}
      >
        <ChevronLeftIcon />
      </IconButton>

      <IconButton
        sx={{
          position: 'absolute',
          right: 16,
          top: '50%',
          transform: 'translateY(-50%)',
          bgcolor: 'background.paper',
          '&:hover': { bgcolor: 'background.default' },
        }}
        onClick={(e) => {
          e.stopPropagation();
          handleNext();
        }}
      >
        <ChevronRightIcon />
      </IconButton>
    </Paper>
  );
}
