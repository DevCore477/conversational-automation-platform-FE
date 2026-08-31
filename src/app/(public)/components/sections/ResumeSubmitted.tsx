import React from "react";
import { ArrowRight, FileCheck } from "lucide-react";

const ResumeSubmitted = () => {
  return (
    <>
      <div className="py-8 lg:py-16 min-h-[70vh] flex items-center">
        <div className="w-full">
          <div className="flex items-center gap-2 text-slate-gray text-sm lg:text-base 2xl:text-xl 4xl:text-2xl">
            <span>Careers</span>
            <ArrowRight size={16} />
            <span>Send your resume</span>
            <ArrowRight size={16} />
            <span className="bg-gradient-to-r from-cyan-blue to-neon-pink bg-clip-text text-transparent font-medium">
              Submitted
            </span>
          </div>

          <div className="bg-gradient-to-b from-blue-50 to-blue-100 text-dark-gray rounded-lg p-16 mt-8 lg:mt-20">
            <div className="flex flex-col items-center gap- max-w-sm mx-auto">
              <span className="text-slate-gray">
                <FileCheck className="size-10 lg:size-12 2xl:size-16" />
              </span>
              <h2 className="text-lg lg:text-2xl 2xl:text-3xl mt-3 font-medium">
                Application Submitted
              </h2>
              <h2 className="text-lg lg:text-2xl 2xl:text-3xl font-medium">
                Successfully
              </h2>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResumeSubmitted;
