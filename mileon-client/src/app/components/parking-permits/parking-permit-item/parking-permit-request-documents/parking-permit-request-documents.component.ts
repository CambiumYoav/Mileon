import {
  Component,
  ElementRef,
  ViewChild,
  inject,
  signal,
  computed,
  effect,
  afterNextRender,
  DestroyRef,
} from '@angular/core';
import { ConfirmationModalComponent } from '../../../shared/confirmation-modal/confirmation-modal.component';
import { ButtonComponent } from '../../../shared/base/button/button.component';
import { ActionButtonsComponent } from '../../../shared/action-buttons/action-buttons.component';
import { SecondaryHeaderComponent } from '../../../shared/secondary-header/secondary-header.component';
import { DocumentPreviewNewComponent } from '../../../shared/base/document-preview-new/document-preview-new.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ActionButtonNames } from '../../../../constants/action_buttons';
import { ConstPath } from '../../../../constants/const_path';
import { ModalMessages } from '../../../../constants/modalMessages';
import { ErrorSuccessMessages } from '../../../../types/enum/error-success-messages';
import { ModuleEnum } from '../../../../types/enum/moduleEnum';
import { IdValuePair } from '../../../../types/legalRequest/legal-request-file-type-response';
import { MyRef } from '../../../../types/myRef';
import {
  PermitFiles,
  ParkingPermitFile,
} from '../../../../types/parkingPermit/parkingPermitFile';
import { ParkingPermitFileType } from '../../../../types/parkingPermit/parkingPermitFileType';
import { ParkingPermitsService } from '../../parking-permits.service';
import { ParkingPermitScansImportComponent } from '../../parking-permit-create-flow/parking-permit-scans-import/parking-permit-scans-import.component';

interface PreviewFile {
  fileID?: number;
  fileTypeTitle: string;
  path: string;
  file: File;
  typeId: number;
  _key?: string;
}

@Component({
  selector: 'app-parking-permit-request-documents',
  standalone: true,
  imports: [
    ConfirmationModalComponent,
    ButtonComponent,
    ActionButtonsComponent,
    SecondaryHeaderComponent,
    DocumentPreviewNewComponent,
  ],
  templateUrl: './parking-permit-request-documents.component.html',
  styleUrl: './parking-permit-request-documents.component.scss',
})
export class ParkingPermitRequestDocumentsComponent {
  // Inject dependencies
  private readonly parkingPermitService = inject(ParkingPermitsService);
  private readonly route = inject(ActivatedRoute);
  public readonly dialog = inject(MatDialog);
  private readonly toaster = inject(ToastrService);
  private readonly destroyRef = inject(DestroyRef);

  // ViewChild references
  @ViewChild('fileUpload') fileUpload!: ElementRef<HTMLInputElement>;
  @ViewChild('actionButtonsComponent', { static: false })
  actionButtonsComponent!: ActionButtonsComponent;

  // Constants
  readonly ModalMessages = ModalMessages;
  readonly Icons = ConstPath;
  readonly moduleEnum = ModuleEnum;
  readonly actionButtonsList: ActionButtonNames[] = [
    'SendToPhone',
    'SendEmail',
    'PrintToPDF',
  ];

  // Signals for reactive state
  permitFiles = signal<PermitFiles>([]);
  parkingPermitId = signal<string>('');
  permitTypeId = signal<number>(0);
  parkingPermitNumber = signal<string>('');
  authorityID = signal<string>('');
  parkingPermitDocumentTypes = signal<IdValuePair[]>([]);
  selectedFileTypeChoice = signal<string>('');
  file = signal<File | null>(null);
  fileTypes = signal<ParkingPermitFileType[]>([]);
  fileIdToDelete = signal<number | null>(null);
  isDeleteModalOpen = signal<boolean>(false);
  // previewFiles = signal<PermitFiles[]>([]);
  previewFiles = signal<any[]>([]);
  filesByType = signal<Map<number, File>>(new Map());
  secondaryHeaderTitle = signal<string>('');
  uploadDocumentTitle = signal<string>('העלאת קובץ');

  // Computed signals
  scansData = computed(() => {
    const mappedFiles: ParkingPermitFile[] = Array.from(
      this.filesByType().entries()
    ).map(([key, value]) => ({
      parkingPermitFilesTypeID: key,
      file: value,
    }));

    return {
      parkingPermitFiles: mappedFiles,
    };
  });

  hasScansToUpload = computed(() => {
    return this.scansData().parkingPermitFiles.length > 0;
  });

  // References for action buttons
  emailAddress: MyRef<string> = { current: '' };
  phoneNumber: MyRef<string> = { current: '' };

  // Track by function for template
  trackByPreview = (_: number, p: PreviewFile) => p.fileID ?? p._key ?? p.path;

  constructor() {
    // Use afterNextRender for view initialization logic
    afterNextRender(() => {
      this.loadData();
      this.toggleButtons(false);
    });
  }

  toggleButtons(btnStatus: boolean): void {
    if (this.actionButtonsComponent) {
      this.actionButtonsComponent.toggleDisabled(
        this.actionButtonsList,
        btnStatus
      );
    }
  }

  async loadData(): Promise<void> {
    const id = this.route.parent?.snapshot.params['id'];
    this.parkingPermitId.set(id);

    try {
      const files = await this.parkingPermitService.getParkingPermitFilesById(
        id
      );
      this.permitFiles.set(files || []);

      // Map to preview files
      const previews: any[] = (files || []).map((f:any) => ({
        fileID: f.fileID,
        fileTypeTitle: f.fileTypeTitle,
        path: f.path,
        file: new File([], f.fileTypeTitle),
        typeId: f.typeId,
      }));
      this.previewFiles.set(previews);
    } catch (error) {
      console.error('Error loading permit files:', error);
      this.toaster.error(ErrorSuccessMessages.SOMETHING_WENT_WRONG_TRY_LATER);
    }

    await this.fetchPermitNumberAndAuthority();
    await this.getFileTypes();
  }

  async getFileTypes(): Promise<void> {
    try {
      const res = await this.parkingPermitService.getPermitFileTypesById(
        this.permitTypeId()
      );
      if (res) {
        this.fileTypes.set(res);
      }
    } catch (error) {
      console.error('Error fetching file types:', error);
    }
  }

  async fetchPermitNumberAndAuthority(): Promise<void> {
    const id = this.parkingPermitId();
    if (!id) return;

    try {
      const res = await this.parkingPermitService.getParkingPermitById(id);
      this.parkingPermitNumber.set(res.parkingPermitNumber);
      this.secondaryHeaderTitle.set(
        ` צפייה בקבצי תו מס ${res.parkingPermitNumber}`
      );
      this.authorityID.set(res.authorityID);
      this.permitTypeId.set(res.permitTypeID);
    } catch (error) {
      console.error('Error fetching permit details:', error);
      this.toaster.error(ErrorSuccessMessages.SOMETHING_WENT_WRONG_TRY_LATER);
    }
  }

  async uploadAllScans(): Promise<void> {
    const scans = this.scansData();
    if (!scans.parkingPermitFiles.length) return;

    const uploads = scans.parkingPermitFiles.map(async (p) => {
      const body = {
        parkingPermitID: this.parkingPermitId(),
        parkingPermitFilesTypeID: p.parkingPermitFilesTypeID,
        file: p.file,
      };

      try {
        const res = await this.parkingPermitService.uploadFileParkingPermit(
          body
        );
        if (res) {
          this.toaster.success(ErrorSuccessMessages.FILE_UPLOAD_SUCCESS);
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        this.toaster.error(ErrorSuccessMessages.SOMETHING_WENT_WRONG_TRY_LATER);
      }
    });

    await Promise.all(uploads);
  }

  clearFileFromMemory(): void {
    this.file.set(null);
    if (this.fileUpload) {
      this.fileUpload.nativeElement.value = '';
    }
  }

  openDialogImport(): void {
    // Uncomment and update when implementing the import dialog
    
    const dialogRef = this.dialog.open(ParkingPermitScansImportComponent, {
      data: { types: this.fileTypes() },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (!result) return;

      const { uploadedFiles, selectedTypeId, previewFiles } = result;

      // Replace the file for this type
      if (uploadedFiles && selectedTypeId != null) {
        this.upsertScan(selectedTypeId, uploadedFiles);
      }

      // Enrich previews with the selectedTypeId
      if (
        Array.isArray(previewFiles) &&
        previewFiles.length &&
        selectedTypeId != null
      ) {
        const enriched = previewFiles.map((p: any) => ({
          ...p,
          typeId: selectedTypeId,
          _key: `${selectedTypeId}-${p.path}-${p.file?.name ?? ''}-${
            crypto.randomUUID?.() ?? Math.random()
          }`,
        }));

        // Remove old previews for this type, then add the new ones
        const currentPreviews = this.previewFiles();
        const filtered = currentPreviews.filter(
          (p) => p.typeId !== selectedTypeId
        );
        this.previewFiles.set([...filtered, ...enriched]);

        await this.uploadAllScans();
        console.log('Uploaded files:', this.filesByType());
      }
    });
   
  }

  async onDelete(): Promise<void> {
    try {
      const fileId = this.fileIdToDelete();
      if (fileId == null) return;

      const res = await this.parkingPermitService.deleteParkingPermitFile(
        fileId
      );

      if (res) {
        // Update permit files
        this.permitFiles.update((files) =>
          files.filter((file) => file.fileID !== fileId)
        );

        // Update preview files
        this.previewFiles.update((previews) =>
          previews.filter((f) => f.fileID !== fileId)
        );

        this.toaster.success(ErrorSuccessMessages.FILE_DELETE_SUCCESSFULLY);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      this.toaster.error(ErrorSuccessMessages.SOMETHING_WENT_WRONG_TRY_LATER);
    }
  }

  openDeleteModal(event: number): void {
    this.fileIdToDelete.set(event);
    this.isDeleteModalOpen.set(true);
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen.set(false);
  }

  private upsertScan(typeId: number, file: File): void {
    this.filesByType.update((map) => {
      const newMap = new Map(map);
      newMap.set(typeId, file);
      return newMap;
    });
  }

  // Public method to manually set scans data (if needed outside computed)
  setScansDataManually(): void {
    // This is now handled by the computed signal scansData()
    // Keep this method if external code needs it, but it's redundant
    console.log('Scans data is automatically computed:', this.scansData());
  }
}
