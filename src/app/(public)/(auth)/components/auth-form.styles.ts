/** Label: overrides FormLabel dark:text-accent-foreground (white on light auth bg) */
export const authFormLabelClass =
  "text-base text-auth-label md:text-sm sm:text-sm !text-auth-label dark:!text-auth-label";

export const authFormInputClass =
  "h-14 border border-[#0EA5E9] rounded-xl bg-auth-input text-foreground text-base md:text-sm sm:text-sm placeholder:text-muted-foreground";

export const authFormInputWithIconClass = `${authFormInputClass} pl-14`;

export const authFormInputWithToggleClass = `${authFormInputWithIconClass} pr-14`;

export const authFormIconClass =
  "absolute left-5 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-auth-muted";

export const authFormSubmitButtonClass =
  "h-14 w-full rounded-xl bg-[#333333] font-semibold text-white hover:bg-[#444444] dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90";

export const authGradientHeadingClass =
  "bg-gradient-to-r from-[#0EA5E9] to-[#EE10E5] bg-clip-text text-xl font-semibold text-transparent sm:text-lg md:text-xl lg:text-xl xl:text-2xl 2xl:text-3xl 4xl:text-[40px]";

export const authSuccessBodyClass =
  "max-w-[468px] text-center text-lg text-auth-body sm:text-sm md:text-base 4xl:text-xl";

export const authHeadingClass =
  "text-xl font-medium text-auth-body sm:text-lg md:text-xl lg:text-xl xl:text-2xl 2xl:text-3xl 4xl:text-[40px]";

export const authSubheadingClass =
  "text-lg text-auth-body opacity-80 sm:text-sm md:text-base 4xl:text-xl";
