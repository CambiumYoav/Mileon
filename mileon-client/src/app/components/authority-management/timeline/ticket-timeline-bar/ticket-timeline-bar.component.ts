import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ChangeDetectionStrategy,
  signal,
  inject,
  effect,
} from '@angular/core';
import { RouterService } from '../../../../services/router.service';
import { ConstPath } from '../../../../constants/const_path';
import { TimelineSettings } from '../../../../types/timeline-settings/timeline-settings';
import {
  TimelineItem,
  UpdatedStepData,
} from '../../../../types/timeline-settings/timeline-settings-types';
import { TimelineSettingsFormService } from '../../timeline-settings-form.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TimelineService } from '../../timeline.service';
import { TimelineStepsType } from '../../../../types/enum/timelineSettings.enum';
import { SharedImports } from '../../../../shared/shared-modules';
import { StepTooltipComponent } from "./step-tooltip/step-tooltip.component";

@Component({
  selector: 'app-ticket-timeline-bar',
  templateUrl: './ticket-timeline-bar.component.html',
  styleUrls: ['./ticket-timeline-bar.component.scss'],
  imports: [
    SharedImports,
    StepTooltipComponent
], 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketTimelineBarComponent implements OnInit, OnChanges {
  private readonly _timeLinePath = signal<string>('');
  private readonly _selectedStep = signal<TimelineItem>({} as TimelineItem);
  private readonly _steps = signal<TimelineItem[]>([]);
  private readonly _formState = signal<FormGroup>(new FormGroup({}));
  private readonly _isFirstTime = signal<boolean>(true);
  private readonly _switchStep = signal<TimelineItem | undefined>(undefined);
  private readonly _formSubmitted = signal<boolean>(false);

  get timeLinePath(): string {
    return this._timeLinePath();
  }

  get selectedStep(): TimelineItem {
    return this._selectedStep();
  }

  get steps(): TimelineItem[] {
    return this._steps();
  }

  get formState(): FormGroup {
    return this._formState();
  }

  get isFirstTime(): boolean {
    return this._isFirstTime();
  }

  get switchStep(): TimelineItem | undefined {
    return this._switchStep();
  }

  get formSubmitted(): boolean {
    return this._formSubmitted();
  }

  readonly srcIcons = [
    'car',
    'bus',
    'building',
    'danger',
    'judgeYellow',
    'judgeOrange',
    'bank',
    'glass',
    'house',
    '',
    '',
    '',
    '',
  ];

  private readonly routerService = inject(RouterService);
  private readonly fbService = inject(TimelineSettingsFormService);
  private readonly timelineService = inject(TimelineService);

  @Input() set steps(value: TimelineItem[]) {
    this._steps.set(value);
  }

  @Input() set formState(value: FormGroup) {
    this._formState.set(value);
  }

  @Input() set isFirstTime(value: boolean) {
    this._isFirstTime.set(value);
  }

  constructor() {
    effect(() => {
      this.fbService.submitForm.subscribe(() => {
        this._formSubmitted.set(true);
      });
    });
  }

  moveTo(step: TimelineItem) {
    if (this._isFirstTime()) {
      const updatedSteps = this._steps().map((stepData: TimelineItem) => {
        if (stepData.order === step.order) {
          stepData.seen = true;
        }
        return stepData;
      });
      this._steps.set(updatedSteps);
    }

    if (step.path) {
      this.routerService.navigateToUrl([step.path], true);
      this._selectedStep.set(step);
    }
  }

  ngOnInit(): void {
    this.sortSteps();
    this._timeLinePath.set(ConstPath.TIME_LINE_PATH);
    const path = window.location.pathname.split('/');
    const currentTab = path[path.length - 1];
    this._steps().find((step) => {
      if (step?.path?.includes(currentTab)) {
        this._selectedStep.set(step);
        step.seen = true;
      }
    });
  }

  sortSteps() {
    const sortedSteps = this._steps().sort((a, b) => a.order - b.order);
    this._steps.set(sortedSteps);
  }

  changeOrder(step: TimelineItem) {
    const currentSwitchStep = this._switchStep();
    if (!currentSwitchStep) {
      this._switchStep.set(step);
    } else {
      const previousOrder = currentSwitchStep.order;
      const newOrder = step.order;
      // Swap the order values
      currentSwitchStep.order = newOrder;
      step.order = previousOrder;

      // Update steps array correctly
      const updatedSteps = this._steps().map((stepData: TimelineItem) => ({
        ...stepData,
        order:
          stepData === currentSwitchStep
            ? newOrder
            : stepData === step
            ? previousOrder
            : stepData.order,
      }));
      this._steps.set(updatedSteps);

      const updatedStepData: UpdatedStepData = {
        iconId: this._selectedStep().iconId,
        isEnabled: currentSwitchStep.isMoveable,
        order: newOrder,
      };
      const path = window.location.pathname.split('/');
      const typeOfSettings: TimelineStepsType = path.includes(
        TimelineStepsType.Enforcement.toLocaleLowerCase()
      )
        ? TimelineStepsType.Enforcement
        : TimelineStepsType.TicketLifetime;
      this.timelineService.updateStepOrder(typeOfSettings, updatedStepData);
      this._switchStep.set(undefined);
      this.sortSteps();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const form = this.fbService.getForm();

    if (
      changes['formState'] &&
      changes['formState'].currentValue &&
      form?.controls
    ) {
      const updatedSteps = this._steps().map((step: TimelineItem) => {
        let isUpdated = false;
        let updatedRequiredCount = 0; // Counter for updated required fields

        step.errors = this.getStepErrorCount(step, form);

        Object.entries(form.controls).forEach(([_, categoryControl]) => {
          const categoryFormGroup = categoryControl as FormGroup;

          Object.entries(categoryFormGroup.controls).forEach(
            ([field, fieldControl]) => {
              if (!step.validateFields.includes(field)) return;

              const formField = fieldControl as FormControl;

              // Check if the field's current value differs from its previous value
              if (formField.dirty || formField.touched) {
                isUpdated = true;

                // Check if the field is required and track updates
                if (formField.hasValidator(Validators.required)) {
                  updatedRequiredCount++;
                }
              }
            }
          );
        });

        if (isUpdated) {
          step.isUpdated = true;
          step.updatedCount = updatedRequiredCount; // Update the counter
        }

        return step;
      });
      
      this._steps.set(updatedSteps);
    }
  }

  // handle errors display for each step
  private getStepErrorCount(step: TimelineItem, form: FormGroup): number {
    return Object.entries(form.controls).reduce(
      (errorCount, [_, categoryControl]) => {
        const categoryFormGroup = categoryControl as FormGroup;

        const stepErrors = Object.entries(categoryFormGroup.controls).filter(
          ([field, fieldControl]) =>
            step.validateFields.includes(field) &&
            !(fieldControl as FormControl).valid
        ).length;

        return errorCount + stepErrors;
      },
      0
    );
  }
}
