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

interface SearchMovie {
  _id: string;
  title: string;
  slug: string;
  year: number;
}

export default function SearchBar() {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<SearchMovie[]>([]);
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
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };

    searchMovies();
  }, [debouncedSearch]);

  return (
    <Autocomplete
      options={options}
      getOptionLabel={(option: SearchMovie) => option.title}
      loading={loading}
      inputValue={inputValue}
      onInputChange={(_, newValue) => setInputValue(newValue)}
      onChange={(_, movie) => {
        if (movie) {
          navigate(`/movie/${movie.slug}`);
        }
      }}
      noOptionsText={
        <Typography color="text.secondary">
          {inputValue ? 'Không tìm thấy phim phù hợp' : 'Nhập tên phim để tìm kiếm'}
        </Typography>
      }
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
          sx={{
            width: { xs: '100%', sm: 300, md: 400 },
            '& .MuiInputBase-root': {
              borderRadius: 20,
              bgcolor: 'background.paper',
              '&:hover': {
                bgcolor: 'action.hover',
              },
            },
          }}
        />
      )}
      renderOption={(props, option: SearchMovie) => (
        <Box component="li" {...props}>
          <Typography>
            {option.title} ({option.year})
          </Typography>
        </Box>
      )}
    />
  );
}
