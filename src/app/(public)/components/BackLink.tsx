import Link from "next/link";

type BackButtonProps = {
  href: string;
};

export const BackButton = ({ href }: BackButtonProps) => {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 font-medium text-[#0EA5E9] hover:underline cursor-pointer"
    >
      <svg
        width="16"
        height="12"
        viewBox="0 0 16 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8 0H4.94048L0 6L4.94048 12H8L3.05932 6L8 0Z"
          fill="#0EA5E9"
        />
        <path
          d="M16 0H12.9405L8 6L12.9405 12H16L11.0593 6L16 0Z"
          fill="#0EA5E9"
        />
      </svg>

      <span>Back</span>
    </Link>
  );
};