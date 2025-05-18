import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  IconButton,
  Typography,
  Paper,
  useTheme,
  alpha,
  Button,
  Chip,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  PlayArrow as PlayArrowIcon,
} from '@mui/icons-material';
import type { Movie as MovieType } from '../api';

interface MovieSliderProps {
  movies: MovieType[];
  autoPlay?: boolean;
  interval?: number;
}

export default function MovieSlider({ 
  movies, 
  autoPlay = true, 
  interval = 5000 
}: MovieSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      handleNext();
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, currentIndex]);

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
      }}
    >
      {/* Background Image */}
      <Box
        component="img"
        src={currentMovie.thumbnail}
        alt={currentMovie.title}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'brightness(0.7)',
        }}
      />

      {/* Movie Info Overlay */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          p: { xs: 2, sm: 3, md: 4 },
          background: `linear-gradient(to top, ${alpha(theme.palette.common.black, 0.8)}, transparent)`,
          color: 'white',
        }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold">
          {currentMovie.title}
        </Typography>
        
        {currentMovie.genres && (
          <Box sx={{ mb: 2 }}>
            {currentMovie.genres.map((genre) => (
              <Chip
                key={genre}
                label={genre}
                sx={{
                  mr: 1,
                  mb: 1,
                  color: 'white',
                  borderColor: 'white',
                  '& .MuiChip-label': { px: 2 },
                }}
                variant="outlined"
              />
            ))}
          </Box>
        )}

        {currentMovie.description && (
          <Typography
            variant="body1"
            sx={{
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {currentMovie.description}
          </Typography>
        )}

        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<PlayArrowIcon />}
          onClick={() => navigate(`/movie/${currentMovie.slug}`)}
          sx={{ mr: 2 }}
        >
          Xem phim
        </Button>
      </Box>

      {/* Navigation Arrows */}
      <IconButton
        onClick={handlePrevious}
        sx={{
          position: 'absolute',
          left: 16,
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'white',
          backgroundColor: alpha(theme.palette.common.black, 0.4),
          '&:hover': {
            backgroundColor: alpha(theme.palette.common.black, 0.6),
          },
        }}
      >
        <ChevronLeftIcon />
      </IconButton>

      <IconButton
        onClick={handleNext}
        sx={{
          position: 'absolute',
          right: 16,
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'white',
          backgroundColor: alpha(theme.palette.common.black, 0.4),
          '&:hover': {
            backgroundColor: alpha(theme.palette.common.black, 0.6),
          },
        }}
      >
        <ChevronRightIcon />
      </IconButton>

      {/* Navigation Dots */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 1,
        }}
      >
        {movies.map((_, index) => (
          <Box
            key={index}
            onClick={() => setCurrentIndex(index)}
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: index === currentIndex ? 'primary.main' : 'white',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
              '&:hover': {
                backgroundColor: 'primary.light',
              },
            }}
          />
        ))}
      </Box>
    </Paper>
  );
}
