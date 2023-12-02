import { IconExclamationCircle } from "@tabler/icons-react";
import { type TFunction } from "i18next";

export default function FieldErrorMessage(
  { t, i18nkey, dict }:
  { t: TFunction, i18nkey: string, dict?: {[k: string]: any} }
) {
  return (
    <div className='alert alert-error  text-sm mt-1 p-3 gap-1 sm:justify-start sm:p-4 sm:gap-3'>
      <IconExclamationCircle aria-hidden size={22} />
      {t(i18nkey, dict) as string}
    </div>
  );
}
