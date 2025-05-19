import type { Movie } from '../api';

export interface MovieCardProps {
  movie: Movie;
  isFavorite?: boolean;
  onToggleFavorite?: () => void; // hoặc đổi sang onFavoriteClick nếu bạn chọn cách 2
}

