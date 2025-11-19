import { Component, OnInit, OnDestroy, inject, signal, effect, computed } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { ParkingPermitsService } from '../parking-permits.service';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  AbstractControl,
  FormControl,
} from '@angular/forms';

import { toSignal } from '@angular/core/rxjs-interop';
import { AuthorityService } from '../../../services/authority.service ';
import { SessionService } from '../../../services/session.service';
import { ErrorSuccessMessages } from '../../../types/enum/error-success-messages';
import { ButtonComponent } from '../../shared/base/button/button.component';
import { InputCheckboxWithTextComponent } from '../../shared/base/inputs/input-checkbox-with-text/input-checkbox-with-text.component';
import { CORE_IMPORTS } from '../../../shared/shared-modules';

// Define a type for the document control value for clarity
type DocValue = { name: string; isRequired: boolean };

@Component({
  selector: 'app-parking-permits-types-documents',
  templateUrl: './parking-permits-types-documents.component.html',
  styleUrls: ['./parking-permits-types-documents.component.scss'],
  imports:[ButtonComponent,InputCheckboxWithTextComponent,CORE_IMPORTS]
})
export class ParkingPermitsTypesDocumentsComponent implements OnInit {
  // --- Dependency Injection (Modern Inject) ---
  private authorityService = inject(AuthorityService);
  private parkingPermitsService = inject(ParkingPermitsService);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private sessionService = inject(SessionService);

  // --- Reactive State (Signals) ---
  fg!: FormGroup; // FormGroup will stay as is for now, but its structure is created reactively
  
  // 1. Local State: Replaced primitives
  typeId = signal<string | null>(null);
  isEditMode = signal(false);
  isActive = signal(true);
  
  // 2. RxJS Interop: Replaced Subscription
  private readonly authorityId = toSignal(this.authorityService.authorityId$);

  // --- Constants and View Logic ---
  readonly labels = Array.from({ length: 16 }, (_, i) => `מסמך ${i + 1}`);
  readonly half = 8; 
  // Use computed signals for derived view state
  leftIdxs = computed(() => Array.from({ length: this.half }, (_, i) => i));
  rightIdxs = computed(() => 
    Array.from({ length: this.labels.length - this.half }, (_, i) => i + this.half)
  );
  
  // --- Lifecycle and Reactivity ---

  constructor() {
    // Setup the FormArray structure (synchronous setup)
    this.fg = this.fb.group({
      docs: this.fb.array(this.labels.map(() => this.makeDocControl())),
    });

    // 3. Effect: Replaces RxJS Subscription logic
    effect(() => {
      const authorityID = this.authorityId(); // Reads the authority ID signal
      const isEdit = this.isEditMode(); // Reads the edit mode signal

      if (authorityID !== undefined && authorityID !== null) {
        // If in edit mode AND the authority has changed, re-fetch data
        // This replaces the complex authoritySub logic
        if (isEdit) {
          this.getPermitFileTypesById();
        }
      }
    }, { allowSignalWrites: true }); // We allow signal writes in the effect as it's controlled.
  }

  ngOnInit(): void {
    const currentUrl = this.router.url;
    this.isEditMode.set(currentUrl.includes('/edit'));

    if (this.isEditMode()) {
      // Use .set() to update the Signals
      const isActiveParam = this.route.parent?.snapshot.paramMap.get('isActive');
      this.isActive.set(isActiveParam === 'true');

      const idParam = this.route.parent?.snapshot.paramMap.get('id');
      this.typeId.set(idParam!);
      
      // Initial fetch if we're already in edit mode (authorityId might not have fired yet)
      this.getPermitFileTypesById();
    } else {
      // Use .set() to update the Signal
      const sessionId = this.sessionService.get('authorityPermitTypeID');
      this.typeId.set(sessionId as string);
    }
    
    // This can stay as a simple function call
    this.authorityService.setMunicipalsToNationalRegional();
  }
  
  // --- FormArray Getters and Helpers ---

  get docs(): FormArray<FormControl<DocValue>> {
    return this.fg.get('docs') as FormArray<FormControl<DocValue>>;
  }

  getControlAt(index: number): AbstractControl<DocValue> {
    return this.docs.at(index);
  }

  // --- Private Form Methods ---

  private makeDocControl(initial?: Partial<DocValue>): FormControl<DocValue> {
    return this.fb.control({
      name: initial?.name ?? '',
      isRequired: !!initial?.isRequired,
    }) as FormControl<DocValue>;
  }
  
  // Renamed to prepare and patch
  private prepareAndPatchDocs(
    data: Array<{ name: string; isRequired: boolean; order?: number }>
  ) {
    const n = this.labels.length;
    
    // 1) Ensure the array size is correct (16)
    while (this.docs.length < n) this.docs.push(this.makeDocControl());
    while (this.docs.length > n) this.docs.removeAt(this.docs.length - 1);
    
    // 2) Clear all values
    for (let i = 0; i < n; i++) {
      this.docs.at(i).setValue({ name: '', isRequired: false }, { emitEvent: false });
    }
    
    // 3) Patch in the received data based on order
    data.forEach((item) => {
      const order = item.order;
      if (Number.isFinite(order) && order! >= 1 && order! <= n) {
        const index = order! - 1; 
        this.docs.at(index).setValue(
          { name: item?.name ?? '', isRequired: !!item?.isRequired },
          { emitEvent: false }
        );
      } else {
        // Fallback for invalid/missing order: find first empty slot
        for (let i = 0; i < n; i++) {
          const currentValue = this.docs.at(i).value;
          if (!currentValue.name) {
            this.docs.at(i).setValue(
              { name: item?.name ?? '', isRequired: !!item?.isRequired },
              { emitEvent: false }
            );
            break;
          }
        }
      }
    });
  }
  
  // --- API Calls ---

  async getPermitFileTypesById() {
    // Check typeId and authorityId before fetching
    const id = this.typeId();
    const authority = this.authorityId();
    
    if (!id || !authority) return;
    
    try {
      const res = await this.parkingPermitsService.getPermitFileTypesById(id);
      this.prepareAndPatchDocs(res);
    } catch (e) {
      this.toastr.error('Failed to load document types.');
      console.error(e);
    }
  }

  async createOrUpdateFileTypes(body: DocValue[]) {
    if (!this.authorityId() || !this.typeId()) return; // Safety check
    
    try {
      const payload = body
        .map((v, i) => ({
          name: (v?.name || '').trim(),
          isRequired: !!v?.isRequired,
          order: i + 1,
        }))
        .filter((x) => x.name !== '');

      const res = await this.parkingPermitsService.createOrUpdatePermitFileType(
        payload,
        this.authorityId()!, // Read the Signal value
        this.typeId()! // Read the Signal value
      );

      if (res) {
        const msg = this.isEditMode()
          ? ErrorSuccessMessages.PERMIT_TYPE_FORMS_EDITED_SUCCESSFULY
          : ErrorSuccessMessages.PERMIT_TYPE_FORMS_CREATED_SUCCESSFULY;
        this.toastr.success(msg);
      }
    } catch (e) {
      this.toastr.error(ErrorSuccessMessages.SOMETHING_WENT_WRONG_TRY_LATER);
    }
  }
  
  // --- Public Action Methods ---

  hasErrorAt(index: number): boolean {
    const control = this.getControlAt(index);
    return !!(control.errors && (control.dirty || control.touched));
  }

  async submit() {
    this.fg.markAllAsTouched();

    if (this.fg.valid) {
      const formValue = this.docs.value as DocValue[];
      // Filter only items that have a name (are being used)
      const payload = formValue.filter((doc) => doc.name.trim().length > 0);
      
      await this.createOrUpdateFileTypes(payload);
    } else {
      this.toastr.error(ErrorSuccessMessages.INVALID_DETAILS_TRY_AGAIN);
    }
  }

  resetForm() {
    this.fg.reset();
    // Use the explicit prepareAndPatchDocs to re-initialize all 16 slots cleanly
    this.prepareAndPatchDocs([]);
  }
  
  // ... getFormErrors helper method can stay private if needed for debugging ...
}