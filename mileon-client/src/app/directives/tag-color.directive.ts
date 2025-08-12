import { AppService } from '../app.service';
import { StatusService } from '../services/status.service';
import { Directive, ElementRef, HostBinding, Input, OnInit } from '@angular/core';

@Directive({
  selector: 'div[appTagColor]',
  standalone: true
})
export class TagColorDirective implements OnInit {
  @Input() appTagColor: string = '';

  constructor(
    private el: ElementRef,
    private statusService: StatusService,
    private appService: AppService
  ) {}

  ngOnInit() {
    this.changeColor();
  }

  private changeColor() {
    if (this.appTagColor && this.appService.currentModuleName) {
      const statusId = parseInt(this.appTagColor);
      const moduleStatuses = this.statusService.StatusesTypes[this.appService.currentModuleName];
      
      if (moduleStatuses && moduleStatuses[statusId]) {
        const status = moduleStatuses[statusId];
        this.el.nativeElement.style.backgroundColor = status.bgColor;
        this.el.nativeElement.style.color = status.textColor;
      }
    }
  }
}
