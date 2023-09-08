import { AfterViewChecked, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { PageOption, PageOptionFormat } from '../../core/types';
import { UtilService } from '../../providers/util.service';

@Component({
  selector: 'ngz-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css']
})
export class OptionsComponent implements OnInit, AfterViewChecked {
  @Input() options: PageOptionFormat = {};

  constructor(public util: UtilService) {}

  rowOptions = 'col-12';
  @ViewChild('img', { read: ElementRef }) imgOption!: ElementRef;

  /**
   * Page option rows:
   * if center and title or center and start || end, col-4
   */

  ngOnInit(): void {
    if (
      this.options &&
      this.options.centerOptions &&
      this.options.centerOptions.length > 0 &&
      ((this.options.startOptions && this.options.startOptions.length > 0) ||
        (this.options.endOptions && this.options.endOptions.length > 0) ||
        this.options.title ||
        this.options.subtitle)
    ) {
      this.rowOptions = 'col-4';
    }

    if (
      this.options &&
      this.options.endOptions &&
      this.options.endOptions.length > 0 &&
      this.options.startOptions &&
      this.options.startOptions.length > 0 &&
      (!this.options.centerOptions ||
        (this.options.centerOptions && this.options.centerOptions.length <= 0))
    ) {
      this.rowOptions = 'col-6';
    }
  }

  ngAfterViewChecked(): void {
    if (this.options.startOptions && this.options.startOptions.length > 0) {
      this.addOptionAttributes(this.options.startOptions);
    }

    if (this.options.centerOptions && this.options.centerOptions.length > 0) {
      this.addOptionAttributes(this.options.centerOptions);
    }

    if (this.options.endOptions && this.options.endOptions.length > 0) {
      this.addOptionAttributes(this.options.endOptions);
    }
  }

  addOptionAttributes(options: PageOption[]) {
    for (let option of options) {
      if (option.attributes && option.attributes.length > 0) {
        if (option.widget === 'image') {
          for (let attr of option.attributes) {
            this.imgOption.nativeElement.setAttribute(attr.key, attr.value);
          }
        }
      }
    }
  }
}

