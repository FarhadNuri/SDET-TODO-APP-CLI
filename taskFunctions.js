import { TodoList } from './db.js';
import { Op } from 'sequelize';


async function addTask(userId, title, description, dueDate, priority) {
    if (!title || title.trim() === '') {
        console.log('---------------------------');
        console.log('Task title cannot be empty.');
        console.log('---------------------------');
        return null;
    }

    const validPriorities = ['Low', 'Medium', 'High'];
    if (!validPriorities.includes(priority)) {
        console.log('--------------------------------------');
        console.log('Priority must be Low, Medium, or High.');
        console.log('--------------------------------------');
        return null;
    }

    const task = await TodoList.create({
        userId,
        title,
        description,
        dueDate,
        priority,
        status: 'Pending'
    });
    console.log('------------------------');
    console.log('Task added successfully!');
    console.log('------------------------');
    return task;
}

async function viewAllTasks(userId) {
    const tasks = await TodoList.findAll({ where: { userId } });

    if (tasks.length === 0) {
        console.log('---------------');
        console.log('No tasks found.');
        console.log('---------------');
        return [];
    }
    console.log('-----------');
    console.log('Your Tasks:');
    console.log('-----------');
    tasks.forEach(task => {
        console.log(`\nID: ${task.id}`);
        console.log(`Title: ${task.title}`);
        console.log(`Description: ${task.description}`);
        console.log(`Due Date: ${task.dueDate.toISOString().split('T')[0]}`);
        console.log(`Priority: ${task.priority}`);
        console.log(`Status: ${task.status}`);
    });

    return tasks;
}

async function editTask(taskId, userId, updates) {
    const task = await TodoList.findOne({ where: { id: taskId, userId } });

    if (!task) {
        console.log('---------------');
        console.log('Task not found.');
        console.log('---------------');
        return null;
    }

    if (updates.priority) {
        const validPriorities = ['Low', 'Medium', 'High'];
        if (!validPriorities.includes(updates.priority)) {
            console.log('Invalid priority.');
            return null;
        }
    }

    if (updates.status) {
        const validStatuses = ['Pending', 'Completed'];
        if (!validStatuses.includes(updates.status)) {
            console.log('Status must be Pending or Completed');
            return null;
        }
    }

    await task.update(updates);
    console.log('Task updated successfully!');
    return task;
}


async function deleteTask(taskId, userId) {
    const task = await TodoList.findOne({ where: { id: taskId, userId } });

    if (!task) {
        console.log('---------------');
        console.log('Task not found.');
        console.log('---------------');
        return null;
    }

    await task.destroy();
    console.log('--------------------------');
    console.log('Task deleted successfully!');
    console.log('--------------------------');
    return true;
}

async function searchTasks(userId, keyword) {
    const tasks = await TodoList.findAll({
        where: {
            userId,
            [Op.or]: [
                { title: { [Op.like]: `%${keyword}%` } },
                { description: { [Op.like]: `%${keyword}%` } }
            ]
        }
    });

    if (tasks.length === 0) {
        console.log('------------------------');
        console.log('No matching tasks found.');
        console.log('------------------------');
        return [];
    }
    console.log('----------------');
    console.log(`\nSearch Result:`);
    console.log('----------------');
    tasks.forEach(task => {
        console.log(`\nID: ${task.id}`);
        console.log(`Title: ${task.title}`);
        console.log(`Description: ${task.description}`);
        console.log(`Due Date: ${task.dueDate.toISOString().split('T')[0]}`);
        console.log(`Priority: ${task.priority}`);
        console.log(`Status: ${task.status}`);
    });

    return tasks;
}

export { addTask, viewAllTasks, editTask, deleteTask, searchTasks };
