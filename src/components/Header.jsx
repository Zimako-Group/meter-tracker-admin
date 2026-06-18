import React from 'react'

export default function Header({ onLogout, adminUser }) {
  return (
    <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
      <h2 className="text-xl font-semibold text-gray-800">Welcome back!</h2>
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600">
          {adminUser?.email}
        </span>
        <button
          onClick={onLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition text-sm"
        >
          Logout
        </button>
      </div>
    </header>
  )
}