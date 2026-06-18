import React, { useState, useEffect, useRef } from 'react'
import { supabase } from '../utils/supabase'

export default function Reports() {
  const [reportData, setReportData] = useState({
    totalUsers: 0,
    totalMeters: 0,
    totalPurchases: 0,
    totalRevenue: 0,
    monthlyRevenue: [],
  })
  const [loading, setLoading] = useState(true)
  const printRef = useRef()

  useEffect(() => {
    fetchReportData()
  }, [])

  async function fetchReportData() {
    try {
      const { count: users } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })

      const { count: meters } = await supabase
        .from('meters')
        .select('*', { count: 'exact', head: true })

      const { data: purchases } = await supabase
        .from('purchases')
        .select('amount, purchase_date')

      let totalRevenue = 0
      if (purchases) {
        purchases.forEach(p => totalRevenue += p.amount)
      }

      const monthlyRevenue = {}
      const now = new Date()
      for (let i = 0; i < 6; i++) {
        const month = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const key = month.toLocaleDateString('en-ZA', { month: 'long', year: 'numeric' })
        monthlyRevenue[key] = 0
      }

      if (purchases) {
        purchases.forEach(p => {
          const date = new Date(p.purchase_date)
          const key = date.toLocaleDateString('en-ZA', { month: 'long', year: 'numeric' })
          if (monthlyRevenue.hasOwnProperty(key)) {
            monthlyRevenue[key] += p.amount
          }
        })
      }

      setReportData({
        totalUsers: users || 0,
        totalMeters: meters || 0,
        totalPurchases: purchases?.length || 0,
        totalRevenue: totalRevenue,
        monthlyRevenue: Object.entries(monthlyRevenue).reverse(),
      })
    } catch (error) {
      console.error('Error fetching report data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleExport = () => {
    let csv = 'Report\n'
    csv += `Total Users,${reportData.totalUsers}\n`
    csv += `Total Meters,${reportData.totalMeters}\n`
    csv += `Total Purchases,${reportData.totalPurchases}\n`
    csv += `Total Revenue,R${reportData.totalRevenue.toFixed(2)}\n\n`
    csv += 'Monthly Revenue\n'
    csv += 'Month,Revenue\n'
    reportData.monthlyRevenue.forEach(([month, revenue]) => {
      csv += `${month},R${revenue.toFixed(2)}\n`
    })
    csv += `\nReport Generated: ${new Date().toLocaleString('en-ZA')}`

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `report_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading report...</div>
  }

  return (
    <div ref={printRef}>
      <div className="flex justify-between items-center mb-6 no-print">
        <h1 className="text-2xl font-bold">Reports</h1>
        <div className="space-x-2">
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            Export CSV
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            🖨️ Print Report
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Summary Report</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Total Users</p>
            <p className="text-2xl font-bold">{reportData.totalUsers}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Total Meters</p>
            <p className="text-2xl font-bold">{reportData.totalMeters}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Total Purchases</p>
            <p className="text-2xl font-bold">{reportData.totalPurchases}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Total Revenue</p>
            <p className="text-2xl font-bold text-green-600">R{reportData.totalRevenue.toFixed(2)}</p>
          </div>
        </div>

        <h3 className="font-semibold mb-3">Monthly Revenue (Last 6 Months)</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Month</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {reportData.monthlyRevenue.map(([month, revenue]) => (
                <tr key={month} className="border-t">
                  <td className="px-4 py-3 text-sm">{month}</td>
                  <td className="px-4 py-3 text-sm text-right font-semibold">R{revenue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-sm text-gray-500 border-t pt-4">
          <p>Report Generated: {new Date().toLocaleString('en-ZA')}</p>
        </div>
      </div>

      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          .bg-white.rounded-lg.shadow.p-6 {
            box-shadow: none !important;
            border: 1px solid #ddd;
          }
          body {
            background: white !important;
          }
        }
      `}</style>
    </div>
  )
}