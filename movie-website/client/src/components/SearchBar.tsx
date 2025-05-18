import { useState, useEffect } from 'react';
import {
  TextField,
  Autocomplete,
  Box,
  CircularProgress,
  Typography,
  InputAdornment,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { movieApi } from '../api';
import { useDebounce } from '../hooks/useDebounce';

interface Movie {
  _id: string;
  title: string;
  thumbnail: string;
  slug: string;
  year: number;
}

export default function SearchBar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  
  const debouncedSearch = useDebounce(inputValue, 300);

  useEffect(() => {
    if (!debouncedSearch) {
      setOptions([]);
      return;
    }

    const searchMovies = async () => {
      setLoading(true);
      try {
        const { data } = await movieApi.searchMovies(debouncedSearch);
        setOptions(data);
      } catch (error) {
        console.error('Error searching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    searchMovies();
  }, [debouncedSearch]);

  return (
    <Autocomplete<Movie>
      id="movie-search"
      sx={{ width: 300 }}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      isOptionEqualToValue={(option, value) => option._id === value._id}
      filterOptions={(x) => x}
      options={options}
      loading={loading}
      getOptionLabel={(option) => option.title}
      onChange={(_, movie) => {
        if (movie) {
          navigate(`/movie/${movie.slug}`);
        }
      }}
      onInputChange={(_, value) => setInputValue(value)}
      noOptionsText="Không tìm thấy phim"
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Tìm kiếm phim..."
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderOption={(props, movie) => (
        <Box component="li" {...props}>
          <Box sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
            <Box
              component="img"
              sx={{ width: 50, height: 70, mr: 2, objectFit: 'cover' }}
              src={movie.thumbnail}
              alt={movie.title}
            />
            <Box>
              <Typography variant="body1">{movie.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {movie.year}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    />
  );
}
