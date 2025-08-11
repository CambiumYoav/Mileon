import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appStatusColors]'
})
export class StatusColorsDirective {

  @Input() index: number=0;

  colors = ['#19A58C', '#FF824D', '#FF0000', '#387EC4', '#FFB800', '#6F36F4 ', '#FF47B5']
  backgroundColors = ['#D4F8D3', '#FFDDCE', '#FBE7E9', '#D3F0FF', '#FFF9C6', '#EDE7FB', '#FFE6F9']

  constructor(el: ElementRef) {
    this.changeColor(el)
 }

 changeColor(el: ElementRef) {
   setInterval(() => {
    el.nativeElement.style.color = this.colors[this.index - 1]
    el.nativeElement.style.backgroundColor = this.backgroundColors[this.index - 1]
   }, 1);
 }
}
