export class MediaGallery {
  items: GalleryItem[];
}

export class GalleryItem {
  image?: string;
  video?: string;
  thumbImage?: string;
  posterImage?: string; //Optional: You can use this key if you want to show video poster image in slide
  alt?: string;
  title?: string;
  order?: number;

  constructor() {
    // this.thumbImage = args?.thumbImage;
    // this.posterImage = args?.posterImage;
    // this.alt = args?.alt;
    // this.title = args?.title;
    // this.order = args?.order;
  }
}

export interface Dimensions {
  width?: string;
  height?: string;
  space?: number;
}

export type Direction = 'ltr' | 'rtl' | 'auto';
