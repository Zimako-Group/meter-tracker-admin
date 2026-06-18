import React, { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'

export default function Meters() {
  const [meters, setMeters] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMeters()
  }, [])

  async function fetchMeters() {
    try {
      console.log('🔍 Fetching meters...')
      
      const { data, error } = await supabase
        .from('meters')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Meters error:', error)
      } else {
        console.log('✅ Meters data:', data)
        setMeters(data)
      }
    } catch (error) {
      console.error('❌ Fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Meters</h1>
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Meter Number</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">User ID</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Municipality</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Created</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" className="text-center py-4">Loading...</td></tr>
              ) : meters.length === 0 ? (
                <tr><td colSpan="4" className="text-center py-4">No meters found</td></tr>
              ) : (
                meters.map((meter) => (
                  <tr key={meter.id} className="border-t">
                    <td className="px-4 py-3 font-mono">{meter.meter_number}</td>
                    <td className="px-4 py-3 font-mono">
                      {meter.user_id ? meter.user_id.substring(0, 8) + '...' : 'N/A'}
                    </td>
                    <td className="px-4 py-3">{meter.municipality || 'N/A'}</td>
                    <td className="px-4 py-3">
                      {new Date(meter.created_at).toLocaleDateString()}
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