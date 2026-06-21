"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Plus, Trash2, CheckCircle, Clock } from "lucide-react";
import { useTranslations } from "next-intl";

interface Task { id: string; title: string; description: string | null; status: string; priority: string; assignedTo: string | null; dueDate: string | null; createdAt: string; }
interface AppUser { id: string; name: string | null; email: string | null; }

const statusColors: Record<string, string> = { pending: "bg-amber-100 text-amber-700", in_progress: "bg-blue-100 text-blue-700", completed: "bg-green-100 text-green-700" };
const priorityColors: Record<string, string> = { low: "text-gray-400", medium: "text-amber-500", high: "text-red-500" };

export default function TasksPage() {
  const t = useTranslations("dashboard.tasksPage");
  const { status: authStatus } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState("medium");
  const [assignedTo, setAssignedTo] = useState("");
  const [filter, setFilter] = useState("all");

  const fetchTasks = async () => {
    const res = await fetch("/api/tasks"); const data = await res.json();
    if (Array.isArray(data)) setTasks(data);
  };
  const fetchUsers = async () => {
    try { const res = await fetch("/api/users"); const data = await res.json(); if (Array.isArray(data)) setUsers(data); } catch {}
  };
  useEffect(() => { if (authStatus === "authenticated") { fetchTasks(); fetchUsers(); } }, [authStatus]);

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const body: any = { title, description: desc, priority };
    if (assignedTo) body.assignedTo = assignedTo;
    const res = await fetch("/api/tasks", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (res.ok) { setTitle(""); setDesc(""); setPriority("medium"); setAssignedTo(""); fetchTasks(); }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    await fetch(`/api/tasks`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status: newStatus }) });
    fetchTasks();
  };

  const deleteTask = async (id: string) => {
    if (!confirm(t("confirmDelete"))) return;
    await fetch(`/api/tasks`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    fetchTasks();
  };

  const statusLabel: Record<string, string> = {
    pending: t("filterPending"),
    in_progress: t("filterInProgress"),
    completed: t("filterCompleted"),
  };

  const filtered = tasks.filter(t => filter === "all" || t.status === filter);
  const userName = (id: string) => users.find(u => u.id === id)?.name || id.slice(0, 8);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t("title")}</h1>

      <form onSubmit={createTask} className="bg-white rounded-2xl border p-4 mb-6 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder={t("titlePlaceholder")} className="flex-1 px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5632]" />
          <input value={desc} onChange={e => setDesc(e.target.value)} placeholder={t("descPlaceholder")} className="flex-1 px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5632]" />
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <select value={priority} onChange={e => setPriority(e.target.value)} className="px-3 py-2.5 border rounded-xl text-sm bg-white">
            <option value="low">{t("priority.low")}</option>
            <option value="medium">{t("priority.medium")}</option>
            <option value="high">{t("priority.high")}</option>
          </select>
          <select value={assignedTo} onChange={e => setAssignedTo(e.target.value)} className="px-3 py-2.5 border rounded-xl text-sm bg-white flex-1">
            <option value="">{t("unassigned")}</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.name || u.email}</option>)}
          </select>
          <button type="submit" className="flex items-center gap-2 bg-[#1a5632] hover:bg-[#0f3d23] text-white px-5 py-2.5 rounded-xl text-sm transition-colors">
            <Plus className="w-4 h-4" /> {t("addTask")}
          </button>
        </div>
      </form>

      <div className="flex gap-2 mb-4 flex-wrap">
        {["all", "pending", "in_progress", "completed"].map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-xl text-sm border transition-colors ${filter === s ? "bg-[#1a5632] text-white border-[#1a5632]" : "text-gray-600 hover:bg-gray-50"}`}>
            {s === "all" ? t("filterAll") : statusLabel[s]}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map(task => (
          <div key={task.id} className="bg-white rounded-xl border p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <button onClick={() => updateStatus(task.id, task.status === "completed" ? "pending" : "completed")} className={`flex-shrink-0 w-5 h-5 rounded-full border-2 ${task.status === "completed" ? "bg-green-500 border-green-500" : "border-gray-300"} flex items-center justify-center`}>
                {task.status === "completed" && <CheckCircle className="w-4 h-4 text-white" />}
              </button>
              <div className="min-w-0">
                <p className={`font-medium text-gray-900 truncate ${task.status === "completed" ? "line-through text-gray-400" : ""}`}>{task.title}</p>
                {task.description && <p className="text-sm text-gray-500 truncate">{task.description}</p>}
                {task.assignedTo && <p className="text-xs text-gray-400 mt-0.5">{t("assignedTo")}: {userName(task.assignedTo)}</p>}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Clock className={priorityColors[task.priority] || "text-gray-400"} />
              <span className={`px-2 py-0.5 rounded-full text-xs ${statusColors[task.status] || "bg-gray-100 text-gray-600"}`}>{statusLabel[task.status]}</span>
              <button onClick={() => deleteTask(task.id)} className="p-1 hover:bg-red-50 rounded text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-center text-gray-400 py-8">{t("noTasks")}</p>}
      </div>
    </div>
  );
}
