export const getTypeOf = (value: any): string => {
    return typeof value;
  };

export const isArray = (value: any): boolean => {
  return Array.isArray(value);
};

export const isObjectEmpty = (objectName: object) =>
  Object.keys(objectName).length === 0;

export function extractFromPath(path: string, item: any) {
  const keys = path.split('.');
  let value;
  for (let i in keys) {
    let current_i = parseInt(i);
    let next_i = parseInt(i) + 1;
    if (current_i === 0) {
      value = item[keys[0]];
    } else {
      if (!value) break;
      value = value[keys[i]];
    }
    if (Array.isArray(value) && keys[next_i] !== 'length') {
      value = value[0];
    }
  }
  return value;
}