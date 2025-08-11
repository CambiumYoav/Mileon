import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { Base64 } from '../types/base64';

@Directive({
  selector: '[appButtonLoader]',
})
export class ButtonLoaderDirective {
  @Input('appButtonLoader') isLoading: boolean = false;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(): void {
    if (this.isLoading) {
      this.showLoader();
    } else {
      this.hideLoader();
    }
  }

  private showLoader(): void {
    this.renderer.setAttribute(this.el.nativeElement, 'disabled', 'true');
    const loader = this.renderer.createElement('img');
    this.renderer.addClass(loader, 'button-loader');
    this.renderer.setAttribute(loader, 'src', Base64.ButtonLoader);
    this.renderer.insertBefore(
      this.el.nativeElement,
      loader,
      this.el.nativeElement.firstChild
    ); // in order to prepend as first child
  }

  private hideLoader(): void {
    const loader = Array.from(this.el.nativeElement.children).filter((e) =>
      (e as HTMLElement).className.includes('button-loader')
    )[0]; // find loader in current element
    if (loader) {
      this.renderer.removeChild(this.el.nativeElement, loader);
      this.renderer.removeAttribute(this.el.nativeElement, 'disabled');
      this.renderer.removeStyle(this.el.nativeElement, 'opacity');
    }
  }
}
