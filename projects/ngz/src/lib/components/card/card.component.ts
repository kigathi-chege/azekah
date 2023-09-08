import { AfterViewChecked, AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { CardFormat, CardFooterAction } from '../../core/types';
import { getTypeOf, isArray } from '../../helpers/lib.helper';

export type textProcess = {
  value: string[];
  class_?: string[];
};

export type textPreProcess = {
  value: string[] | string;
  class_?: string[] | string;
};

@Component({
  selector: 'ngz-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent
 implements OnChanges, AfterViewInit, AfterViewChecked{
  constructor(private renderer: Renderer2) {}

  @Input() input: CardFormat = { loading: true, index: 0, style: 'vertical' };
  @Output() cardClickEmitter = new EventEmitter();
  @Output() footerActionEmitter = new EventEmitter();

  @ViewChild('textTemplate', { read: TemplateRef })
  textTemplate!: TemplateRef<any>;

  @ViewChild('appTextSpan', { read: ElementRef }) textSpanElement!: ElementRef;
  @ViewChild('appTextDiv', { read: ElementRef }) textDivElement!: ElementRef;
  @ViewChild('appInnerTextSpan', { read: ElementRef })
  appInnerTextSpan!: ElementRef;

  textWidth = '75%';

  getTypeOf = getTypeOf;
  isArray = isArray;

  processedText!: textProcess;
  processedPreText!: textProcess;
  processedSubText!: textProcess;
  processedPreSubText!: textProcess;
  processType = { TEXT: 1, PRETEXT: 2, SUBTEXT: 3, PRESUBTEXT: 4 };
  cardHasBody = false;
  shadowColor = 'var(--card-white)';

  ngOnChanges(): void {
    if (this.input.text) {
      const { value, class_ } = this.input.text;
      this.preprocessText({ value, class_ }, this.processType.TEXT);
    }
    if (this.input.text?.prefix?.value) {
      const { value, class_ } = this.input.text.prefix;
      this.preprocessText({ value, class_ }, this.processType.PRETEXT);
    }
    if (this.input.sub_text) {
      const { value, class_ } = this.input.sub_text;
      this.preprocessText({ value, class_ }, this.processType.SUBTEXT);
    }
    if (this.input.sub_text?.prefix) {
      const { value, class_ } = this.input.sub_text.prefix;
      this.preprocessText({ value, class_ }, this.processType.PRESUBTEXT);
    }

    if (
      this.input.style === 'horizontal' &&
      this.input.horizontalCardStyleRatio
    ) {
      const horizontalStyleMap: Record<
        string,
        { left: string; right: string }
      > = {
        '1:11': { left: 'col-md-1', right: 'col-md-11' },
        '2:10': { left: 'col-md-2', right: 'col-md-10' },
        '3:9': { left: 'col-md-3', right: 'col-md-9' },
        '4:8': { left: 'col-md-4', right: 'col-md-8' },
      };

      const { left, right } =
        horizontalStyleMap[this.input.horizontalCardStyleRatio];
      this.input.topImageWrapperClass = `${left} d-flex flex-wrap align-items-center`;
      this.input.bodyWrapperClass = right;
    }

    if (
      this.input.style === 'horizontal' &&
      !this.input.horizontalCardStyleRatio &&
      !this.input.topImageWrapperClass &&
      !this.input.bodyWrapperClass
    ) {
      this.input.topImageWrapperClass = `col-md-4 d-flex flex-wrap align-items-center`;
      this.input.bodyWrapperClass = `col-md-8`;
    }

    if (
      this.input.top_image ||
      this.input.title ||
      this.input.subtitle ||
      this.input.text ||
      this.input.sub_text
    ) {
      this.cardHasBody = true;
    }

    if (this.input.card_shadow_color) {
      this.shadowColor = this.getShadowColor(this.input.card_shadow_color);
    }
  }

  public preprocessText(text: textPreProcess, type = this.processType.TEXT) {
    let { value, class_ } = text;
    class_ = Array.isArray(class_) ? class_ : class_ ? [class_] : [];
    if (Array.isArray(value)) {
      switch (type) {
        case this.processType.TEXT:
          this.processedText = { value, class_ };
          break;
        case this.processType.PRETEXT:
          this.processedPreText = { value, class_ };
          break;
        case this.processType.SUBTEXT:
          this.processedSubText = { value, class_ };
          break;
        case this.processType.PRESUBTEXT:
          this.processedPreSubText = { value, class_ };
          break;
      }
    }
  }

  ngAfterViewInit(): void {
    if (
      this.textSpanElement &&
      this.input.text?.appends?.type === 'truncate' &&
      this.isEllipsisActive(this.textSpanElement.nativeElement)
    ) {
      this.appendReadMoreLink(this.textDivElement.nativeElement);
    }
  }

  ngAfterViewChecked(): void {
    if (
      this.appInnerTextSpan &&
      this.input.text?.class_?.includes('chat-width')
    ) {
      const appTextSpan = this.appInnerTextSpan.nativeElement;
      const contentWidth = appTextSpan.offsetWidth;
      const containerWidth =
        this.textDivElement.nativeElement.parentElement.offsetWidth;
      if (contentWidth > containerWidth * 0.75) {
        this.renderer.addClass(this.textSpanElement.nativeElement, 'w-75');
      } else {
        this.renderer.addClass(
          this.textSpanElement.nativeElement,
          'w-fitContent'
        );
      }
    }
  }

  isEllipsisActive(e: any) {
    return e.scrollHeight > e.offsetHeight;
  }

  private appendReadMoreLink(element: HTMLElement): void {
    const readMoreLink = this.renderer.createElement('a');
    this.renderer.setProperty(readMoreLink, 'textContent', 'Read more');
    this.renderer.addClass(readMoreLink, 'lato-bold-14');
    this.renderer.addClass(readMoreLink, 'cursor-pointer');
    this.renderer.appendChild(element, readMoreLink);
  }

  getShadowColor(color: string): string {
    return `var(--card-${color})`;
  }

  public onFooterAction(action: CardFooterAction) {
    this.footerActionEmitter.emit(action);
  }

  onClick() {
    this.cardClickEmitter.emit(this.input.index);
  }
}
