import {
  authHeadingClass,
  authSubheadingClass,
} from "@/app/(public)/(auth)/components/auth-form.styles";

type AuthFormHeaderProps = {
  title: string;
  subtitle?: string;
};

export function AuthFormHeader({ title, subtitle }: AuthFormHeaderProps) {
  return (
    <div className="flex flex-col gap-2 px-2">
      <h1 className={authHeadingClass}>{title}</h1>
      {subtitle ? <p className={authSubheadingClass}>{subtitle}</p> : null}
    </div>
  );
}
