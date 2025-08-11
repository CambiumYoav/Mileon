// import { AppService } from 'src/app/app.service';
// import { StatusService } from 'src/app/services/status.service';
// import { Directive, ElementRef, HostBinding, Input } from '@angular/core';

// @Directive({
//   selector: 'div[appTagColor]',
// })
// export class TagColorDirective {
//   @Input() appTagColor: string = '';

//   constructor(
//     private el: ElementRef,
//     private statusService: StatusService,
//     private appService: AppService
//   ) {
//     this.changeColor(this.el);
//   }

//   @HostBinding('value') get textColor() {
//     return '';
//   }

//   changeColor(el: ElementRef) {
//     setTimeout(() => {
//       if (this.appTagColor) {
//         el.nativeElement.style.color =
//           this.statusService.StatusesTypes[this.appService.currentModuleName][
//             this.appTagColor
//           ].textColor;
//         el.nativeElement.style.backgroundColor =
//           this.statusService.StatusesTypes[this.appService.currentModuleName][
//             this.appTagColor
//           ].bgColor;
//       }
//     });
//   }
// }
