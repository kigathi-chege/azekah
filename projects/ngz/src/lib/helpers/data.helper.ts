import {
  CardDescription,
  CardFooterDescription,
  CardFormat,
  CardListFormat,
  CardWholeClassDescription,
  ColumnDescription,
  ColumnHeaderDescription,
  ColumnWithBadgeDescriptor,
  ComplexDescription,
  InvolvedComplexDescription,
  PrefixFormat,
  SimpleDescription,
} from '../core/types';
import { isObjectEmpty } from './lib.helper';
import { toast } from './toaster';

export const toastError = (error: any) => {
  if (error.networkError && !isObjectEmpty(error.networkError)) {
    const code = error.networkError.error.errors[0].extensions.code;
    toast('error', code);
  }
  if (error.errorCode) {
    toast('error', error.message);
  }
};

export const getCardInput = (
  item: any,
  cardListFormat: CardListFormat
): CardFormat => {
  const {
    columns,
    loading,
    style,
    horizontalCardStyleRatio,
    topImageWrapperClass,
    bodyWrapperClass,
    indexColumn,
  } = cardListFormat;
  const {
    top_image,
    header,
    title,
    subtitle,
    text,
    sub_text,
    card_subtitle_class,
    card_title_class,
    card_text_class,
    card_sub_text_class,
    card_body_class,
    card_header_class,
    card_whole_class,
    card_shadow_color,
  } = columns;
  const topImage = top_image && processImageValue(top_image, item);

  return {
    loading,
    style,
    horizontalCardStyleRatio,
    topImageWrapperClass,
    bodyWrapperClass,
    index: indexColumn ? item[indexColumn] : item.id,
    top_image: topImage,
    header: header && processHeaderValue(header, item),
    title: title && processCardValueWithBadge(title, item),
    subtitle: subtitle && processCardValues(subtitle, item),
    text: text && processCardValues(text, item),
    sub_text: sub_text && {
      ...processCardValues(sub_text, item),
      position: sub_text.position || 'distribute',
    },
    footer: cardListFormat.footer && {
      ...processFooterValue(cardListFormat.footer, item),
      loading,
      style,
      id: item.id,
    },
    card_subtitle_class,
    card_title_class,
    card_text_class,
    card_sub_text_class,
    card_body_class,
    card_header_class,
    card_whole_class:
      card_whole_class && processCardWholeClassValue(card_whole_class, item),
    card_shadow_color: card_shadow_color && item[card_shadow_color],
  };
};

export const processValue = (
  description: ColumnDescription | PrefixFormat,
  item: any
) => {
  let value: any;

  if (description.raw && description.rawValue) {
    if (typeof description.rawValue === 'string') {
      value = description.rawValue;
    } else {
      switch (description.separator) {
        case 'new-line':
          value = description.rawValue;
          break;
        default:
          description.rawValue.map((val) => {
            value = value ? `${value} ${val}` : val;
          });
          break;
      }
    }
  }

  if (description.column) {
    if (typeof description.column === 'string') {
      value = item[description.column];
    } else {
      switch (description.separator) {
        case 'new-line':
          value = [];
          description.column.map((identifier) => {
            value = value ? [...value, item[identifier]] : [item[identifier]];
          });
          break;
        default:
          description.column.map((identifier) => {
            value = value ? `${value} ${item[identifier]}` : item[identifier];
          });
          break;
      }
    }
  }

  return value;
};

export const processCardValues = (
  description: ColumnDescription,
  item: any
): CardDescription => {
  const { class_, pipe, pipe_args, appends } = description;
  let appends_: any;
  if (appends && appends.type !== 'truncate') {
    appends_ = {
      type: appends.type,
      value: processValue(appends, item),
      class_: appends.class_,
      conditional: appends.conditional,
    };
  }
  if (appends && appends.type === 'truncate') {
    appends_ = { type: 'truncate' };
  }
  const value = processValue(description, item);
  let prefix = undefined;
  let alt: any;
  if (description.alt) {
    if (typeof description.alt === 'string') {
      alt = item[description.alt];
    } else {
      description.alt.map((identifier) => {
        alt = alt ? `${alt} ${item[identifier]}` : item[identifier];
      });
    }
  }
  if (description.prefix) {
    prefix = processCardValues(description.prefix, item);
  }
  if (appends_ && appends_.conditional && !value) {
    appends_ = undefined;
  }
  return { value, prefix, class_, pipe, pipe_args, alt, appends: appends_ };
};

export const processCardWholeClassValue = (
  descriptions: CardWholeClassDescription[],
  item: any
): string => {
  let class_ = '';

  for (let description of descriptions) {
    if (description.raw) {
      class_ = class_
        ? `${class_} ${description.rawValue!}`
        : description.rawValue!;
    }

    if (description.column) {
      if (typeof description.column === 'string') {
        let current = description.appendRawToColumn
          ? `${description.appendRawToColumn}${item[description.column]}`
          : item[description.column];
        class_ = class_ ? `${class_} ${current}` : current;
      } else {
        let value = '';
        description.column.map((identifier) => {
          value = value
            ? description.appendRawToColumn
              ? `${value} ${description.appendRawToColumn}${item[identifier]}`
              : `${value} ${item[identifier]}`
            : description.appendRawToColumn
            ? `${description.appendRawToColumn}${item[identifier]}`
            : item[identifier];
        });
        class_ = class_ ? `${class_} ${value}` : value;
      }
    }
  }

  return class_;
};

export const processCardValueWithBadge = (
  description: ColumnWithBadgeDescriptor,
  item: any
) => {
  const value = processCardValues(description, item);
  const { badge } = description;
  let calculatedBadge: any = {};

  if (badge) {
    const simpleDescription = processBadgeValue(badge, item);
    calculatedBadge['value'] = simpleDescription.value;
    calculatedBadge['class_'] = simpleDescription.class_;
  }

  let result: any = { ...value };

  if (!isObjectEmpty(calculatedBadge)) {
    result['badge'] = calculatedBadge;
  }

  return result;
};

export const processHeaderValue = (
  description: ColumnHeaderDescription,
  item: any
) => {
  const value = processCardValues(description, item);
  const { image, badge } = description;
  let calculatedImage: any = {};
  let calculatedBadge: any = {};
  if (image) {
    const simpleDescription = processImageValue(image, item);
    calculatedImage['value'] = simpleDescription.value;
    calculatedImage['class_'] = simpleDescription.class_;
  }

  if (badge) {
    const simpleDescription = processBadgeValue(badge, item);
    calculatedBadge['value'] = simpleDescription.value;
    calculatedBadge['class_'] = simpleDescription.class_;
  }

  let result: any = { ...value };

  if (!isObjectEmpty(calculatedBadge)) {
    result['badge'] = calculatedBadge;
  }

  if (!isObjectEmpty(calculatedImage)) {
    result['image'] = calculatedImage;
  }

  return result;
};

export const processImageValue = (
  image: ComplexDescription,
  item: any
): SimpleDescription => {
  let value, class_;

  if (image.raw && image.rawValue) {
    value = image.rawValue;
  }
  if (image.column) {
    let columnValue;

    if (typeof image.column === 'string') {
      columnValue = item[image.column];
    } else {
      for (let column of image.column) {
        if (item[column]) {
          columnValue = item[column];
          break;
        }
      }
    }

    value = columnValue;

    if (image.conditional && columnValue) {
      value = image.rawValue;
    }

    if (image.alt && columnValue) {
      value = columnValue;
    }

    if (image.alt && !columnValue) {
      value = image.rawValue;
    }
  }
  if (image.class_) {
    class_ = image.class_;
  }

  // TODO: Kigathi - January 13 2024 - This line is necessary because of InvolvedComplexDescription
  return { value, class_: class_ as string | undefined };
};

export const processBadgeValue = (badge: ComplexDescription, item: any) => {
  let value, class_;

  if (badge.raw && badge.rawValue) {
    value = badge.rawValue;
  }
  if (badge.column) {
    let calculatedValue = '';
    if (typeof badge.column === 'string') {
      calculatedValue = item[badge.column];
    } else {
      badge.column.map((identifier) => {
        calculatedValue = calculatedValue
          ? `${calculatedValue} ${item[identifier]}`
          : item[identifier];
      });
    }

    value = calculatedValue;

    if (badge.conditional && calculatedValue) {
      value = badge.rawValue;
    }

    if (badge.alt && calculatedValue) {
      value = calculatedValue;
    }

    if (badge.alt && !calculatedValue) {
      value = badge.rawValue;
    }
  }
  if (badge.class_) {
    if (typeof class_ === 'string') {
      class_ = badge.class_;
    } else {
      let calculatedValue = '';
      let involved_class = badge.class_ as InvolvedComplexDescription;
      if (involved_class.column) {
        if (typeof involved_class.column === 'string') {
          calculatedValue = item[involved_class.column];
        } else {
          involved_class.column.map((identifier) => {
            calculatedValue = calculatedValue
              ? `${calculatedValue} ${item[identifier]}`
              : item[identifier];
          });
        }
        value = calculatedValue;
        if (involved_class.conditional && calculatedValue) {
          value = involved_class.condValue
            ? involved_class.condValue
            : involved_class.rawValue;
        }
        if (!calculatedValue) {
          value = involved_class.rawValue;
        }
        if (involved_class.alt && calculatedValue) {
          value = involved_class.altValue
            ? involved_class.altValue
            : calculatedValue;
        }
        class_ = value;
      }
    }
  }

  return { value, class_ };
};

export const processFooterValue = (
  description: CardFooterDescription,
  item: any
) => {
  for (let desc of description.cardFooterActions) {
    if (desc.column) {
      if (typeof desc.column === 'string') {
        desc.label = item[desc.column];
      } else {
        desc.column.map((col) => {
          desc.label = desc.label ? `${desc.label} ${item[col]}` : item[col];
        });
      }
    }
  }

  return description;
};
