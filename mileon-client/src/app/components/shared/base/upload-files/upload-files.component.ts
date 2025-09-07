import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Injector,
  Input,
  OnInit,
  Output,
  ViewChild,
  ChangeDetectionStrategy,
  signal,
  computed,
  inject,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ConstPath } from '../../../../constants/const_path';
import { FileUploadService } from '../../../../services/file-upload.service';
import { FileType } from '../../../../types/enum/fileType.enum';
import { UploadStatus } from '../../../../types/enum/uploadStatus.enum';
import { IdValuePair } from '../../../../types/legalRequest/legal-request-file-type-response';
import { PreviewFileType } from '../../../../types/previewFile';
import { UploadedFile } from '../../../../types/uploadedFile';
import { FormControlValueAccessorConnector } from '../../abstract/form-control-value-accessor-connector.component';
import { ToastrService } from 'ngx-toastr';
import { ErrorSuccessMessages } from '../../../../types/enum/error-success-messages';
import { UserService } from '../../../../services/user.service';
import { SessionService } from '../../../../services/session.service';
import { SharedImports } from '../../../../shared/shared-modules';
import { DocumentPreviewNewComponent } from "../document-preview-new/document-preview-new.component";

@Component({
  selector: 'app-file-upload-new',
  templateUrl: './upload-files.component.html',
  styleUrls: ['./upload-files.component.scss'],
  imports: [SharedImports, DocumentPreviewNewComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileUploadNewComponent),
      multi: true,
    },
  ],
})
export class FileUploadNewComponent
  extends FormControlValueAccessorConnector
  implements OnInit, ControlValueAccessor
{
  @Input() override title: string = '';  
  @Input() documentTypes: IdValuePair[] = []; // Used for potential type categorization
  @Input() isDownoladable: boolean = false; // Allow download by default
  @Input() selectedFiles: UploadedFile[] = [];
  @Input() maxFileSizeMB?: number; // Default max file size is 10MB
  @Input() allowedFileTypes: FileType[] = [];
  @Input() containerSize: 'sm' | 'md' | 'lg' | string = 'md';
  @Input() disabled: boolean = false;
  @Output() fileSelected = new EventEmitter<File>(); // Emit selected files
  @ViewChild('fileUpload') fileUpload!: ElementRef<HTMLInputElement>;

  // Angular 19 signals for reactive state management
  private readonly _file = signal<File | null | undefined>(null);
  private readonly _previewFiles = signal<PreviewFileType[]>([]);
  private readonly _fileID = signal<number>(1);
  private readonly _isDragging = signal<boolean>(false);
  private readonly _currentUploadStatus = signal<UploadStatus>(UploadStatus.IDLE);
  private readonly _currentErrorType = signal<'size' | 'type' | null>(null);

  // Computed signals for reactive properties
  readonly file = this._file.asReadonly();
  readonly previewFiles = this._previewFiles.asReadonly();
  readonly fileID = this._fileID.asReadonly();
  readonly isDragging = this._isDragging.asReadonly();
  readonly currentUploadStatus = this._currentUploadStatus.asReadonly();
  readonly currentErrorType = this._currentErrorType.asReadonly();

  // Constants
  readonly uploadDocumentSvg = ConstPath.UPLOAD_DOCUMENT2;
  readonly Icons = ConstPath;

  // Computed signals for reactive properties
  readonly getCurrentIcon = computed(() => {
    switch (this.currentUploadStatus()) {
      case UploadStatus.UPLOADING:
        return this.Icons.TIMER;
      case UploadStatus.SUCCESS:
        return this.Icons.TICK_CIRCLE;
      case UploadStatus.FAILED:
        return this.Icons.ERROR_CIRCLE;
      default:
        return this.Icons.UPLOAD_DOCUMENT2;
    }
  });

  readonly getCurrentTitleText = computed(() => {
    switch (this.currentUploadStatus()) {
      case UploadStatus.UPLOADING:
        return 'טוען קבצים...';
      case UploadStatus.SUCCESS:
        return 'הקבצים הועלו בהצלחה!';
      case UploadStatus.FAILED:
        return 'משהו השתבש... נסה שוב';
      default:
        return 'עיין בקבצים להעלאה';
    }
  });

  // Injected services using Angular 19 inject() function
  private readonly fileUploadService = inject(FileUploadService);
  private readonly toaster = inject(ToastrService);
  private readonly userService = inject(UserService);
  private readonly sessionService = inject(SessionService);

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    if (this.selectedFiles && this.selectedFiles.length > 0) {
      const previewFiles = this.selectedFiles.map((uploaded, index) => {
        const fileTypeTitle =
          uploaded.file.name.split('.').pop()?.toLowerCase() || 'unknown';
        const url = URL.createObjectURL(uploaded.file);

        return {
          path: url,
          fileTypeTitle,
          fileID: index + 1,
          file: uploaded.file,
        };
      });
      this._previewFiles.set(previewFiles);
    }
  }

  onUploadButtonClick(): void {
    this.fileUpload.nativeElement.click();
  }

  handleFileInput() {
    const file = this.fileUpload?.nativeElement?.files?.item(0);
    this._file.set(file);
    if (file) {
      // Set status to uploading
      this._currentUploadStatus.set(UploadStatus.UPLOADING);
      
      // Validate file type
      const fileType = file.type;
      if (
        this.allowedFileTypes.length > 0 &&
        !this.allowedFileTypes.includes(fileType as FileType)
      ) {
        this._currentErrorType.set('type');
        this.addFileToPreview(file, UploadStatus.FAILED);
        this._currentUploadStatus.set(UploadStatus.FAILED);
        this.toaster.error(ErrorSuccessMessages.FILE_TYPES_NOT_ALLOWED);
        return;
      }
      // Validate max file size (in bytes)

      const maxBytes = this.maxFileSizeMB
        ? this.maxFileSizeMB * 1024 * 1024
        : Infinity;
      if (file.size > maxBytes) {
        this._currentErrorType.set('size');
        this.addFileToPreview(file, UploadStatus.FAILED);
        this._currentUploadStatus.set(UploadStatus.FAILED);
        this.toaster.error(ErrorSuccessMessages.FILE_SIZE_NOT_ALLOWED);
        return;
      }
      
      this.addFileToPreview(file, UploadStatus.SUCCESS);
    }
  }

  addFileToPreview(file: File, status: UploadStatus = UploadStatus.SUCCESS): void {
    // Clear previous file
    this._previewFiles.set([]);

    const fileTypeTitle =
      file.name.split('.').pop()?.toLowerCase() || 'unknown';
    const url = URL.createObjectURL(file);

    const newPreviewFile = {
      path: url,
      fileTypeTitle,
      fileID: 1, // Only one file, ID can remain constant
      file,
    };
    
    this._previewFiles.set([newPreviewFile]);
    
    // Set status based on parameter
    this._currentUploadStatus.set(status);
    
    this.fileSelected.emit(file); // Emit file event if needed
  }

  clearFileFromMemory(): void {
    this._file.set(null);
    if (this.fileUpload) {
      this.fileUpload.nativeElement.value = '';
    }
    // Reset status to idle when clearing file
    this._currentUploadStatus.set(UploadStatus.IDLE);
    this._currentErrorType.set(null);
  }

  deleteFile(fileID: number): void {
    const currentFiles = this.previewFiles();
    const filteredFiles = currentFiles.filter(
      (file) => file.fileID !== fileID
    );
    this._previewFiles.set(filteredFiles);
    
    // Reset status to idle when file is deleted
    this._currentUploadStatus.set(UploadStatus.IDLE);
    this._currentErrorType.set(null);
  }

  /**
   * TrackBy function for preview files - creates unique identifier
   */
  trackByFileId(index: number, file: PreviewFileType): any {
    return file.fileID || index;
  }
}
