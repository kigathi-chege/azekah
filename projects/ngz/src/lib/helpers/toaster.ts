import { ToasterOptions, ToasterType } from "../core/types";

declare var Swal: any;

const toaster = (type: string, message: string, options?: ToasterOptions) => {
  let defaultOptions: ToasterOptions = {
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
  };
  return Swal.mixin(options || defaultOptions).fire({
    icon: type,
    title: message,
  });
};

export function toast(
  type: ToasterType,
  message: string,
  options?: ToasterOptions
) {
  return toaster(type, message, options);
}