'use client';

import { AutoTable } from 'react-auto-crud';

import { taskSchema } from '@/features/tasks/models/task';
import { fetchTasks, createTask, updateTask, deleteTask } from '@/features/tasks/data';

export default function Page() {
  return (
    <>
      <AutoTable
        schema={taskSchema}
        queryKey="tasks"
        fetcher={fetchTasks}
        mutations={{
          create: createTask,
          update: updateTask,
          delete: deleteTask,
        }}
        title="Tasks Management"
        description="Manage tasks"
        defaultPageSize={5}
        searchColumn="title"
        searchPlaceholder="Search by title..."
      />
    </>
  );
}
