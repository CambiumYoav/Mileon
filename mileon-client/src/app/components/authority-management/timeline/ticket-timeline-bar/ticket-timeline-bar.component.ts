import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
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
})
export class TicketTimelineBarComponent implements OnInit, OnChanges {
  timeLinePath: string = '';
  selectedStep: TimelineItem = {} as TimelineItem;
  @Input() steps: TimelineItem[] = [];
  @Input() formState: FormGroup = new FormGroup({});
  @Input() isFirstTime: boolean = true;
  switchStep: TimelineItem | undefined;
  formSubmitted: boolean = false;
  srcIcons = [
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
  constructor(
    private routerService: RouterService,
    private fbService: TimelineSettingsFormService,
    private timelineService: TimelineService
  ) {}

  moveTo(step: TimelineItem) {
    if (this.isFirstTime) {
      this.steps = this.steps.map((stepData: TimelineItem) => {
        if (stepData.order === step.order) {
          stepData.seen = true;
        }
        return stepData;
      });
    }

    if (step.path) {
      this.routerService.navigateToUrl([step.path], true);
      this.selectedStep = step;
    }
  }

  ngOnInit(): void {
    this.sortSteps();
    this.timeLinePath = ConstPath.TIME_LINE_PATH;
    const path = window.location.pathname.split('/');
    const currentTab = path[path.length - 1];
    this.steps.find((step) => {
      if (step?.path?.includes(currentTab)) {
        this.selectedStep = step;
        step.seen = true;
      }
    });

    this.fbService.submitForm.subscribe(() => {
      this.formSubmitted = true;
    });
  }

  sortSteps() {
    this.steps = this.steps.sort((a, b) => a.order - b.order);
  }

  changeOrder(step: TimelineItem) {
    if (!this.switchStep) {
      this.switchStep = step;
    } else {
      const previousOrder = this.switchStep.order;
      const newOrder = step.order;
      // Swap the order values
      this.switchStep.order = newOrder;
      step.order = previousOrder;

      // Update steps array correctly
      this.steps = this.steps.map((stepData: TimelineItem) => ({
        ...stepData,
        order:
          stepData === this.switchStep
            ? newOrder
            : stepData === step
            ? previousOrder
            : stepData.order,
      }));

      const updatedStepData: UpdatedStepData = {
        iconId: this.selectedStep.iconId,
        isEnabled: this.switchStep.isMoveable,
        order: newOrder,
      };
      const path = window.location.pathname.split('/');
      const typeOfSettings: TimelineStepsType = path.includes(
        TimelineStepsType.Enforcement.toLocaleLowerCase()
      )
        ? TimelineStepsType.Enforcement
        : TimelineStepsType.TicketLifetime;
      console.log(typeOfSettings);
      this.timelineService.updateStepOrder(typeOfSettings, updatedStepData);
      this.switchStep = undefined;
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
      this.steps.forEach((step: TimelineItem) => {
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
      });
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
