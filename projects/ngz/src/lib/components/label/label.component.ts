import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { LabelFormat } from '../../core/types';

@Component({
  selector: 'ngz-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.css']
})
export class LabelComponent implements OnChanges {
  @Input() label?: LabelFormat;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['label'] === undefined) {
      this.label = { label: 'Label' };
    }
  }
}
