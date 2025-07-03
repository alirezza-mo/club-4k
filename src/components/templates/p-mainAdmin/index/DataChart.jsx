import React from 'react'

function DataCart() {
    const stats = [
    { title: 'کل کاربران', value: '۱,۲۰۳', icon: '👥', color: 'bg-blue-600' },
    { title: 'کل گیم نت ها', value: '۵۶۷', icon: '🎮', color: 'bg-yellow-500' },
    { title: 'کل ادمین ها', value: '۸۹', icon: '⚒️', color: 'bg-red-600' },
    { title: 'کل تیکت ها', value: '۸۹', icon: '🎫', color: 'bg-red-600' },
    { title: 'کل چلنج ها', value: '۵۶۷', icon: '⚔️', color: 'bg-yellow-500' },
    { title: 'کل کامنت ها', value: '۲,۳۴۵', icon: '💬', color: 'bg-green-600' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="relative bg-white dark:bg-gray-800 rounded-lg p-6 animate-fadeIn"
            >
              <div className="absolute inset-0 rounded-lg  opacity-20"></div>
              <div className="relative flex items-center gap-4">
                <span className={`text-4xl ${stat.color} p-3 rounded-full text-white`}>{stat.icon}</span>
                <div>
                  <h2 className="text-lg text-gray-700 dark:text-gray-200">{stat.title}</h2>
                  <p className="text-2xl font-bold text-orange-600 dark:text-gold">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
  )
}

export default DataCart