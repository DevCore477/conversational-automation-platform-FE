import React from 'react'

interface FeatureRow {
  feature: string;
  starter: string;
  growth: string;
  business: string;
  enterprise: string;
}

interface PricingTableProps {
  rows: FeatureRow[];
}

const PricingTable = ({ rows }: PricingTableProps) => {
  return (
    <div className="font-dm-sans bg-white rounded-2xl border border-slate-200 overflow-x-auto shadow-sm">
      <table className="w-full text-sm min-w-160">
        <thead>
          <tr className="bg-cyan-blue/5 border-b border-slate-200 text-dark-gray font-bold">
            <th className="text-left py-4 px-4">Feature</th>
            <th className="text-left py-4 px-4">Starter</th>
            <th className="text-left py-4 px-4">Growth</th>
            <th className="text-left py-4 px-4">Business</th>
            <th className="text-left py-4 px-4">Enterprise</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-b border-slate-100 text-slate-gray">
              <td className="py-3 px-4 font-medium">{row.feature}</td>
              <td className="py-3 px-4">{row.starter}</td>
              <td className="py-3 px-4">{row.growth}</td>
              <td className="py-3 px-4">{row.business}</td>
              <td className="py-3 px-4">{row.enterprise}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default PricingTable