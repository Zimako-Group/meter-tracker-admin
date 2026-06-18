import React, { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'
import { 
  FiUsers, FiActivity, FiShoppingCart, FiDollarSign 
} from 'react-icons/fi'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMeters: 0,
    totalPurchases: 0,
    totalRevenue: 0,
  })
  const [recentPurchases, setRecentPurchases] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchStats()
    fetchRecentPurchases()
  }, [])

  async function fetchStats() {
    try {
      console.log('🔍 Fetching stats...')
      
      let totalUsers = 0
      try {
        const { count, error } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
        if (!error && count !== null) {
          totalUsers = count
        }
      } catch (e) {
        console.log('Users table may not exist, using 0')
      }

      const { count: meters, error: metersError } = await supabase
        .from('meters')
        .select('*', { count: 'exact', head: true })
      
      if (metersError) {
        console.error('❌ Meters error:', metersError)
      }
      console.log('✅ Meters count:', meters)

      const { data: purchases, error: purchasesError } = await supabase
        .from('purchases')
        .select('*')
      
      if (purchasesError) {
        console.error('❌ Purchases error:', purchasesError)
        setError(purchasesError.message)
      }
      console.log('✅ Purchases data:', purchases)

      let totalRevenue = 0
      let totalPurchases = 0
      if (purchases) {
        totalPurchases = purchases.length
        purchases.forEach(p => {
          if (p.amount) totalRevenue += p.amount
        })
      }

      setStats({
        totalUsers: totalUsers,
        totalMeters: meters || 0,
        totalPurchases: totalPurchases,
        totalRevenue: totalRevenue,
      })
    } catch (error) {
      console.error('❌ Fetch error:', error)
      setError(error.message)
    }
  }

  async function fetchRecentPurchases() {
    try {
      console.log('🔍 Fetching recent purchases...')
      
      const { data, error } = await supabase
        .from('purchases')
        .select('*')
        .order('purchase_date', { ascending: false })
        .limit(10)

      if (error) {
        console.error('❌ Recent purchases error:', error)
        setError(error.message)
      }
      
      console.log('✅ Recent purchases:', data)
      
      if (data) {
        setRecentPurchases(data)
      }
    } catch (error) {
      console.error('❌ Fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    { title: 'Total Users', value: stats.totalUsers, icon: FiUsers, color: 'bg-blue-500' },
    { title: 'Total Meters', value: stats.totalMeters, icon: FiActivity, color: 'bg-green-500' },
    { title: 'Total Purchases', value: stats.totalPurchases, icon: FiShoppingCart, color: 'bg-purple-500' },
    { title: 'Total Revenue', value: `R${stats.totalRevenue.toFixed(2)}`, icon: FiDollarSign, color: 'bg-yellow-500' },
  ]

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p><strong>Error:</strong> {error}</p>
          <p className="mt-2">Check the browser console (F12) for more details.</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6 flex items-center">
            <div className={`${stat.color} p-3 rounded-full mr-4`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-500">{stat.title}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Recent Purchases</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Date</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">User ID</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Meter</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">Units</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">Amount</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="text-center py-4">Loading...</td></tr>
              ) : recentPurchases.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-4">No purchases yet</td></tr>
              ) : (
                recentPurchases.map((purchase) => (
                  <tr key={purchase.id} className="border-t">
                    <td className="px-4 py-3">
                      {new Date(purchase.purchase_date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 font-mono">
                      {purchase.user_id ? purchase.user_id.substring(0, 8) + '...' : 'N/A'}
                    </td>
                    <td className="px-4 py-3 font-mono">
                      {purchase.meter_id || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-right">{purchase.units} kWh</td>
                    <td className="px-4 py-3 text-right font-semibold">R{purchase.amount}</td>
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