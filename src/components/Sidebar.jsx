import React from 'react'
import { NavLink } from 'react-router-dom'
import { 
  FiHome, FiUsers, FiActivity, FiShoppingCart, FiFileText 
} from 'react-icons/fi'

export default function Sidebar() {
  const navItems = [
    { to: '/', icon: FiHome, label: 'Dashboard' },
    { to: '/users', icon: FiUsers, label: 'Users' },
    { to: '/meters', icon: FiActivity, label: 'Meters' },
    { to: '/purchases', icon: FiShoppingCart, label: 'Purchases' },
    { to: '/reports', icon: FiFileText, label: 'Reports' },
  ]

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold">⚡ Meter Tracker</h1>
        <p className="text-sm text-gray-400">Admin Dashboard</p>
      </div>
      <nav className="flex-1 p-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg mb-1 transition ${
                isActive 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-800'
              }`
            }
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}