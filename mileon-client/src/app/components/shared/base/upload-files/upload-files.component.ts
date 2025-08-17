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
import { DocumentPreviewNewComponent } from "../document-preview-new/document-preview-new.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-file-upload-new',
  templateUrl: './upload-files.component.html',
  styleUrls: ['./upload-files.component.scss'],
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileUploadNewComponent),
      multi: true,
    },
  ],
  imports: [DocumentPreviewNewComponent, CommonModule],
})
export class FileUploadNewComponent
  extends FormControlValueAccessorConnector
  implements OnInit, ControlValueAccessor
{
  @Input() override title: string = '';  
  @Input() documentTypes: IdValuePair[] = []; // Used for potential type categorization
  @Input() isDownoladable: boolean = false; // Allow download by default
  file: File | null | undefined;
  @Input() selectedFiles: UploadedFile[] = [];
  @Input() maxFileSizeMB?: number; // Default max file size is 10MB
  uploadDocumentSvg = ConstPath.UPLOAD_DOCUMENT2;
  previewFiles: PreviewFileType[] = [];
  fileID: number = 1; // Incremental ID for tracking uploaded files
  Icons = ConstPath;
  @Input() allowedFileTypes: FileType[] = [];
  isDragging = false;
  @Output() fileSelected = new EventEmitter<File>(); // Emit selected files
  @ViewChild('fileUpload') fileUpload!: ElementRef<HTMLInputElement>;
  @Input() containerSize: 'sm' | 'md' | 'lg' | string = 'md';
  @Input() disabled: boolean = false;
  currentUploadStatus: UploadStatus = UploadStatus.IDLE;
  currentErrorType: 'size' | 'type' | null = null;

  // Computed property to get the current icon based on upload status
  get getCurrentIcon(): string {
    switch (this.currentUploadStatus) {
      case UploadStatus.UPLOADING:
        return this.Icons.TIMER;
      case UploadStatus.SUCCESS:
        return this.Icons.TICK_CIRCLE;
      case UploadStatus.FAILED:
        return this.Icons.ERROR_CIRCLE;
      default:
        return this.Icons.UPLOAD_DOCUMENT2;
    }
  }

  // Computed property to get the current title text based on upload status
  get getCurrentTitleText(): string {
    switch (this.currentUploadStatus) {
      case UploadStatus.UPLOADING:
        return 'טוען קבצים...';
      case UploadStatus.SUCCESS:
        return 'הקבצים הועלו בהצלחה!';
      case UploadStatus.FAILED:
        return 'משהו השתבש... נסה שוב';
      default:
        return 'עיין בקבצים להעלאה';
    }
  }

  constructor(
    injector: Injector,
    private fileUploadService: FileUploadService,
    private toaster: ToastrService,
    private userService: UserService,
    private sessionService: SessionService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    if (this.selectedFiles && this.selectedFiles.length > 0) {
      this.previewFiles = this.selectedFiles.map((uploaded, index) => {
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
    }
  }

  onUploadButtonClick(): void {
    this.fileUpload.nativeElement.click();
  }

  handleFileInput() {
    this.file = this.fileUpload?.nativeElement?.files?.item(0);
    if (this.file) {
      // Set status to uploading
      this.currentUploadStatus = UploadStatus.UPLOADING;
      
      // Validate file type
      const fileType = this.file.type;
      if (
        this.allowedFileTypes.length > 0 &&
        !this.allowedFileTypes.includes(fileType as FileType)
      ) {
        this.currentErrorType = 'type';
        this.addFileToPreview(this.file, UploadStatus.FAILED);
        this.currentUploadStatus = UploadStatus.FAILED;
        this.toaster.error(ErrorSuccessMessages.FILE_TYPES_NOT_ALLOWED);
        return;
      }
      // Validate max file size (in bytes)

      const maxBytes = this.maxFileSizeMB
        ? this.maxFileSizeMB * 1024 * 1024
        : Infinity;
      if (this.file.size > maxBytes) {
        this.currentErrorType = 'size';
        this.addFileToPreview(this.file, UploadStatus.FAILED);
        this.currentUploadStatus = UploadStatus.FAILED;
        this.toaster.error(ErrorSuccessMessages.FILE_SIZE_NOT_ALLOWED);
        return;
      }

      console.log('Selected file:', this.file);
      // Add to preview
      this.addFileToPreview(this.file, UploadStatus.SUCCESS);
    }
  }

  addFileToPreview(file: File, status: UploadStatus = UploadStatus.SUCCESS): void {
    // Clear previous file
    this.previewFiles = [];

    const fileTypeTitle =
      file.name.split('.').pop()?.toLowerCase() || 'unknown';
    const url = URL.createObjectURL(file);

    this.previewFiles.push({
      path: url,
      fileTypeTitle,
      fileID: 1, // Only one file, ID can remain constant
      file,
    });
    
    // Set status based on parameter
    this.currentUploadStatus = status;
    
    this.fileSelected.emit(file); // Emit file event if needed
  }

  clearFileFromMemory(): void {
    this.file = null;
    if (this.fileUpload) {
      this.fileUpload.nativeElement.value = '';
    }
    // Reset status to idle when clearing file
    this.currentUploadStatus = UploadStatus.IDLE;
    this.currentErrorType = null;
  }

  deleteFile(fileID: number): void {
    this.previewFiles = this.previewFiles.filter(
      (file) => file.fileID !== fileID
    );
    
    // Reset status to idle when file is deleted
    this.currentUploadStatus = UploadStatus.IDLE;
    this.currentErrorType = null;
  }
}
