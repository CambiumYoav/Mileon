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
  effect,
} from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { ConstPath } from '../../../../constants/const_path';
import { BaseService } from '../../../../services/base.service';
import { PreviewFileType } from '../../../../types/previewFile';
import { saveAs } from 'file-saver';
import { UploadStatus } from '../../../../types/enum/uploadStatus.enum';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//NOTE -  need to fix it by the old code 
@Component({
  selector: 'app-document-preview-new',
  templateUrl: './document-preview-new.component.html',
  styleUrls: ['./document-preview-new.component.scss'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
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
  private readonly _isDownloading = signal<boolean>(false);
  private readonly _downloadError = signal<string | null>(null);

  readonly attachCircleIcon = this._attachCircleIcon.asReadonly();
  readonly closeCircleIcon = this._closeCircleIcon.asReadonly();
  readonly documentTextIcon = this._documentTextIcon.asReadonly();
  readonly exportIcon = this._exportIcon.asReadonly();
  readonly errorUploadIcon = this._errorUploadIcon.asReadonly();
  readonly isDownloading = this._isDownloading.asReadonly();
  readonly downloadError = this._downloadError.asReadonly();

  private readonly sanitizer = inject(DomSanitizer);
  private readonly baseService = inject(BaseService);
  private readonly http = inject(HttpClient);

  // Computed signals for better performance
  readonly canDownload = computed(() => this.isDownoladable && !this.isDownloading());
  readonly hasError = computed(() => this.downloadError() !== null || this.errorType !== null);
  readonly fileDisplayName = computed(() => this.previewFile?.fileTypeTitle ?? 'Unknown File');
  readonly fileType = computed(() => this.previewFile?.file?.type ?? 'unknown');
  readonly isImageFile = computed(() => {
    const type = this.fileType();
    return type.startsWith('image/');
  });
  readonly isPdfFile = computed(() => this.fileType() === 'application/pdf');
  
  constructor() {
    this.initializeFileUrl();
    
    // Effect to react to preview file changes
    effect(() => {
      if (this.previewFile) {
        this.initializeFileUrl();
      }
    });
  }

  ngOnInit(): void {
    this.initIcons();
  }

  onDeleteIconClicked() {
    if (this.previewFile?.fileID) {
      this.deleteEvent.emit(this.previewFile.fileID);
    }
  }

  clearDownloadError() {
    this._downloadError.set(null);
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

  async onDownloadFileClicked() {
    if (!this.isFullPath) {
      try {
        this._isDownloading.set(true);
        this._downloadError.set(null);
        
        const res = await firstValueFrom(
          this.http.get(this.finalFileUrl(), { responseType: 'blob' })
        );
        
        saveAs(res as Blob, this.fileDisplayName());
      } catch (error) {
        console.error('Download failed:', error);
        this._downloadError.set('Failed to download file');
      } finally {
        this._isDownloading.set(false);
      }
    } else {
      try {
        this._isDownloading.set(true);
        this._downloadError.set(null);
        
        const downloadLink = document.createElement('a');
        downloadLink.href = this.previewFile?.path ?? '';
        downloadLink.download = this.previewFile?.file?.name ?? '';
        downloadLink.click();

        // Clean up by revoking the object URL
        URL.revokeObjectURL(this.previewFile?.path ?? '');
      } catch (error) {
        console.error('Download failed:', error);
        this._downloadError.set('Failed to download file');
      } finally {
        this._isDownloading.set(false);
      }
    }
  }

  openFileForPrint(): void {
    const file = this.previewFile?.file;

    if (!file) return;

    try {
      // Create blob with proper MIME type
      const fileBlob = new Blob([file], { 
        type: file.type || this.fileType() || 'application/pdf' 
      });
      const fileURL = URL.createObjectURL(fileBlob);

      // Open in new tab
      window.open(fileURL, '_blank');
      
      // Clean up the object URL after a delay to allow the browser to load it
      setTimeout(() => {
        URL.revokeObjectURL(fileURL);
      }, 1000);
    } catch (error) {
      console.error('Failed to open file for print:', error);
    }
  }
}
