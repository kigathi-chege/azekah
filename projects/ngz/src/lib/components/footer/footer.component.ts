import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CardFooterFormat, CardFooterAction, CardFooterUserAction, CardFooterActions, PageOption, PageOptionFormat, ToasterResult, ToasterType } from '../../core/types';
import { toast } from '../../helpers/toaster';

@Component({
  selector: 'lib-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  @Input() input?: CardFooterFormat;
  @Output() output = new EventEmitter<CardFooterAction>();

  footerOptions: PageOptionFormat = { endOptions: [], startOptions: [] };

  ngOnInit(): void {
    if (this.input?.options_class_) {
      this.footerOptions.optionsClass = this.input.options_class_;
    }
    for (let action of this.input?.cardFooterActions || []) {
      let label, icon;
      let className = 'badge badge-primary primary-hover ms-1';
      const actionDetails = this.getActionDetails(action.action);
      if (actionDetails) {
        ({ label, icon } = actionDetails);
      }
      label = action.label || label;
      className = action.class_ || className;
      if (action.conditions) {
        let condition = action.conditions.find(
          (condition) => condition.value === action.label
        );
        if (condition) {
          if (condition.class_) {
            className = condition.class_;
          }
          if (condition.replaceWith) {
            label = condition.replaceWith;
          }
        }
      }
      const footerAction: PageOption = {
        label,
        action: {
          type: 'call-back',
          call: this.userAction,
          args: { instance: this, action },
        },
        class: className,
        icon,
      };
      action.position === 'start'
        ? this.footerOptions.startOptions?.push(footerAction)
        : action.position === 'center'
        ? this.footerOptions.centerOptions?.push(footerAction)
        : this.footerOptions.endOptions?.push(footerAction);
    }
  }

  userAction(cardFooterAction: CardFooterUserAction) {
    const { instance, action } = cardFooterAction;
    if (action.toasty) {
      const toasterActionMap: Record<
        string,
        { type: ToasterType; message: string; confirmButtonText: string }
      > = {
        delete: {
          type: 'warning',
          message: 'Are you sure you want to delete this item?',
          confirmButtonText: 'Yes, delete it!',
        },
      };
      const toasterAction = toasterActionMap[action.action];

      instance.toaster(
        toasterAction.type,
        toasterAction.message,
        action.action,
        toasterAction.confirmButtonText
      );
    } else {
      instance.output.emit({
        action: action.action,
        args: instance.input!.id,
      });
    }
  }

  getActionDetails(action: CardFooterActions): {
    icon: string;
    label?: string;
  } {
    const actionMap: Record<
      CardFooterActions,
      { icon: string; label?: string }
    > = {
      cart: { icon: 'ri-shopping-cart-line', label: 'Add To Cart' },
      comment: { icon: 'ri-discuss-line', label: 'Comment' },
      delete: { icon: 'ri-delete-bin-7-line' },
      edit: { icon: 'ri-edit-box-line' },
      like: { icon: 'ri-thumb-up-line' },
      unlike: { icon: 'ri-thumb-down-line' },
      toggle: { icon: '' },
      'text-display': { icon: '' },
    };
    return actionMap[action] || { icon: '', label: '' };
  }

  toaster(
    type: ToasterType,
    message: string,
    cardFooterAction: CardFooterActions,
    confirmButtonText: string
  ) {
    toast(type, message, {
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger mr-2',
      },
      buttonsStyling: false,
      showCancelButton: true,
      confirmButtonText,
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
    }).then((result: ToasterResult) => {
      if (result.isConfirmed) {
        this.output.emit({ action: cardFooterAction, args: this.input!.id });
      }
    });
  }
}
