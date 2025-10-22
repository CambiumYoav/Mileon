import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  ViewChild,
  OnDestroy,
  AfterViewInit,
  OnChanges,
  signal,
  computed,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { CkEditorService } from '../../../services/ck-editor.service';

@Component({
  selector: 'app-ck-editor-wrapper',
  templateUrl: './ck-editor-wrapper.component.html',
  styleUrls: ['./ck-editor-wrapper.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class CkEditorWrapperComponent implements OnDestroy, AfterViewInit, OnChanges {
  @Input() value: string = '';
  @Input() size: string = '';
  @Input() isSelecting: boolean = false;
  @Input() config: any = {};
  @Input() hasError: boolean = false;

  @Output() valueChange = new EventEmitter<string>();

  @ViewChild('editorContainer', { static: false })
  editorContainer!: ElementRef<HTMLElement>;
  @ViewChild('toolbarContainer', { static: false })
  toolbarContainer!: ElementRef<HTMLElement>;

  private readonly _isInitializing = signal<boolean>(false);
  private readonly _isDestroyed = signal<boolean>(false);
  private readonly _toolbarMoved = signal<boolean>(false);

  readonly isInitializing = computed(() => this._isInitializing());
  readonly isDestroyed = computed(() => this._isDestroyed());
  readonly toolbarMoved = computed(() => this._toolbarMoved());

  editorInstance: any;
  private toolbarStyleSheet: CSSStyleSheet | null = null;

  private readonly ckLoader = inject(CkEditorService);

  constructor() {
    this.ckLoader.triggerPreload();
  }

  async ngAfterViewInit() {
    if (this.isSelecting && !this.isDestroyed()) {
      await this.initializeEditor();
    }
  }

  private async destroyEditor(): Promise<void> {
    if (this.editorInstance) {
      try {
        await this.editorInstance.destroy();
        console.log('Editor destroyed successfully');
      } catch (error) {
        console.error('Error destroying editor:', error);
      } finally {
        this.editorInstance = null;
        this._toolbarMoved.set(false);
      }
    }

    const container = this.editorContainer?.nativeElement;
    if (container) {
      container.innerHTML = '';
      while (container.attributes.length > 0) {
        container.removeAttribute(container.attributes[0].name);
      }
      container.className = 'editor-wrapper';
    }

    const toolbarContainer = this.toolbarContainer?.nativeElement;
    if (toolbarContainer) {
      toolbarContainer.innerHTML = '';
      toolbarContainer.className = 'tool-bar-container';
    }
  }

  private createToolbarStylesheet(): void {
    if (!this.toolbarStyleSheet) {
      const style = document.createElement('style');
      style.id = 'ck-editor-toolbar-styles';
      document.head.appendChild(style);
      this.toolbarStyleSheet = style.sheet as CSSStyleSheet;

      const rules = [
        '.tool-bar-container .ck-toolbar { display: flex !important; flex-wrap: wrap !important; align-items: center !important; position: relative !important; }',
        '.tool-bar-container .ck-button { display: inline-flex !important; align-items: center !important; }',
        '.tool-bar-container .ck-dropdown { display: inline-block !important; position: relative !important; }',
        '.tool-bar-container .ck-toolbar__separator { display: inline-block !important; }',
        '.tool-bar-container .ck-dropdown__panel { position: absolute !important; z-index: 9999 !important; }',
      ];

      rules.forEach((rule) => {
        try {
          this.toolbarStyleSheet?.insertRule(rule);
        } catch (e) {
          console.warn('Could not insert CSS rule:', rule);
        }
      });
    }
  }

  private async initializeEditor(): Promise<void> {
    if (this.isInitializing()) {
      console.warn('Editor initialization already in progress');
      return;
    }

    const container = this.editorContainer?.nativeElement;
    const toolbarContainer = this.toolbarContainer?.nativeElement;

    if (!container || !toolbarContainer) {
      console.warn('Editor containers not ready yet.');
      return;
    }

    if (this.editorInstance) {
      await this.destroyEditor();
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    this._isInitializing.set(true);

    try {
      this.createToolbarStylesheet();

      const Editor = await this.ckLoader.loadEditor();

      if (this.isDestroyed()) {
        console.log('Component destroyed while loading editor');
        return;
      }
      const toolbarCfg = Array.isArray(this.config.toolbar)
        ? { items: this.config.toolbar }
        : { ...(this.config.toolbar || {}) };

      this.editorInstance = await Editor.create(container, {
        ...this.config,
        toolbar: {
          shouldNotGroupWhenFull: false, //add 3 dots
          ...toolbarCfg,
        },
      });

      await new Promise((resolve) => setTimeout(resolve, 200));

      if (this.isDestroyed()) {
        return;
      }

      this.moveToolbarToContainer(toolbarContainer);

      if (this.value) {
        this.editorInstance.setData(this.value);
      }

      this.updateErrorStyling();

      this.editorInstance.model.document.on('change:data', () => {
        if (!this.isDestroyed()) {
          const data = this.editorInstance.getData();
          this.valueChange.emit(data);
        }
      });

      console.log('CKEditor initialized successfully');
    } catch (error) {
      console.error('CKEditor initialization failed:', error);
      await this.destroyEditor();
    } finally {
      this._isInitializing.set(false);
    }
  }

  private moveToolbarToContainer(toolbarContainer: HTMLElement): void {
    if (!this.editorInstance) return;

    const toolbarEl = this.editorInstance.ui.view.toolbar.element;
    if (!toolbarEl) return;

    toolbarContainer.innerHTML = '';

    if (toolbarEl.parentElement) {
      toolbarEl.parentElement.removeChild(toolbarEl);
    }

    toolbarContainer.appendChild(toolbarEl);
    this._toolbarMoved.set(true);

    toolbarEl.style.display = 'flex';
    toolbarEl.style.width = '100%';
    toolbarEl.style.position = 'relative';

    const dropdownPanels = toolbarEl.querySelectorAll('.ck-dropdown__panel');
    dropdownPanels.forEach((panel: Element) => {
      (panel as HTMLElement).style.zIndex = '9999';
    });

    setTimeout(() => {
      toolbarContainer.offsetHeight;
    }, 0);
  }

  private updateErrorStyling(): void {
    if (!this.editorInstance) return;

    const editableElement = this.editorInstance.ui.getEditableElement();
    if (!editableElement) return;

    if (this.hasError) {
      editableElement.classList.add('ck-error');
    } else {
      editableElement.classList.remove('ck-error');
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isSelecting']) {
      if (this.isSelecting && !this.isDestroyed()) {
        setTimeout(() => {
          if (!this.isDestroyed()) {
            this.initializeEditor();
          }
        }, 0);
      } else if (!this.isSelecting) {
        this.destroyEditor();
      }
    }

    if (changes['hasError'] && this.editorInstance) {
      this.updateErrorStyling();
    }

    if (
      changes['value'] &&
      this.editorInstance &&
      !changes['value'].firstChange
    ) {
      const currentData = this.editorInstance.getData();
      if (currentData !== this.value) {
        this.editorInstance.setData(this.value || '');
      }
    }
  }

  async ngOnDestroy() {
    this._isDestroyed.set(true);
    await this.destroyEditor();

    const styleEl = document.getElementById('ck-editor-toolbar-styles');
    if (styleEl) {
      styleEl.remove();
    }

    this.toolbarStyleSheet = null;
  }
}
