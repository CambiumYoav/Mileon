import { Component, Input, Output, EventEmitter, Type, ViewChild, ViewContainerRef, ComponentRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConstPath } from '../../../constants/const_path';
import { ButtonComponent } from '../base/button/button.component';

export interface ModalButton {
  label: string;
  action: () => void;
  buttonClass?: string;
}

export interface GenericModalConfig {
  title: string;
  message?: string;
  component?: Type<any>;
  componentData?: any;
  buttons?: ModalButton[];
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  hideExitIcon?: boolean;
}

@Component({
  selector: 'app-generic-modal',
  templateUrl: './generic-modal.component.html',
  styleUrls: ['./generic-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, ButtonComponent],
})
export class GenericModalComponent implements OnInit, OnDestroy {
  @Input() isModalOpen: boolean = false;
  @Input() config: GenericModalConfig = {
    title: '',
    size: 'md'
  };
  @Output() modalClosed = new EventEmitter<void>();
  @Output() componentEvent = new EventEmitter<any>();

  @ViewChild('componentContainer', { read: ViewContainerRef, static: true }) 
  componentContainer!: ViewContainerRef;

  Icons = ConstPath;
  private componentRef?: ComponentRef<any>;

  ngOnInit(): void {
    if (this.isModalOpen && this.config.component) {
      this.loadComponent();
    }
  }

  ngOnDestroy(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }

  ngOnChanges(): void {
    if (this.isModalOpen && this.config.component) {
      this.loadComponent();
    }
  }

  private loadComponent(): void {
    if (this.componentContainer && this.config.component) {
      // Clear previous component
      this.componentContainer.clear();
      
      // Create new component
      this.componentRef = this.componentContainer.createComponent(this.config.component);
      
      // Pass data to component if provided
      if (this.config.componentData) {
        Object.assign(this.componentRef.instance, this.config.componentData);
      }

      // Listen to component events
      if (this.componentRef.instance.formSubmitted) {
        this.componentRef.instance.formSubmitted.subscribe((data: any) => {
          this.componentEvent.emit({ type: 'formSubmitted', data });
        });
      }

      if (this.componentRef.instance.formCancelled) {
        this.componentRef.instance.formCancelled.subscribe(() => {
          this.componentEvent.emit({ type: 'formCancelled' });
        });
      }
    }
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.modalClosed.emit();
  }

  buttonClicked(button: ModalButton): void {
    button.action();
  }

  getModalSizeClass(): string {
    switch (this.config.size) {
      case 'sm': return 'modal-sm';
      case 'lg': return 'modal-lg';
      case 'xl': return 'modal-xl';
      case 'full': return 'modal-full';
      default: return 'modal-md';
    }
  }
}
