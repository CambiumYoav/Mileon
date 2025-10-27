import { Component, OnInit, signal, computed, effect, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TimelineSettings } from '../../../../types/timeline-settings/timeline-settings';
import { TimelineItem } from '../../../../types/timeline-settings/timeline-settings-types';
import { TimelineSettingsFormService } from '../../timeline-settings-form.service';
import { TimelineService } from '../../timeline.service';
import { AuthorityService } from '../../../../services/authority.service ';
import { TimelineStepsType } from '../../../../types/enum/timelineSettings.enum';
import { toSignal } from '@angular/core/rxjs-interop';
import { skip, distinctUntilChanged } from 'rxjs';
import { TicketTimelineBarComponent } from '../ticket-timeline-bar/ticket-timeline-bar.component';

@Component({
  selector: 'app-enforcement',
  templateUrl: './enforcement.component.html',
  styleUrls: ['./enforcement.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterOutlet,
    TicketTimelineBarComponent
],
})
export class EnforcementComponent implements OnInit {
  private fbService = inject(TimelineSettingsFormService);
  private timelineService = inject(TimelineService);
  private authorityService = inject(AuthorityService);

  private formDataSignal = toSignal(
    this.fbService.formData$.pipe(distinctUntilChanged()),
    { initialValue: null }
  );

  private authorityIdSignal = toSignal(
    this.authorityService.authorityId$.pipe(skip(1), distinctUntilChanged()),
    { initialValue: '' }
  );

  categories = signal<{ [key: string]: any[] }>({});
  formState = signal(false);
  steps = signal<TimelineItem[]>([]);
  form = signal<FormGroup | null>(null);
  isFirstTime = signal(true);
  authorityId = signal('');

  constructor() {
    effect(() => {
      const formData = this.formDataSignal();
      if (formData) {
        this.formState.set(formData.valid);
        this.form.set(formData);
      }
    });

    effect(() => {
      const authorityId = this.authorityIdSignal();
      if (authorityId && typeof authorityId === 'string') {
        this.authorityId.set(authorityId);
        this.getFieldSettings();
      }
    });
  }

  async getFieldSettings() {
    try {
      const res = await this.timelineService.getTimelineSettings();
      if (res && res.length > 0) {
        const hasValue = res.find((setting: any) => {
          if (setting.value || setting.value !== 0) {
            this.isFirstTime.set(false);
            return true;
          }
          return false;
        });
        
        if (!hasValue) {
          this.isFirstTime.set(true);
        }
        
        this.fbService.initializeForm(res);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async getEnforcementSteps() {
    try {
      const res = await this.timelineService.getTimelineSteps(TimelineStepsType.Enforcement);
      if (res && res.length > 0) {
        const timelineSteps = [...TimelineSettings.EnforcementTimelineSteps];

        const map = new Map(
          timelineSteps.map((item) => [item['enumName'], item])
        );
        
        res.forEach((serverItem: any) => {
          if (map.has(serverItem['enumName'])) {
            map.set(serverItem['enumName'], {
              ...map.get(serverItem['enumName']),
              ...serverItem,
            });
          }
           else {
            map.set(serverItem['enumName'], serverItem);
          }
        });

        this.steps.set(Array.from(map.values()));
      }
    } catch (error) {
      console.error(error);
    }
  }

  ngOnInit(): void {
    this.getFieldSettings();
    this.getEnforcementSteps();
  }

  submit() {
    this.fbService.triggerSubmit();
  }
}
