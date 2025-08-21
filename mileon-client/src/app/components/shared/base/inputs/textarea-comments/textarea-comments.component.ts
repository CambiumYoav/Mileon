import { Component, Injector, Input, OnInit, forwardRef } from '@angular/core';
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
  standalone: true,
  imports: [SharedImports],
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

  @Input() newComment!: Comment;
  @Input() actionModule!: ActionModuleEnum;
  reservedComments: ReservedComment[] = [];


  constructor(injector: Injector,  private lookupNewService: LookupNewService) {
    super(injector);
  }

  ngOnInit(): void {
    if(this.actionModule) {
      this.getReserves();
    }
  }


  isChosen(commentID: number) {
    return this.newComment.reservedCommentsIDs.includes(commentID);
  }

  addOrRemoveComment(commentID: number) {
    if(this.isChosen(commentID)) {
       this.newComment.reservedCommentsIDs = this.newComment.reservedCommentsIDs.filter(id => id != commentID);
    }else {
      this.newComment.reservedCommentsIDs.push(commentID);
    }
  }

  getReserves() {
    this.lookupNewService.getReservedActions(this.actionModule).subscribe({
      next: (res) => {
        this.reservedComments.push(...res);
      }
    })
  }
}
