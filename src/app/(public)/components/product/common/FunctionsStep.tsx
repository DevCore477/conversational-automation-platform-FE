import { CalendarDays, PhoneIncoming, Plus } from "lucide-react";

const FunctionsStep = () => {
  return (
    <div>
      <div className="font-dm-sans relative z-10 bg-white rounded-lg shadow-md p-5 w-full ">
        <div className="flex items-center justify-between mb-4">
          <span className="text-slate-gray font-semibold text-xs">Functions</span>
          <div className="size-4.5 rounded bg-warning flex items-center justify-center shadow">
            <Plus className="size-3.5 text-white" strokeWidth="3"/>
          </div>
        </div>
        <p className="text-[10px] text-start text-slate-gray mb-2 leading-tight ">
          Enable your agent with capabilities such as calendar bookings, call termination..
        </p>
        <div className="space-y-2">
            <div className="flex items-center gap-3 bg-[#F4F4F5] px-2 py-1 rounded opacity-80">
              <PhoneIncoming className="size-3 text-slate-gray" />
              <span className="text-[11px] font-medium text-slate-gray">Phone call</span>
            </div>
            <div className="flex items-center gap-3 bg-[#F4F4F5] px-2 py-1 rounded opacity-80">
              <CalendarDays className="size-3 text-slate-gray"/>
              <span className="text-[11px] font-medium text-slate-gray">Calendar</span>
            </div>
        </div>
      </div>
    </div>
  )
}

export default FunctionsStep