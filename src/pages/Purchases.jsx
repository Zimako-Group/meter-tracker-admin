import React, { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'

export default function Purchases() {
  const [purchases, setPurchases] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalRevenue, setTotalRevenue] = useState(0)

  useEffect(() => {
    fetchPurchases()
  }, [])

  async function fetchPurchases() {
    try {
      console.log('🔍 Fetching purchases...')
      
      const { data, error } = await supabase
        .from('purchases')
        .select('*')
        .order('purchase_date', { ascending: false })

      if (error) {
        console.error('❌ Purchases error:', error)
      } else {
        console.log('✅ Purchases data:', data)
        setPurchases(data)
        let revenue = 0
        data.forEach(p => revenue += p.amount)
        setTotalRevenue(revenue)
      }
    } catch (error) {
      console.error('❌ Fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Purchases</h1>
        <div className="bg-green-100 px-4 py-2 rounded-lg">
          <span className="text-gray-600">Total Revenue: </span>
          <span className="font-bold text-green-700">R{totalRevenue.toFixed(2)}</span>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Date</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">User ID</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Meter ID</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">Units</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">Amount</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Token</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center py-4">Loading...</td></tr>
              ) : purchases.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-4">No purchases found</td></tr>
              ) : (
                purchases.map((purchase) => (
                  <tr key={purchase.id} className="border-t">
                    <td className="px-4 py-3">
                      {new Date(purchase.purchase_date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 font-mono">
                      {purchase.user_id ? purchase.user_id.substring(0, 8) + '...' : 'N/A'}
                    </td>
                    <td className="px-4 py-3 font-mono">
                      {purchase.meter_id}
                    </td>
                    <td className="px-4 py-3 text-right">{purchase.units} kWh</td>
                    <td className="px-4 py-3 text-right font-semibold">R{purchase.amount}</td>
                    <td className="px-4 py-3 font-mono">
                      {purchase.token_code || 'N/A'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}