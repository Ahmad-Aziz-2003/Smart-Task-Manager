import React from "react";
import StatBox from "./StatBox";

export default function OverviewStatsCard({
  totalTasks,
  completedTasksCount,
  pendingTasks,
  overdueTasks,
}) {
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatBox
        label="Total Tasks"
        value={totalTasks}
        color="blue"
        icon="📋"
      />
      <StatBox
        label="Completed"
        value={completedTasksCount}
        color="green"
        icon="✅"
        hint={`${completionRate}% completion rate`}
      />
      <StatBox
        label="Pending"
        value={pendingTasks}
        color="yellow"
        icon="⏳"
      />
      <StatBox
        label="Overdue"
        value={overdueTasks}
        color="red"
        icon="⚠️"
      />
    </div>
  );
}
