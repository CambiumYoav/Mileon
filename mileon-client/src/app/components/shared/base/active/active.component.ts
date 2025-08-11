import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-active',
  templateUrl: './active.component.html',
  styleUrls: ['./active.component.scss']
})
export class ActiveComponent implements OnInit {

  constructor() { }

  @Input() isActive:boolean = false;

  ngOnInit(): void {
  }

}
