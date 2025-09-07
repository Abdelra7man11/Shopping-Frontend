import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-select',
  imports: [CommonModule],
  templateUrl: './select.html',
  styleUrl: './select.scss',
})
export class Select implements OnInit {
  @Input() title: string = '';
  @Input() data: any[] = [];
  @Output() SelectValue = new EventEmitter();

  selected: string = 'all';

  ngOnInit(): void {}

  detectChange(event: any) {
    const value = event.target.value;
    this.SelectValue.emit(value);
  }
}
