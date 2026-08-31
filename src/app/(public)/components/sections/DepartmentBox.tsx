interface DepartmentBoxProps {
  title: string;
  onClick: () => void;
  index: number;
  isActive: boolean;
}
export default function DepartmentBox({ ...props }: DepartmentBoxProps) {
  return (
    <button
      className="bg-white shadow-[0_4px_4px_rgba(14,165,233,0.10)] rounded-[12px] lg:rounded-[16px] 4xl:rounded-[20px] h-16 md:h-16 lg:h-[72px] 4xl:h-20 w-full min-w-[80px] flex items-center justify-center cursor-pointer"
      onClick={props.onClick}
    >
      <p
        className={`${props.isActive ? "text-cyan-blue" : "text-text-dark"} text-xs lg:text-sm font-medium`}
      >
        {props.title}
      </p>
    </button>
  );
}
