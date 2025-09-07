import {
  Component,
  ElementRef,
  HostListener,
  input,
  output,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'app-dropdown-window',
  templateUrl: './dropdown-window.component.html',
  styleUrls: ['./dropdown-window.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownWindowComponent {
  // Signal-based inputs
  searchBarWidth = input<string>('auto');

  // Signal-based outputs
  closeDropdownEvent = output<void>();

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    // Check if the click event occurred outside the component's element
    const target = event.target as HTMLElement;
    if (
      !this.elementRef.nativeElement.contains(target) &&
      !(target.id === 'filter-icon') &&
      !Object.values(event.composedPath()).some(
        (v) => !!(v as HTMLElement).className?.includes('cdk-overlay')
      )
    ) {
      // Close or hide the component here
      this.closeDropdownEvent.emit();
    }
  }
}
