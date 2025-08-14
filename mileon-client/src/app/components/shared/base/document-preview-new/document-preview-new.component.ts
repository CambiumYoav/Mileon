import { HttpClient } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { ConstPath } from '../../../../constants/const_path';
import { BaseService } from '../../../../services/base.service';
import { PreviewFileType } from '../../../../types/previewFile';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-document-preview-new',
  templateUrl: './document-preview-new.component.html',
  styleUrls: ['./document-preview-new.component.scss'],
})
export class DocumentPreviewNewComponent implements OnInit, OnChanges {
  @Input()
  previewFile!: PreviewFileType;
  @Input() isDownoladable: boolean = false; // Allow download by default

  @Input()
  isFullPath!: boolean;

  @Output() deleteEvent = new EventEmitter<number>();

  baseImagePath!: string;
  safeUrl!: SafeUrl;
  finalFileUrl!: string;

  attachCircleIcon!: string;
  closeCircleIcon!: string;
  documentTextIcon!: string;
  exportIcon!: string;

  constructor(
    private sanitizer: DomSanitizer,
    private baseService: BaseService,
    private http: HttpClient
  ) {
    this.initializeFileUrl();
  }

  ngOnInit(): void {
    this.initIcons();
  }

  onDeleteIconClicked() {
    if (this.previewFile?.fileID) {
      // console.log(this.previewFile?.fileID);
      this.deleteEvent.emit(this.previewFile.fileID); // emit the fileId
    }
  }

  private initializeFileUrl() {
    if (!this.isFullPath) {
      this.baseImagePath = this.baseService?.mediaUrl;
      const pathUrl = this.previewFile?.path?.replace('media/', '');
      this.finalFileUrl = `${this.baseImagePath}${pathUrl}`;
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.finalFileUrl
      );
    } else {
      // console.log(this.previewFile.path);

      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.previewFile.path ?? ''
      );
    }
  }

  initIcons() {
    this.attachCircleIcon = ConstPath.ATTACH_CIRCLE;
    this.closeCircleIcon = ConstPath.CLOSE_CIRCLE;
    this.documentTextIcon = ConstPath.DOCUMENT_TEXT_ICON;
    this.exportIcon = ConstPath.EXPORT_DOCUMENT;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('previewFile' in changes) {
      this.initializeFileUrl();
    }
  }

  onDownloadFileClicked() {
    //Generally a good idea to encapsulate your HTTP Client.
    console.log(this.finalFileUrl);
    if (!this.isFullPath) {
      this.http
        .get(this.finalFileUrl, { responseType: 'blob' as 'json' })
        .subscribe((res: any) => {
          saveAs(res, this.previewFile.fileTypeTitle);
        });
    } else {
      const downloadLink = document.createElement('a');
      downloadLink.href = this.previewFile.path ?? '';
      downloadLink.download = this.previewFile.file?.name ?? '';
      downloadLink.click();

      // Clean up by revoking the object URL
      URL.revokeObjectURL(this.previewFile.path ?? '');
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
