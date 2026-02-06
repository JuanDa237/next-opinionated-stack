import { z } from "zod";

import { withMetadata } from "react-auto-crud";

export const taskStatus = z.enum(['todo', 'in_progress', 'done']);
export const taskPriority = z.enum(['low', 'medium', 'high']);

export const taskSchema = z.object({
  id: withMetadata(z.string().uuid().optional(), {
    label: "ID",
    hidden: true,
    filterable: false,
    faceted: false,
    sortable: false,
    readOnly: true,
    placeholder: 'Auto-generated',
    description: 'Unique identifier for the task',
    order: 0,
  }),
  title: withMetadata(z.string().min(1, 'Title is required'), {
    label: "Title",
    hidden: false,
    filterable: true,
    faceted: false,
    sortable: false,
    readOnly: false,
    placeholder: 'Enter task title',
    description: 'Title of the task',
    order: 1,
  }),
  description: withMetadata(z.string().optional(), {
    label: "Description",
    hidden: false,
    filterable: true,
    faceted: false,
    sortable: false,
    readOnly: false,
    placeholder: 'Enter task description',
    description: 'Description of the task',
    order: 2,
    width: 50
  }),
  status: withMetadata(taskStatus.default('todo'), {
    label: "Status",
    hidden: false,
    filterable: true,
    faceted: true,
    sortable: false,
    readOnly: false,
    placeholder: 'Select task status',
    description: 'Status of the task',
    order: 3,
  }),
  priority: withMetadata(taskPriority.default('medium'), {
    label: "Priority",
    hidden: false,
    filterable: true,
    faceted: true,
    sortable: false,
    readOnly: false,
    placeholder: 'Select task priority',
    description: 'Priority of the task',
    order: 4,
  }),
  dueDate: withMetadata(z.iso.datetime().optional(), {
    label: "Due Date",
    hidden: false,
    filterable: false,
    faceted: false,
    sortable: true,
    readOnly: false,
    placeholder: 'Select due date',
    description: 'Due date of the task',
    order: 5,
  }),
  createdAt: withMetadata(z.iso.datetime().optional(), {
    label: "Due Date",
    hidden: true,
    filterable: false,
    faceted: false,
    sortable: true,
    readOnly: false,
    placeholder: 'Select due date',
    description: 'Due date of the task',
    order: 6,
  }),
  updatedAt: withMetadata(z.iso.datetime().optional(), {
    label: "Due Date",
    hidden: true,
    filterable: false,
    faceted: false,
    sortable: true,
    readOnly: false,
    placeholder: 'Select due date',
    description: 'Due date of the task',
    order: 7,
  }),
});

export type Task = z.infer<typeof taskSchema>;