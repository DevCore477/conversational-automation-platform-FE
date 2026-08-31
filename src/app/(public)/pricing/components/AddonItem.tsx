import React from 'react'

export interface AddonItemProps {
  label: string;
  price: string;
}

const AddonItem = ({ label, price }: AddonItemProps) => {
  return (
    <div className="font-dm-sans bg-white rounded-full px-5 py-2 border border-slate-200 shadow-sm flex items-center gap-3 text-sm font-medium">
      <span className="text-dark-gray font-semibold">{label}:</span>
      <span className="text-cyan-blue font-medium">{price}</span>
    </div>
  )
}

export default AddonItem



