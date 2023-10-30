import {
  AfterViewChecked,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { PageOption, PageOptionFormat } from '../../core/types';
import { UtilService } from '../../providers/util.service';

@Component({
  selector: 'ngz-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css'],
})
export class OptionsComponent implements OnInit, AfterViewChecked {
  @Input() options: PageOptionFormat = {};

  constructor(public util: UtilService) {}

  rowOptions = 'col-12';
  @ViewChild('img', { read: ElementRef }) imgOption!: ElementRef;

  ngOnInit(): void {
    if (this.options.navigation) {
      this.options.endOptions = (this.options.endOptions || []).concat([
        {
          action: {
            type: 'call-back',
            call: this.backClicked,
            args: this,
          },
          class: 'badge badge-light me-1 mt-1 cursor-pointer primary-hover',
          icon: 'ri-arrow-left-line',
        },
        {
          action: {
            type: 'call-back',
            call: this.forwardClicked,
            args: this,
          },
          class: 'badge badge-light me-1 mt-1 cursor-pointer primary-hover',
          icon: 'ri-arrow-right-line',
        },
      ]);
    }
  }

  backClicked(instance: any) {
    instance.util.backClicked();
  }

  forwardClicked(instance: any) {
    instance.util.forwardClicked();
  }

  ngAfterViewChecked(): void {
    console.log('object', this.options);

    // if (this.options.startOptions && this.options.startOptions.length > 0) {
    // 	this.addOptionAttributes(this.options.startOptions);
    // }

    // if (this.options.centerOptions && this.options.centerOptions.length > 0) {
    //   this.addOptionAttributes(this.options.centerOptions);
    // }

    // if (this.options.endOptions && this.options.endOptions.length > 0) {
    // 	this.addOptionAttributes(this.options.endOptions);
    // }
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
