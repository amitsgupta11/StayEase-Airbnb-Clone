import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiTrash2, FiEdit2 } from "react-icons/fi";
import { adminService } from "../../services/admin.service.js";
import { formatDate, getInitials } from "../../utils/helpers.js";
import LoadingPage from "../../components/ui/LoadingPage.jsx";

const ROLE_COLORS = { user:"bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300", host:"bg-blue-100 text-blue-700", admin:"bg-red-100 text-red-700" };

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRole, setEditingRole] = useState(null);

  const load = () => adminService.getUsers().then(r => setUsers(r.data.data.users)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this user permanently?")) return;
    try {
      await adminService.deleteUser(id);
      setUsers(p => p.filter(u => u._id !== id));
      toast.success("User deleted");
    } catch (e) { toast.error(e.response?.data?.message || "Failed"); }
  };

  const handleRoleChange = async (id, role) => {
    try {
      await adminService.updateRole(id, role);
      setUsers(p => p.map(u => u._id===id ? {...u, role} : u));
      setEditingRole(null);
      toast.success("Role updated");
    } catch (e) { toast.error("Failed to update role"); }
  };

  if (loading) return <LoadingPage/>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold dark:text-white mb-8">Manage Users ({users.length})</h1>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {users.map(u => (
                <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {u.avatar?.url ? <img src={u.avatar.url} className="w-full h-full rounded-full object-cover" alt=""/> : getInitials(u.name)}
                      </div>
                      <span className="font-medium dark:text-white">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{u.email}</td>
                  <td className="px-4 py-3">
                    {editingRole === u._id ? (
                      <div className="flex gap-1">
                        {["user","host","admin"].map(r => (
                          <button key={r} onClick={() => handleRoleChange(u._id, r)}
                            className={`px-2 py-1 rounded text-xs font-medium ${ROLE_COLORS[r]}`}>{r}</button>
                        ))}
                        <button onClick={() => setEditingRole(null)} className="px-2 py-1 text-xs text-gray-400">✕</button>
                      </div>
                    ) : (
                      <span className={`badge text-xs capitalize ${ROLE_COLORS[u.role]}`}>{u.role}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{formatDate(u.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => setEditingRole(u._id)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500 dark:text-gray-400">
                        <FiEdit2 size={14}/>
                      </button>
                      {u.role !== "admin" && (
                        <button onClick={() => handleDelete(u._id)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-500">
                          <FiTrash2 size={14}/>
                        </button>
                      )}
                    </div>
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
