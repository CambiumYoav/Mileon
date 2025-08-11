import { Directive, ElementRef, Renderer2, OnChanges } from '@angular/core';
import { Input } from '@angular/core';
import { Base64 } from '../types/base64';

@Directive({
  selector: '[appLoader]',
})
export class LoaderDirective implements OnChanges {
  @Input('appLoader') isLoading: boolean = false;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges() {
    if (this.isLoading) {
      this.showLoader();
    } else {
      this.hideLoader();
    }
  }

  private showLoader() {
    this.renderer.setStyle(this.el.nativeElement, 'position', 'relative');
    this.renderer.setStyle(this.el.nativeElement, 'opacity', '0.6');
    const loader = this.renderer.createElement('img');
    this.renderer.addClass(loader, 'loader');
    this.renderer.setAttribute(loader, 'src', Base64.Loader);
    this.renderer.appendChild(this.el.nativeElement, loader);
  }

  private hideLoader() {
    const loader = this.el.nativeElement.querySelector('.loader');
    this.renderer.removeStyle(this.el.nativeElement, 'position');
    this.renderer.removeStyle(this.el.nativeElement, 'opacity');
    if (loader) {
      this.renderer.removeChild(this.el.nativeElement, loader);
    }
  }
}
