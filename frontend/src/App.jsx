import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;
// const API_URL =
//   import.meta.env.VITE_API_URL ||
//   "https://fastapi-example-hlnn.onrender.com";

export default function App() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    mobile_number: ""
  });

  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/users`);
      const data = await res.json();
      setUsers(data.data || []);
    } catch {
      setError("⚠️ Server not reachable");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));

      const res = await fetch(`${API_URL}/create-user`, {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.detail);

      setMessage("✅ User created!");
      setForm({ username: "", email: "", password: "", mobile_number: "" });
      fetchUsers();
    } catch (err) {
      setError("❌ " + err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center 
      bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white p-6">

      <div className="grid md:grid-cols-2 gap-6 w-full max-w-6xl">

        {/* FORM */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 
          p-6 rounded-2xl shadow-2xl">

          <h2 className="text-xl font-semibold mb-4">Create User</h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            <input name="username" value={form.username} onChange={handleChange}
              placeholder="Username"
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20 
              focus:ring-2 focus:ring-indigo-400 outline-none placeholder-gray-300"
            />

            <input name="email" value={form.email} onChange={handleChange}
              placeholder="Email"
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20 
              focus:ring-2 focus:ring-indigo-400 outline-none placeholder-gray-300"
            />

            <input type="password" name="password" value={form.password} onChange={handleChange}
              placeholder="Password"
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20 
              focus:ring-2 focus:ring-indigo-400 outline-none placeholder-gray-300"
            />

            <input name="mobile_number" value={form.mobile_number} onChange={handleChange}
              placeholder="Mobile"
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20 
              focus:ring-2 focus:ring-indigo-400 outline-none placeholder-gray-300"
            />

            <button className="w-full bg-indigo-500 hover:bg-indigo-600 
              transition p-3 rounded-lg font-semibold shadow-lg">
              Create User
            </button>
          </form>

          {message && <p className="text-green-400 mt-3">{message}</p>}
          {error && <p className="text-red-400 mt-3">{error}</p>}
        </div>

        {/* USERS */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 
          p-6 rounded-2xl shadow-2xl">

          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold">Users</h2>
            <button onClick={fetchUsers}
              className="bg-white/10 px-3 py-1 rounded-lg hover:bg-white/20">
              Refresh
            </button>
          </div>

          {users.length === 0 ? (
            <p className="text-gray-300">No users found</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b border-white/20 text-gray-300">
                <tr>
                  <th className="p-2 text-left">ID</th>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Email</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-white/10 transition">
                    <td className="p-2">{u.id}</td>
                    <td className="p-2">{u.username}</td>
                    <td className="p-2">{u.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}