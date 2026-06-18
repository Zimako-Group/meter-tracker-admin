import React, { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data) {
        setUsers(data)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Users</h1>
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Created</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="3" className="text-center py-4">Loading...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan="3" className="text-center py-4">No users found</td></tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-t">
                    <td className="px-4 py-3 text-sm">{user.email}</td>
                    <td className="px-4 py-3 text-sm">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        Active
                      </span>
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