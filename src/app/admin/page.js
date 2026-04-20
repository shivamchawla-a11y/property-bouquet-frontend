export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-3 gap-6">

        <div className="bg-white p-5 rounded shadow">
          <h2 className="text-gray-500">Total Properties</h2>
          <p className="text-2xl font-bold">12</p>
        </div>

        <div className="bg-white p-5 rounded shadow">
          <h2 className="text-gray-500">Locations</h2>
          <p className="text-2xl font-bold">5</p>
        </div>

        <div className="bg-white p-5 rounded shadow">
          <h2 className="text-gray-500">Builders</h2>
          <p className="text-2xl font-bold">3</p>
        </div>

      </div>
    </div>
  );
}