import { Movie } from './Movie';
//carousel type
export interface Carousel {
  title: string;
  movies: Movie[];
  showNumbers?: boolean;
  itemsPerSlide: number;
}
