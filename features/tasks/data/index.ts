import { LocalStorageTaskDatasource } from './datasources/local-storage-task-datasource';
import { TaskRepository } from './repositories/task-repository';

/**
 * Initialize the task repository with localStorage datasource
 * This is the default datasource, but can be easily swapped later
 */
const taskDatasource = new LocalStorageTaskDatasource();
const taskRepository = new TaskRepository(taskDatasource);

/**
 * Exported functions for use with AutoTable component
 * These provide the interface between the UI and the data layer
 */

export const fetchTasks = taskRepository.fetchTasks.bind(taskRepository);
export const createTask = taskRepository.createTask.bind(taskRepository);
export const updateTask = taskRepository.updateTask.bind(taskRepository);
export const deleteTask = taskRepository.deleteTask.bind(taskRepository);

// Export datasource interface for future implementations
export type { ITaskDatasource } from './datasources/task-datasource.interface';
