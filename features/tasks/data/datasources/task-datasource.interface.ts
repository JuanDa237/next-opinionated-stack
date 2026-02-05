import { Task } from '../../models/task';

import { ApiRequest, ApiResponse } from 'react-auto-crud';

/**
 * Interface for task data sources
 * Defines CRUD operations that any datasource implementation must provide
 */
export interface ITaskDatasource {
    /**
     * Query tasks with server-side filtering, sorting, and pagination
     */
    queryData(request: ApiRequest): Promise<ApiResponse<Task>>

    /**
     * Get all tasks
     */
    getAll(): Promise<Task[]>;

    /**
     * Get a task by ID
     */
    getById(id: string): Promise<Task | null>;

    /**
     * Create a new task
     */
    create(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task>;

    /**
     * Update an existing task
     */
    update(id: string, task: Partial<Task>): Promise<Task>;

    /**
     * Delete a task
     */
    delete(id: string): Promise<void>;
}
