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

  // Angular 19 signals for reactive state management
  private readonly _newComment = signal<Comment | null>(null);
  private readonly _actionModule = signal<ActionModuleEnum | null>(null);
  private readonly _reservedComments = signal<ReservedComment[]>([]);

  // Getters for template access
  get newComment(): Comment | null {
    return this._newComment();
  }

  get actionModule(): ActionModuleEnum | null {
    return this._actionModule();
  }

  get reservedComments(): ReservedComment[] {
    return this._reservedComments();
  }

  // Injected services using Angular 19 inject() function
  private readonly lookupNewService = inject(LookupNewService);

  // Inputs with setters
  @Input() set newComment(value: Comment) {
    this._newComment.set(value);
  }

  @Input() set actionModule(value: ActionModuleEnum) {
    this._actionModule.set(value);
    if (value) {
      this.getReserves();
    }
  }

  constructor() {
    super(inject(Injector));
  }

  ngOnInit(): void {
    const actionModule = this._actionModule();
    if (actionModule) {
      this.getReserves();
    }
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
