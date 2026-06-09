"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/routing";
import { ArrowLeft, CheckSquare, Clock, AlertCircle, Flag } from "lucide-react";
import { useTranslations } from "next-intl";

interface Task {
  id: string; title: string; description: string | null;
  status: string; priority: string; createdAt: string;
}

export default function TasksPage() {
  const t = useTranslations("tasksPublic");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tasks/public")
      .then(r => r.json())
      .then(data => { setTasks(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const priorityColors: Record<string, string> = {
    high: "text-red-600 bg-red-50",
    medium: "text-amber-600 bg-amber-50",
    low: "text-green-600 bg-green-50",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-l from-[#1a5632] to-[#0f3d23] text-white">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 text-sm">
            <ArrowLeft className="w-4 h-4" />
            <span>{t('backToHome')}</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
            <CheckSquare className="w-8 h-8 text-[#c8a84e]" /> {t('title')}
          </h1>
          <p className="text-white/70 mt-2 max-w-2xl">
            {t('subtitle')}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-8 h-8 border-4 border-[#1a5632] border-t-transparent rounded-full" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-16">
            <CheckSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">{t('empty')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map(task => (
              <div key={task.id} className="bg-white rounded-2xl border p-5 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${priorityColors[task.priority] || priorityColors.medium}`}>
                        <Flag className="w-3 h-3 inline ml-1" />
                        {task.priority === "high" ? t('priorityHigh') : task.priority === "low" ? t('priorityLow') : t('priorityMedium')}
                      </span>
                      <span className="text-xs text-gray-400"><Clock className="w-3 h-3 inline ml-1" />{new Date(task.createdAt).toLocaleDateString("ar")}</span>
                    </div>
                    <h3 className="font-bold text-gray-900">{task.title}</h3>
                    {task.description && <p className="text-sm text-gray-600 mt-1 line-clamp-2">{task.description}</p>}
                  </div>
                  <span className={`shrink-0 text-xs font-bold px-3 py-1 rounded-full ${task.status === "in_progress" ? "bg-blue-50 text-blue-600" : "bg-gray-50 text-gray-500"}`}>
                    {task.status === "in_progress" ? t('statusInProgress') : t('statusPending')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
