import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }  return config;
});

// Common response type for API calls
interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface MovieListResponse {
  movies: Movie[];
  page: number;
  pages: number;
  total: number;
}

export interface Movie {
  _id: string;
  title: string;
  thumbnail: string;
  slug: string;
  year: number;
  description?: string;
  genres?: string[];
  actors?: string[];
  directors?: string[];
  views?: number;
  updatedAt?: string;
}

export interface MovieDetail extends Movie {
  description: string;
  genres: string[];
  actors: string[];
  directors: string[];
  url: string;
}

export interface AdminMovie extends Movie {
  views: number;
  updatedAt: string;
}

export interface VideoStream {
  url: string;
  quality: string;
  type: string;
}

export interface Recommendations {
  contentBased: Movie[];
  collaborative: Movie[];
}

// Movie APIs
export const movieApi = {  // Public endpoints
  getMovies: (page = 1, limit = 20, category?: string) => 
    api.get<MovieListResponse>(`/movies?page=${page}&limit=${limit}${category ? `&category=${category}` : ''}`),
  getFeaturedMovies: () => 
    api.get<ApiResponse<Movie[]>>('/movies/featured'),
  getMovie: (slug: string) => 
    api.get<{ movie: MovieDetail, similarMovies: Movie[] }>(`/movies/${slug}`),
  searchMovies: (query: string) => 
    api.get<Movie[]>(`/movies/search?q=${query}`),

  // Authenticated endpoints
  getFavorites: () => 
    api.get<Movie[]>('/movies/favorites'),
  addToFavorites: (movieId: string) => 
    api.post(`/movies/favorites/${movieId}`),
  removeFromFavorites: (movieId: string) => 
    api.delete(`/movies/favorites/${movieId}`),

  // Admin endpoints
  syncMovies: () => 
    api.post('/movies/sync'),
  deleteMovie: (movieId: string) => 
    api.delete(`/movies/${movieId}`),

  // New endpoints
  getRecommendations: async (movieId?: string): Promise<Recommendations> => {
    const params = movieId ? { movieId } : {};
    const response = await api.get('/movies/recommendations', { params });
    return response.data;
  },

  getVideoStream: async (movieId: string): Promise<VideoStream> => {
    const response = await api.get(`/movies/${movieId}/stream`);
    return response.data;
  },

  addToWatchHistory: async (movieId: string): Promise<void> => {
    await api.post(`/movies/watch-history/${movieId}`);
  },
};

export const authApi = {
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  register: (username: string, email: string, password: string) => 
    api.post('/auth/register', { username, email, password }),
  getProfile: () => api.get('/auth/profile'),
};

export default api;
