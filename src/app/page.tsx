'use client';

import {
  BanknotesIcon,
  ShoppingCartIcon,
  UserGroupIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

const stats = [
  {
    name: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1%",
    changeType: "increase",
    icon: BanknotesIcon,
  },
  {
    name: "Total Orders",
    value: "2,345",
    change: "+15.2%",
    changeType: "increase",
    icon: ShoppingCartIcon,
  },
  {
    name: "New Customers",
    value: "156",
    change: "+8.3%",
    changeType: "increase",
    icon: UserGroupIcon,
  },
  {
    name: "Conversion Rate",
    value: "3.2%",
    change: "-2.1%",
    changeType: "decrease",
    icon: ChartBarIcon,
  },
];

const recentOrders = [
  {
    id: "ORD001",
    customerName: "John Doe",
    product: "Redmi Note 13 Pro",
    amount: "$299.99",
    status: "Processing",
    date: "2024-02-20",
  },
  {
    id: "ORD002",
    customerName: "Jane Smith",
    product: "Redmi Note 13",
    amount: "$249.99",
    status: "Shipped",
    date: "2024-02-19",
  },
  {
    id: "ORD003",
    customerName: "Mike Johnson",
    product: "Redmi Note 13 Pro+",
    amount: "$349.99",
    status: "Delivered",
    date: "2024-02-18",
  },
];

const quickActions = [
  {
    name: "Add New Product",
    description: "Create a new product listing",
    href: "/admin/products/new",
    icon: ShoppingCartIcon,
  },
  {
    name: "Process Orders",
    description: "View and process pending orders",
    href: "/admin/orders",
    icon: ClipboardDocumentListIcon,
  },
  {
    name: "Manage Inventory",
    description: "Update stock levels and variants",
    href: "/admin/products",
    icon: ChartBarIcon,
  },
  {
    name: "View Reports",
    description: "Access sales and analytics reports",
    href: "/admin/analytics",
    icon: ChartBarIcon,
  },
];

export default function AdminPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard Overview</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.name}</p>
                <p className="text-2xl font-semibold mt-1">{stat.value}</p>
              </div>
              <stat.icon className="h-8 w-8 text-gray-400" />
            </div>
            <div className={`mt-4 text-sm ${
              stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
            }`}>
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              href={action.href}
              className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <action.icon className="h-8 w-8 text-gray-400 mb-3" />
              <h3 className="font-medium">{action.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.customerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.product}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
