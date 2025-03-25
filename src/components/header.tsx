import { BellIcon } from "@heroicons/react/24/outline";

export function Header() {
  return (
    <header className="h-16 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-full px-6">
        <h2 className="text-lg font-semibold text-gray-900">Dashboard</h2>
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-500 hover:text-gray-700">
            <BellIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
} 