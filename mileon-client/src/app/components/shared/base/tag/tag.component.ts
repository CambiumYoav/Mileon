import { Component, Input, OnInit } from '@angular/core';
import { TagColorDirective } from '../../../../directives/tag-color.directive';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss'],
  standalone: true,
  imports: [TagColorDirective]
})
export class TagComponent implements OnInit {
  @Input()
  public tagId: string = '';

  @Input()
  public tagName: string = '';

  @Input()
  public pattern: string | RegExp = '';

  constructor() {}

  ngOnInit(): void {}
}
