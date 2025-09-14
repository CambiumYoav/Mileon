import { Component, Injector, Input, OnInit, forwardRef, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormControlValueAccessorConnector } from '../../../abstract/form-control-value-accessor-connector.component';
import { Comment } from '../../../../../types/comment';
import { ReservedComment } from '../../../../../types/reservedComment';
import { LookupNewService } from '../../../../../services/lookup-new.service';
import { ActionModuleEnum } from '../../../../../types/enum/moduleEnum';
import { SharedImports } from '../../../../../shared/shared-modules';

@Component({
  selector: 'app-textarea-comments',
  templateUrl: './textarea-comments.component.html',
  styleUrls: ['./textarea-comments.component.scss'],
  imports: [SharedImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaCommentsComponent),
      multi: true,
    },
  ],
})

export class TextareaCommentsComponent
  extends FormControlValueAccessorConnector
  implements OnInit, ControlValueAccessor {

  private readonly _newComment = signal<Comment | null>(null);
  private readonly _actionModule = signal<ActionModuleEnum | null>(null);
  private readonly _reservedComments = signal<ReservedComment[]>([]);
  private readonly _maxLength = signal<number | null>(null);
  private readonly _rows = signal<number>(5);

  get newComment(): Comment | null {
    return this._newComment();
  }

  get actionModule(): ActionModuleEnum | null {
    return this._actionModule();
  }

  get reservedComments(): ReservedComment[] {
    return this._reservedComments();
  }

  get maxLength(): number | null {
    return this._maxLength();
  }

  get rows(): number {
    return this._rows();
  }

  private readonly lookupNewService = inject(LookupNewService);

  @Input() set newComment(value: Comment) {
    this._newComment.set(value);
  }

  @Input() set actionModule(value: ActionModuleEnum) {
    this._actionModule.set(value);
    if (value) {
      this.getReserves();
    }
  }

  @Input() set maxlength(value: number | null) {
    this._maxLength.set(value ?? null);
  }

  @Input() set rows(value: number | null) {
    this._rows.set((value ?? 5) as number);
  }

  constructor() {
    super(inject(Injector));
  }

  ngOnInit(): void {
    const actionModule = this._actionModule();
    if (actionModule) {
      this.getReserves();
    }
    // Ensure we are connected to parent control
    try {
      this.checkConnectedField();
    } catch {}
  }

  isChosen(commentID: number): boolean {
    const newComment = this._newComment();
    return newComment ? newComment.reservedCommentsIDs.includes(commentID) : false;
  }

  addOrRemoveComment(commentID: number): void {
    const newComment = this._newComment();
    if (!newComment) return;

    if (this.isChosen(commentID)) {
      newComment.reservedCommentsIDs = newComment.reservedCommentsIDs.filter(id => id !== commentID);
    } else {
      newComment.reservedCommentsIDs.push(commentID);
    }
  }

  private getReserves(): void {
    const actionModule = this._actionModule();
    if (!actionModule) return;

    this.lookupNewService.getReservedActions(actionModule).subscribe({
      next: (res) => {
        this._reservedComments.set(res);
      }
    });
  }
}
