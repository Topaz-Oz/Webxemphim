import type { Movie } from '../api';

export interface MovieCardProps {
  movie: Movie;
  onFavoriteClick?: () => void;
  isFavorite?: boolean;
}
