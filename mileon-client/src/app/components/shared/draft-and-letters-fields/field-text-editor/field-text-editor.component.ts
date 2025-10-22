import {
  Component,
  ElementRef,
  Input,
  ViewChild,
  OnDestroy,
  OnInit,
  AfterViewInit,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  signal,
  computed,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MentionService } from './../../../../services/mention.service';
import { CkEditorConfig } from '../../../../types/ck-editor/ck-editor-config';
import { DynamicFieldSize } from '../../../../types/enum/infrastructureTablesEnum';
import { DynamicField } from '../../../../types/infrastructure/InfrastructureTypes';
import { ButtonComponent } from "../../base/button/button.component";
import { SelectedTemplateTextComponent } from "../selected-template-text/selected-template-text.component";
import { CkEditorWrapperComponent } from "../../ck-editor-wrapper/ck-editor-wrapper.component";

@Component({
  selector: 'app-field-text-editor',
  templateUrl: './field-text-editor.component.html',
  styleUrls: ['./field-text-editor.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    SelectedTemplateTextComponent,
    CkEditorWrapperComponent
],
})
export class FieldTextEditorComponent
  implements OnInit, OnDestroy, AfterViewInit, OnChanges
{
  @Input() field!: DynamicField;
  @Input() form!: FormGroup;
  @Input() textData: string | null = null;
  @Output() editorDataChange = new EventEmitter<string>();

  private readonly _isSelecting = signal<boolean>(false);
  private readonly _editorData = signal<any>(null);
  private readonly _hasData = signal<boolean>(false);
  private readonly _pendingDataToLoad = signal<string | null>(null);

  readonly isSelecting = computed(() => this._isSelecting());
  readonly editorData = computed(() => this._editorData());
  readonly hasData = computed(() => this._hasData());
  readonly pendingDataToLoad = computed(() => this._pendingDataToLoad());

  editorInstance: any;

  private readonly mentionService = inject(MentionService);
  config = new CkEditorConfig().textFieldConfig;

  @ViewChild('toolbarContainer', { static: false })
  toolbarContainer!: ElementRef<HTMLElement>;
  @ViewChild('editorContainer', { static: false })
  editorContainer!: ElementRef<HTMLElement>;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['textData']) {
      this._editorData.set(this.textData);
      this._hasData.set(!!this.textData && this.textData.trim() !== '');
    }
  }
  async ngAfterViewInit() {}

  async ngOnInit() {
    if (!this.field.size) {
      this.field.size = DynamicFieldSize.Regular;
    }
  }

  ngOnDestroy() {
    if (this.editorInstance) {
      this.editorInstance.destroy().catch(console.error);
      this.editorInstance = null;
      this._editorData.set(null);
      this._hasData.set(false);
    }
  }

  async startSelecting() {
    this._isSelecting.set(true);
  }

  saveSelection() {
    this._isSelecting.set(false);
  }

  editData(e: any) {
    if (e) {
      this._pendingDataToLoad.set(this.editorData());
      this.startSelecting();
    }
  }

  emitChangedData(data: any) {
    this._editorData.set(data);
    this._hasData.set(true);
    this.editorDataChange.emit(data);
  }
}
