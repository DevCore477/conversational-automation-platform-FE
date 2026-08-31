import { X } from 'lucide-react'
import React from 'react'

const PromptStep = () => {
  return (
    <div>
      <div className="font-dm-sans relative z-10 bg-white rounded-lg shadow-md p-3 w-full max-w-70 max-h-64 mx-auto">
        <div className="flex  items-center justify-between mb-2">
          <span className="text-slate-gray text-xs">Prompt</span>
          <div className="size-4.5 rounded bg-warning flex items-center justify-center">
            <X className="size-3.5 text-white" strokeWidth="3"/>
          </div>
        </div>

        <div className="text-start">
          <label className="text-[10px] text-slate-gray mb-2 block">
            Write prompt here
          </label>
          <div className="border rounded-lg py-1 px-1.5 ">
            <p className="text-[9px] text-slate-gray mb-3 leading-tigh">
              <span className="font-semibold text-slate-gray block mb-0.5">
                Step 03
              </span>
              Thank you for answering all the questions. I'd like to connect you with one of our specialized sales repetitive.
            </p>
            <p className="text-[10px] text-dark-gray font-medium leading-relaxed">
              "If the user said yes, call 'transfer_call' to transfer the call to a human."
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PromptStep