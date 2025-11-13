
import {
  Component,
  Inject,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';
import { RouterService } from '../../../services/router.service';
import { MenuItem } from '../../../types/base/menu.model';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import type { SwiperOptions } from 'swiper/types';

@Component({
  selector: 'app-sub-modules',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sub-modules.component.html',
  styleUrl: './sub-modules.component.scss',
})
export class SubModulesComponent implements AfterViewInit {
  @ViewChild('swiperEl', { static: false })
  swiperEl?: ElementRef<HTMLDivElement>;

  module: MenuItem | null = null;
  private swiper?: Swiper;

  private readonly swiperOptions: SwiperOptions = {
    modules: [Navigation, Pagination],
    slidesPerView: 6,
    spaceBetween: 10,
    loop: false,
    centeredSlides: false,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: { el: '.swiper-pagination', clickable: true },
    breakpoints: {
      1024: { slidesPerView: 4, spaceBetween: 25 },
      1520: { slidesPerView: 6, spaceBetween: 25 },
    },
  };

  constructor(
    private bottomSheetRef: MatBottomSheetRef<SubModulesComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) private data: any,
    private routerService: RouterService
  ) {
    this.module = data.module as MenuItem;
  }

  ngAfterViewInit() {
    if (this.swiperEl?.nativeElement) {
      this.swiper = new Swiper(this.swiperEl.nativeElement, this.swiperOptions);
    }
  }

  navigateTo(subModule: MenuItem) {
    this.routerService.navigateToUrl(
      [subModule.path],
      true,
      subModule.state,
      subModule.queryParams
    );
    this.close();
  }

  close() {
    this.bottomSheetRef.dismiss();
  }
}
