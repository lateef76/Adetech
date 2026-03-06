export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome to Adetech Quincaillerie</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Total Products</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">0</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Total Clients</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">0</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Total Invoices</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">0</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Revenue</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">0 FCFA</p>
        </div>
      </div>
    </div>
  );
}
