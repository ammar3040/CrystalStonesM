import React, { useEffect, useState } from "react";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [subscribers, setSubscribers] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/admin/usertable`)
      .then((res) => res.json())
      .then((data) => {
        // Filter for login users
        const filteredUsers = data
          .filter((user) => {
            const onlyMobile = user.mobile && !user.uname && !user.email;
            const onlyEmail = user.Uname && user.email && !user.mobile;
            return onlyMobile || onlyEmail;
          })
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 10);
        setUsers(filteredUsers);

        // Filter for subscribed users
        const filteredSubscribers = data
          .filter((user) => user.
isSubscribed === true)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setSubscribers(filteredSubscribers);
      })
      .catch((err) => {
        console.error("Failed to fetch users:", err);
      });
  }, []);

  const getMessage = (user) => {
    if (user.mobile && !user.Uname && !user.email) {
      return "User logged in with mobile number.";
    } else if (user.email && !user.mobile) {
      return "User logged in with email.";
    } else if (user.email) {
      return "Subscribed user.";
    } else {
      return "Incomplete user data.";
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Recently Logged-in Users</h2>
      <div className="overflow-x-auto mb-10">
        <table className="min-w-full border border-gray-300 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Mobile</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Message</th>
              <th className="py-2 px-4 border-b">Date</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No recent users found.
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr key={index} className="text-center">
                  <td className="py-2 px-4 border-b">{user.Uname || "-"}</td>
                  <td className="py-2 px-4 border-b">{user.mobile || "-"}</td>
                  <td className="py-2 px-4 border-b">{user.email || "-"}</td>
                  <td className="py-2 px-4 border-b text-sm text-gray-600">
                    {getMessage(user)}
                  </td>
                  <td className="py-2 px-4 border-b text-sm text-gray-500">
                    {formatDate(user.createdAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {subscribers.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Subscribed Users</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border-b">Email</th>
                  <th className="py-2 px-4 border-b">Subscribed On</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((user, index) => (
                  <tr key={index} className="text-center">
                    <td className="py-2 px-4 border-b">
                      <a
                        href={`mailto:${user.email}`}
                        className="text-blue-600 underline"
                      >
                        {user.email}
                      </a>
                    </td>
                    <td className="py-2 px-4 border-b text-sm text-gray-500">
                      {formatDate(user.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
