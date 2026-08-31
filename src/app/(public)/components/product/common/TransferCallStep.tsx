import { X } from 'lucide-react'
import React from 'react'

const TransferCallStep = () => {
  return (
    <>
      <div className="font-dm-sans relative z-10 bg-white rounded-lg shadow-md p-3 w-full max-w-  scale-90 origin-center">
        <div className="flex items-center justify-between  mb-2">
          <span className=" text-slate-gray font-semibold text-xs">Transfer Call</span>
          <div className="size-4.5 rounded bg-warning flex items-center justify-center">
            <X className="size-3.5 text-white" strokeWidth="3"/>
          </div>
        </div>

        <div className="mb-2 text-start">
          <label className="text-[10px] text-slate-gray mb-1.5 block">
            Transfer to
          </label>
          <div className="bg-white border border-gray-200 rounded px-2">
            <span className="text-[11px] text-slate-gray">
              + 571 1289 2345
            </span>
          </div>
        </div>

        <div className="mb-1 text-start">
          <label className="text-[10px] text-slate-gray mb-1.5 block">
            Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-[#F4F4F5] rounded p-2 flex items-start justify-between">
              <div>
                <span className="text-[10px] font-semibold text-dark-gray block mb-0.5">
                  Cold Transfer
                </span>
                <span className="text-[8px] text-slate-gray leading-[1.1] block">
                  AI transfers without speaking
                </span>
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-white mt-0.5 shrink-0"></div>
            </div>
            <div className="bg-[#F4F4F5] rounded p-2.5 flex items-start justify-between">
              <div>
                <span className="text-[10px] font-semibold text-dark-gray block mb-0.5">
                  Warm Transfer
                </span>
                <span className="text-[8px] text-slate-gray leading-[1.1] block">
                  AI brief's the next agent after transfer
                </span>
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-blue mt-0.5 shrink-0"></div>
            </div>
          </div>
        </div>

        <div className="text-start">
          <label className="text-[10px] text-slate-gray mb-1.5 block">
            Handoff Message
          </label>
          <div className="bg-white border rounded p-1 ">
            <p className="text-[10px] text-slate-gray leading-snug">
              Say hello to the agent and summarize the user problem to him.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default TransferCallStep