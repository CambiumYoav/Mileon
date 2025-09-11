import {Component, ElementRef, Renderer2, input, effect, inject} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {ColorsHex} from "../../../types/enum/colors.enum";

@Component({
  selector: 'app-svg-icon',
  template: '',
  standalone: true
})
export class SvgIconComponent {
  // Signal-based inputs
  src = input<string>('');
  selected = input<boolean>(false);
  strokeColor = input<string>('');
  defaultStrokeColor = input<string>(ColorsHex.CyanBlueAzure);

  private el = inject(ElementRef);
  private renderer = inject(Renderer2);
  private http = inject(HttpClient);

  constructor() {
    // Use effect to react to input changes
    effect(() => {
      const srcValue = this.src();
      const selectedValue = this.selected();
      const strokeColorValue = this.strokeColor();
      const defaultStrokeColorValue = this.defaultStrokeColor();

      if (srcValue) {
        this.loadSvg();
      }
      
      if (selectedValue !== undefined) {
        this.updateStrokeColor(selectedValue ? strokeColorValue : defaultStrokeColorValue);
      }
    });
  }



  private loadSvg(): void {
    const srcValue = this.src();
    if (!srcValue) return;

    this.http.get(srcValue, { responseType: 'text' }).subscribe(svgContent => {
      this.renderer.setProperty(this.el.nativeElement, 'innerHTML', svgContent);
      const selectedValue = this.selected();
      if (selectedValue) {
        const strokeColorValue = this.strokeColor();
        const defaultStrokeColorValue = this.defaultStrokeColor();
        this.updateStrokeColor(selectedValue ? strokeColorValue : defaultStrokeColorValue);
      }
    });
  }

  private updateStrokeColor(color: string): void {
    const paths = this.el.nativeElement.querySelectorAll('path');
    paths.forEach((path: Element) => {
      this.renderer.setAttribute(path, 'stroke', color);
    });
  }
}
