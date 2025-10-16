// import { Direction } from '@angular/cdk/bidi';
// import {
//   Component,
//   ElementRef,
//   EventEmitter,
//   Input,
//   OnInit,
//   Output,
//   Renderer2,
//   ViewChild,
// } from '@angular/core';
// import { FileTypes } from '../../../../constants/file-type.enum';
// import { Dimensions, MediaGallery, GalleryItem } from '../../../../types/media-gallery.model';
// import { Utils } from '../../../../utils/utils';
// import { CORE_IMPORTS } from '../../../../shared/shared-modules';
// // import { NgImageSliderComponent } from 'ng-image-slider'; // Adjust the import path if necessary

// @Component({
//   selector: 'app-media-gallery',
//   templateUrl: './media-gallery.component.html',
//   styleUrls: ['./media-gallery.component.scss'],
//   imports:[CORE_IMPORTS]
// })
// export class MediaGalleryComponent implements OnInit {
//   _data: any[]=[];

//   get data(): any[] {
//     return this._data;
//   }

//   @Input() set data(value: any[]) {
//     this._data = value;
//     // this.buildGallery(value);
//   }

//   currentIndex: number=0;

//   @Input()
//   useTitles: boolean = false;

//   @Input()
//   autoPlay: boolean = false;

//   @Input()
//   imagePopup: boolean = true;

//   @Input()
//   direction: Direction = 'ltr';

//   @Input()
//   paginationShow: boolean = false;

//   @Input()
//   animationSpeed: number = 1;

//   @Input()
//   infinite: boolean = false;

//   @Input()
//   arrowKeyMove: boolean = true;

//   @Input()
//   showVideoControls: boolean = true;

//   @Input()
//   showArrow: boolean = false;

//   @Input()
//   manageImageRatio: boolean = true;

//   @Input()
//   lazyLoading: boolean = false;

//   @Input()
//   imageSize: Dimensions = { width: '205px', height: '200px', space: 3 };

//   @Output() close = new EventEmitter<any>();
//   @Output() lightboxArrowClick = new EventEmitter<any>();
//   @Output() imageClick = new EventEmitter<any>();
//   @Output() prevImage = new EventEmitter<any>();
//   @Output() nextImage = new EventEmitter<any>();

//   // @ViewChild('nav') slider: NgImageSliderComponent;

//   galleryObj: MediaGallery = {
//     items: [
//       // {
//       //   image: 'https://d3pe2doddq0g20.cloudfront.net/media/violation/car2.PNG',
//       //   thumbImage:
//       //     'https://d3pe2doddq0g20.cloudfront.net/media/violation/car2.PNG',
//       //   alt: 'alt of image',
//       //   title: 'number 1',
//       //   order: 1,
//       // },
//       // {
//       //   image: 'https://d3pe2doddq0g20.cloudfront.net/media/violation/car2.PNG',
//       //   thumbImage:
//       //     'https://d3pe2doddq0g20.cloudfront.net/media/violation/car2.PNG',
//       //   alt: 'alt of image',
//       //   title: 'number 2',
//       // },
//       // {
//       //   video:
//       //     'https://sanjayv.github.io/ng-image-slider/contents/assets/video/movie2.mp4',
//       //   posterImage:
//       //     'https://slotuniverses.co.uk/wp-content/uploads/sites/12030/upload_fed1091b34dcf8203c0729c4faa62315.png',
//       //   title: 'number 6',
//       //   order: 2,
//       // },
//     ],
//   };

//   constructor() {}

//   ngOnInit(): void {}

//   // buildGallery(mediaFiles: File[]) {
//   //   // NOTE 😐 written o.k but not as good as should be
//   //   this.galleryObj.items = mediaFiles.map((file) => {
//   //     const item = new GalleryItem();
//   //     item.title = file.title;
//   //     const fileTypeName =
//   //       Utils.getEnumKeyByValue(FileTypes, file.fileTypeID).toLowerCase() ||
//   //       ('' as keyof GalleryItem);
//   //     item[fileTypeName as keyof GalleryItem] = file.fullPath;
//   //     if (item.image) item.thumbImage = file.fullPath;
//   //     else item.posterImage = file.fullPath;
//   //     return item;
//   //   });
//   // }

//   // emitEvent(eventName: string, event: any) {
//   //   if (this[eventName]) this[eventName].emit(event);
//   // }
// }
// import { Component, Input, ViewEncapsulation } from '@angular/core';
// import { GalleryModule, GalleryItem, ImageItem, VideoItem } from 'ng-gallery';
// import { CORE_IMPORTS } from '../../../../shared/shared-modules';

// @Component({
//   selector: 'app-media-gallery',
//   standalone: true,
//   imports: [CORE_IMPORTS, GalleryModule],
//   template: `
//     <gallery [items]="items"></gallery>
//   `,
//   styleUrls: ['./media-gallery.component.scss'],
//   encapsulation: ViewEncapsulation.None
// })
// export class MediaGalleryComponent {
//   @Input() set data(value: any[]) {
//     console.log(value);
//     this.items = (value ?? []).map(v =>
//       v.video
//         ? new VideoItem({ src: v.video, thumb: v.poster || v.thumb })
//         : new ImageItem({ src: v.image || v.url, thumb: v.thumb || v.image || v.url })
//     );
//   }
//   items: GalleryItem[] = [];
// }
//REVIEW - rewritten using Swiper web component

import { Direction } from '@angular/cdk/bidi';
import {
  Component, Input, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { CORE_IMPORTS } from '../../../../shared/shared-modules';

type GalleryItem = {
  image?: string;         // image URL
  thumbImage?: string;    // optional thumb
  video?: string;         // video URL (mp4)
  posterImage?: string;   // poster for video
  alt?: string;
  title?: string;
  order?: number;
};

@Component({
  selector: 'app-media-gallery',
  standalone: true,
  imports: [CORE_IMPORTS],
  template: `
    <swiper-container
      *ngIf="gallery.items.length"
      [attr.dir]="direction"
      [attr.loop]="infinite ? 'true' : 'false'"
      [attr.navigation]="showArrow ? 'true' : 'false'"
      [attr.pagination]="paginationShow ? 'true' : 'false'"
      [attr.autoplay]="autoPlay ? 'true' : 'false'"
      [attr.autoplay-delay]="autoPlay ? autoplayDelay : null"
      [attr.speed]="animationSpeedMs"
      [attr.space-between]="imageSize?.space || 3"
      [attr.slides-per-view]="'1'"
      [attr.preload-images]="lazyLoading ? 'false' : 'true'"
      [attr.lazy]="lazyLoading ? 'true' : null"
      (slidechange)="onSlideChange($event)"
    >
      <swiper-slide *ngFor="let item of gallery.items; let i = index">
        <ng-container *ngIf="item.image; else videoTpl">
          <img
            [src]="item.image"
            [alt]="item.alt || item.title || ('image ' + i)"
            [style.width]="imageSize?.width"
            [style.height]="imageSize?.height"
            [attr.loading]="lazyLoading ? 'lazy' : null"
            (click)="onImageClicked(item, i)"
          />
        </ng-container>

        <ng-template #videoTpl>
          <video
            *ngIf="item.video"
            [poster]="item.posterImage || ''"
            [style.width]="imageSize?.width"
            [style.height]="imageSize?.height"
            [attr.controls]="showVideoControls ? true : null"
            [attr.preload]="lazyLoading ? 'metadata' : 'auto'"
          >
            <source [src]="item.video" type="video/mp4" />
          </video>
        </ng-template>
      </swiper-slide>
    </swiper-container>
  `,
  styleUrls: ['./media-gallery.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MediaGalleryComponent {
  /** Incoming raw data -> map it to gallery.items yourself as needed */
  private _data: any[] = [];
  get data(): any[] { return this._data; }

  @Input() set data(value: any[]) {
    this._data = value ?? [];
    // map incoming data → GalleryItem[]
    this.gallery.items = this.mapToGalleryItems(this._data);
  }

  @Input() useTitles = false;
  @Input() autoPlay = false;
  @Input() imagePopup = true;                   // kept for parity; lightbox not implemented here
  @Input() direction: Direction = 'ltr';
  @Input() paginationShow = false;
  /** seconds (like before). Will convert to ms for Swiper speed */
  @Input() animationSpeed = 1;
  @Input() infinite = false;
  @Input() arrowKeyMove = true;                 // Swiper handles keys globally if enabled; left as a flag for future
  @Input() showVideoControls = true;
  @Input() showArrow = false;
  @Input() manageImageRatio = true;             // handled by CSS
  @Input() lazyLoading = false;
  @Input() imageSize: { width: string; height: string; space: number } = { width: '205px', height: '200px', space: 3 };

  /** Autoplay delay (ms) if autoPlay=true */
  @Input() autoplayDelay = 2500;

  @Output() close = new EventEmitter<any>();
  @Output() lightboxArrowClick = new EventEmitter<any>(); // we’ll emit on slide direction change
  @Output() imageClick = new EventEmitter<any>();
  @Output() prevImage = new EventEmitter<any>();
  @Output() nextImage = new EventEmitter<any>();

  currentIndex = 0;
  private previousIndex = 0;

  gallery: { items: GalleryItem[] } = { items: [] };

  get animationSpeedMs(): number {
    // keep old API (seconds) but convert for Swiper (ms)
    const ms = Math.max(100, Math.floor(this.animationSpeed * 1000));
    return ms;
  }

  onSlideChange(e: Event) {
    // Swiper Element dispatches CustomEvent with detail containing swiper instance
    const detail = (e as CustomEvent).detail;
    // Some versions resemble: detail[0].activeIndex; handle both
    const swiper = Array.isArray(detail) ? detail[0] : detail?.swiper || detail;
    const newIndex = swiper?.activeIndex ?? this.currentIndex;

    const goingNext = newIndex > this.previousIndex;
    const goingPrev = newIndex < this.previousIndex;

    if (goingNext) {
      this.nextImage.emit({ index: newIndex, item: this.gallery.items[newIndex] });
      this.lightboxArrowClick.emit({ direction: 'next', index: newIndex });
    } else if (goingPrev) {
      this.prevImage.emit({ index: newIndex, item: this.gallery.items[newIndex] });
      this.lightboxArrowClick.emit({ direction: 'prev', index: newIndex });
    }

    this.previousIndex = this.currentIndex;
    this.currentIndex = newIndex;
  }

  onImageClicked(item: GalleryItem, index: number) {
    this.imageClick.emit({ item, index });
  }

  /** Map your incoming data objects to GalleryItem[] (adjust to your real shape) */
  private mapToGalleryItems(arr: any[]): GalleryItem[] {
    // Example mapper – adjust as needed:
    // If your items already have `image` | `video` fields, you can just return them.
    return (arr ?? []).map((f, i) => {
      const gi: GalleryItem = {};
      if (f.video) {
        gi.video = f.video;
        gi.posterImage = f.poster || f.thumbImage || '';
      } else {
        gi.image = f.image || f.fullPath || f.url;
        gi.thumbImage = f.thumbImage || f.image || f.fullPath || f.url;
      }
      gi.title = f.title ?? `#${i + 1}`;
      gi.alt = f.alt ?? gi.title;
      gi.order = f.order ?? i;
      return gi;
    });
  }
}
