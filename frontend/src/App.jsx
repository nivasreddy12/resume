import { useEffect, useState } from "react";

const API_URL = "https://fastapi-example-hlnn.onrender.com";

function App() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    mobile_number: ""
  });

  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/users`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Failed to fetch users");
      }

      setUsers(data.data);
    } catch (err) {
      console.error(err);
      setError("❌ Unable to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Submit form (IMPORTANT FIX HERE)
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const formData = new FormData();
      formData.append("username", form.username);
      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("mobile_number", form.mobile_number);

      const res = await fetch(`${API_URL}/create-user`, {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "User creation failed");
      }

      setMessage("✅ User created successfully!");

      // Reset form
      setForm({
        username: "",
        email: "",
        password: "",
        mobile_number: ""
      });

      // Refresh list
      fetchUsers();

    } catch (err) {
      console.error(err);
      setError("❌ Failed to create user. Try again.");
    }
  };

  // 🔹 Initial load
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>🚀 User Management</h2>

      {/* 🔹 Create User */}
      <h3>➕ Create User</h3>
      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Username" value={form.username} onChange={handleChange} required /><br /><br />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required /><br /><br />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required /><br /><br />
        <input name="mobile_number" placeholder="Mobile Number" value={form.mobile_number} onChange={handleChange} required /><br /><br />

        <button type="submit">Create User</button>
      </form>

      {/* 🔹 Messages */}
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <hr />

      {/* 🔹 Users List */}
      <h3>👥 Users List</h3>
      <button onClick={fetchUsers}>🔄 Refresh</button>

      {loading && <p>⏳ Loading...</p>}

      {!loading && users.length === 0 && <p>No users found</p>}

      {!loading && users.length > 0 && (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Mobile</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.mobile_number}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;