import { ApiRequest, ApiResponse } from 'react-auto-crud';

import { Task, taskSchema } from '../../models/task';
import { ITaskDatasource } from './task-datasource.interface';

/**
 * LocalStorage implementation of task datasource
 * Stores tasks in browser's localStorage with real-time persistence
 */
export class LocalStorageTaskDatasource implements ITaskDatasource {
    private readonly storageKey = 'tasks';

    /**
     * Query tasks with server-side filtering, sorting, and pagination
     */
    async queryData(request: ApiRequest): Promise<ApiResponse<Task>> {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 300));

        const allTasks = this.getTasks();
        let tasks = [...allTasks];

        if (request.filters && request.filters.length > 0) {
            request.filters.forEach((filter) => {
                tasks = tasks.filter((task) => {
                    const value = task[filter.id as keyof Task];

                    if (Array.isArray(filter.value)) {
                        return filter.value.includes(value);
                    }

                    if (typeof value === 'string') {
                        return value
                            .toLowerCase()
                            .includes(String(filter.value).toLowerCase());
                    }

                    return value === filter.value;
                });
            });
        }

        if (request.sorting && request.sorting.length > 0) {
            const sort = request.sorting[0];
            tasks.sort((a, b) => {
                const aVal = a[sort.id as keyof Task]!;
                const bVal = b[sort.id as keyof Task]!;

                if (aVal < bVal) return sort.desc ? 1 : -1;
                if (aVal > bVal) return sort.desc ? -1 : 1;
                return 0;
            });
        }

        const total = tasks.length;
        const start = request.pageIndex * request.pageSize;
        const end = start + request.pageSize;
        const data = tasks.slice(start, end);

        const faceted = {
            status: [
                {
                    value: 'todo',
                    label: 'To Do',
                    count: allTasks.filter((t) => t.status === 'todo').length,
                },
                {
                    value: 'in_progress',
                    label: 'In Progress',
                    count: allTasks.filter((t) => t.status === 'in_progress').length,
                },
                {
                    value: 'done',
                    label: 'Done',
                    count: allTasks.filter((t) => t.status === 'done').length,
                },
            ],
            priority: [
                {
                    value: 'low',
                    label: 'Low',
                    count: allTasks.filter((t) => t.priority === 'low').length,
                },
                {
                    value: 'medium',
                    label: 'Medium',
                    count: allTasks.filter((t) => t.priority === 'medium').length,
                },
                {
                    value: 'high',
                    label: 'High',
                    count: allTasks.filter((t) => t.priority === 'high').length,
                },
            ],
        };

        return { data, total, faceted };
    }

    /**
     * Get tasks from localStorage
     */
    private getTasks(): Task[] {
        if (typeof window === 'undefined') return [];

        const data = localStorage.getItem(this.storageKey);
        if (!data) return this.initializeMockData();

        try {
            return JSON.parse(data);
        } catch {
            return this.initializeMockData();
        }
    }

    /**
     * Save tasks to localStorage
     */
    private saveTasks(tasks: Task[]): void {
        if (typeof window === 'undefined') return;
        localStorage.setItem(this.storageKey, JSON.stringify(tasks));
    }

    /**
     * Initialize mock data for first-time usage
     */
    private initializeMockData(): Task[] {
        const mockTasks: Task[] = [
            {
                id: crypto.randomUUID(),
                title: 'Complete project documentation',
                description: 'Write comprehensive documentation for the new feature',
                status: 'in_progress',
                priority: 'high',
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                id: crypto.randomUUID(),
                title: 'Review pull requests',
                description: 'Review and approve pending pull requests from the team',
                status: 'todo',
                priority: 'medium',
                dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                id: crypto.randomUUID(),
                title: 'Update dependencies',
                description: 'Update npm packages to latest versions',
                status: 'todo',
                priority: 'low',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                id: crypto.randomUUID(),
                title: 'Fix authentication bug',
                description: 'Resolve the issue with OAuth login flow',
                status: 'done',
                priority: 'high',
                dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
                id: crypto.randomUUID(),
                title: 'Prepare team meeting agenda',
                description: 'Create agenda for next week\'s sprint planning',
                status: 'in_progress',
                priority: 'medium',
                dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
        ];

        this.saveTasks(mockTasks);
        return mockTasks;
    }

    async getAll(): Promise<Task[]> {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 300));
        return this.getTasks();
    }

    async getById(id: string): Promise<Task | null> {
        await new Promise((resolve) => setTimeout(resolve, 200));
        const tasks = this.getTasks();
        return tasks.find((task) => task.id === id) || null;
    }

    async create(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
        await new Promise((resolve) => setTimeout(resolve, 300));

        const tasks = this.getTasks();
        const newTask: Task = {
            ...taskData,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        // Validate with Zod schema
        const validated = taskSchema.parse(newTask);

        tasks.push(validated);
        this.saveTasks(tasks);
        return validated;
    }

    async update(id: string, taskData: Partial<Task>): Promise<Task> {
        await new Promise((resolve) => setTimeout(resolve, 300));

        const tasks = this.getTasks();
        const index = tasks.findIndex((task) => task.id === id);

        if (index === -1) {
            throw new Error(`Task with id ${id} not found`);
        }

        const updatedTask: Task = {
            ...tasks[index],
            ...taskData,
            id, // Ensure ID doesn't change
            updatedAt: new Date().toISOString(),
        };

        // Validate with Zod schema
        const validated = taskSchema.parse(updatedTask);

        tasks[index] = validated;
        this.saveTasks(tasks);
        return validated;
    }

    async delete(id: string): Promise<void> {
        await new Promise((resolve) => setTimeout(resolve, 300));

        const tasks = this.getTasks();
        const index = tasks.findIndex((task) => task.id === id);

        if (index === -1) {
            throw new Error(`Task with id ${id} not found`);
        }

        tasks.splice(index, 1);
        this.saveTasks(tasks);
    }
}
