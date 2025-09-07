import { HttpClient } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ChangeDetectionStrategy,
  signal,
  computed,
  inject,
} from '@angular/core';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { ConstPath } from '../../../../constants/const_path';
import { BaseService } from '../../../../services/base.service';
import { PreviewFileType } from '../../../../types/previewFile';
import { saveAs } from 'file-saver';
import { UploadStatus } from '../../../../types/enum/uploadStatus.enum';
import { SharedImports } from '../../../../shared/shared-modules';

@Component({
  selector: 'app-document-preview-new',
  templateUrl: './document-preview-new.component.html',
  styleUrls: ['./document-preview-new.component.scss'],
  imports: [SharedImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class DocumentPreviewNewComponent implements OnInit, OnChanges {
  @Input()
  previewFile?: PreviewFileType;
  @Input() isDownoladable: boolean = false; // Allow download by default
  @Input() uploadStatus: UploadStatus = UploadStatus.IDLE;
  @Input() errorType: 'size' | 'type' | null = null;

  @Input()
  isFullPath!: boolean;

  @Output() deleteEvent = new EventEmitter<number>();

  private readonly _baseImagePath = signal<string>('');
  private readonly _safeUrl = signal<SafeUrl | null>(null);
  private readonly _finalFileUrl = signal<string>('');

  readonly baseImagePath = this._baseImagePath.asReadonly();
  readonly safeUrl = this._safeUrl.asReadonly();
  readonly finalFileUrl = this._finalFileUrl.asReadonly();

  private readonly _attachCircleIcon = signal<string>('');
  private readonly _closeCircleIcon = signal<string>('');
  private readonly _documentTextIcon = signal<string>('');
  private readonly _exportIcon = signal<string>('');
  private readonly _errorUploadIcon = signal<string>('');

  readonly attachCircleIcon = this._attachCircleIcon.asReadonly();
  readonly closeCircleIcon = this._closeCircleIcon.asReadonly();
  readonly documentTextIcon = this._documentTextIcon.asReadonly();
  readonly exportIcon = this._exportIcon.asReadonly();
  readonly errorUploadIcon = this._errorUploadIcon.asReadonly();

  private readonly sanitizer = inject(DomSanitizer);
  private readonly baseService = inject(BaseService);
  private readonly http = inject(HttpClient);
  
  constructor() {
    this.initializeFileUrl();
  }

  ngOnInit(): void {
    this.initIcons();
  }

  onDeleteIconClicked() {
    if (this.previewFile?.fileID) {
      this.deleteEvent.emit(this.previewFile.fileID);
    }
  }

  private initializeFileUrl() {
    if (!this.isFullPath) {
      const basePath = this.baseService?.mediaUrl || '';
      this._baseImagePath.set(basePath);
      const pathUrl = this.previewFile?.path?.replace('media/', '') || '';
      const finalUrl = `${basePath}${pathUrl}`;
      this._finalFileUrl.set(finalUrl);
      this._safeUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(finalUrl));
    } else {
      this._safeUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(
        this.previewFile?.path ?? ''
      ));
    }
  }

  initIcons() {
    this._attachCircleIcon.set(ConstPath.ATTACH_CIRCLE);
    this._closeCircleIcon.set(ConstPath.CLOSE_CIRCLE);
    this._documentTextIcon.set(ConstPath.DOCUMENT_TEXT_ICON);
    this._exportIcon.set(ConstPath.EXPORT_DOCUMENT);
    this._errorUploadIcon.set(ConstPath.ERROR_UPLOAD);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('previewFile' in changes) {
      this.initializeFileUrl();
    }
  }

  onDownloadFileClicked() {
    if (!this.isFullPath) {
      this.http
        .get(this.finalFileUrl(), { responseType: 'blob' as 'json' })
        .subscribe((res: any) => {
          saveAs(res, this.previewFile?.fileTypeTitle ?? '');
        });
    } else {
      const downloadLink = document.createElement('a');
      downloadLink.href = this.previewFile?.path ?? '';
      downloadLink.download = this.previewFile?.file?.name ?? '';
      downloadLink.click();

      // Clean up by revoking the object URL
      URL.revokeObjectURL(this.previewFile?.path ?? '');
    }
  }

  openFileForPrint(): void {
    const file = this.previewFile?.file;

    if (!file) return;

    // אם זה Blob או File רגיל
    const fileBlob = new Blob([file], { type: file.type || 'application/pdf' });
    const fileURL = URL.createObjectURL(fileBlob);

    // פותח בטאב חדש
    window.open(fileURL, '_blank');
  }
}
