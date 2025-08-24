import { Directive, ElementRef, Input, OnInit, Renderer2, HostListener, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appTruncatedTextTooltip]',
  standalone: true
})
export class TruncatedTextTooltipDirective implements OnInit, OnDestroy {
  @Input() tooltipText: string = '';
  @Input() maxWidth: number = 200; // Default max width
  
  private tooltipElement: HTMLElement | null = null;
  private isTooltipVisible = false;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    // If no tooltip text provided, use the element's text content
    if (!this.tooltipText) {
      this.tooltipText = this.el.nativeElement.textContent?.trim() || '';
    }
    
    this.checkTruncation();
  }

  ngOnDestroy(): void {
    this.hideTooltip();
  }

  @HostListener('mouseenter')
  onMouseEnter(): void {
    if (this.isTextTruncated()) {
      this.showTooltip();
    }
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.hideTooltip();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.checkTruncation();
  }

  private checkTruncation(): void {
    const element = this.el.nativeElement;
    const isTruncated = this.isTextTruncated();
    
    if (isTruncated) {
      this.renderer.setAttribute(element, 'title', this.tooltipText);
    } else {
      this.renderer.removeAttribute(element, 'title');
    }
  }

  private isTextTruncated(): boolean {
    const element = this.el.nativeElement;
    
    // Check if element is visible
    if (!element.offsetWidth || !element.offsetHeight) {
      return false;
    }
    
    const computedStyle = window.getComputedStyle(element);
    const elementWidth = element.offsetWidth;
    const textWidth = this.getTextWidth(element.textContent || '', computedStyle.font);
    
    return textWidth > elementWidth || elementWidth > this.maxWidth;
  }

  private getTextWidth(text: string, font: string): number {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (context) {
      context.font = font;
      return context.measureText(text).width;
    }
    return 0;
  }

  private showTooltip(): void {
    if (this.isTooltipVisible || !this.tooltipText) return;

    this.tooltipElement = this.renderer.createElement('div');
    this.renderer.addClass(this.tooltipElement, 'custom-select-tooltip');
    this.renderer.setStyle(this.tooltipElement, 'position', 'fixed');
    this.renderer.setStyle(this.tooltipElement, 'z-index', '9999');
    this.renderer.setStyle(this.tooltipElement, 'background', '#EDF9FF');
    this.renderer.setStyle(this.tooltipElement, 'color', '#181818');
    this.renderer.setStyle(this.tooltipElement, 'padding', '12px 16px'); 
    this.renderer.setStyle(this.tooltipElement, 'border-radius', '8px');
    this.renderer.setStyle(this.tooltipElement, 'font-size', '16px');
    this.renderer.setStyle(this.tooltipElement, 'max-width', '300px');
    this.renderer.setStyle(this.tooltipElement, 'word-wrap', 'break-word');
    this.renderer.setStyle(this.tooltipElement, 'white-space', 'normal');
    this.renderer.setStyle(this.tooltipElement, 'direction', 'rtl');
    this.renderer.setStyle(this.tooltipElement, 'text-align', 'right');
    
    this.renderer.appendChild(this.tooltipElement, this.renderer.createText(this.tooltipText));
    this.renderer.appendChild(document.body, this.tooltipElement);
    
    this.positionTooltip();
    this.isTooltipVisible = true;
  }

  private hideTooltip(): void {
    if (this.tooltipElement && this.isTooltipVisible) {
      this.renderer.removeChild(document.body, this.tooltipElement);
      this.tooltipElement = null;
      this.isTooltipVisible = false;
    }
  }

  private positionTooltip(): void {
    if (!this.tooltipElement) return;

    const elementRect = this.el.nativeElement.getBoundingClientRect();
    const tooltipRect = this.tooltipElement.getBoundingClientRect();
    
    let left = elementRect.left + (elementRect.width / 2) - (tooltipRect.width / 2);
    let top = elementRect.top - tooltipRect.height - 8;
    
    // Ensure tooltip doesn't go off-screen
    if (left < 8) left = 8;
    if (left + tooltipRect.width > window.innerWidth - 8) {
      left = window.innerWidth - tooltipRect.width - 8;
    }
    if (top < 8) {
      top = elementRect.bottom + 8;
    }
    
    // Use fixed positioning values
    this.renderer.setStyle(this.tooltipElement, 'left', `${left}px`);
    this.renderer.setStyle(this.tooltipElement, 'top', `${top}px`);
  }
}
