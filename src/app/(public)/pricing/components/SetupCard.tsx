import React from 'react'

export interface SetupCardProps {
  title: string;
  price: string;
  description: string;
}

const SetupCard = ({ title, price, description }: SetupCardProps) => {
  return (
    <div className="font-dm-sans bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
      <h3 className="text- font-semibold text-dark-gray">{title}</h3>
      <div className="text-lg xl:text-xl 4xl:text-2xl font-semibold text-cyan-blue mt-1">
        {price}
      </div>
      <p className="text-sm text-slate-gray mt-1">{description}</p>
    </div>
  )
}

export default SetupCard