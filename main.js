import { initDB, closeDB } from './db.js';
import { registerUser, loginUser } from './userFunctions.js';
import { addTask, viewAllTasks, editTask, deleteTask, searchTasks } from './taskFunctions.js';
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askQuestion(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
}


let currentUser = null;

async function showMainMenu() {
    console.log('\nWelcome to Todo App\n');
    console.log('1. Register');
    console.log('2. Login');
    console.log('3. Exit\n');

    const choice = await askQuestion('Enter your choice: ');

    switch (choice) {
        case '1':
            await handleRegister();
            break;
        case '2':
            await handleLogin();
            break;
        case '3':
            console.log('Goodbye!');
            rl.close();
            await closeDB();
            process.exit(0);
        default:
            console.log('Invalid choice. Please try again.');
            await showMainMenu();
    }
}

async function handleRegister() {
    console.log('\n--- Register ---');
    const name = await askQuestion('Enter your name: ');
    const email = await askQuestion('Enter your email: ');
    const password = await askQuestion('Enter your password: ');

    const user = await registerUser(name, email, password);

    if (user) {
        await showMainMenu();
    } else {
        await showMainMenu();
    }
}

async function handleLogin() {
    console.log('\n--- Login ---');
    const email = await askQuestion('Enter your email: ');
    const password = await askQuestion('Enter your password: ');

    const user = await loginUser(email, password);

    if (user) {
        currentUser = user;
        await showTodoMenu();
    } else {
        await showMainMenu();
    }
}

async function showTodoMenu() {
    console.log('\nTodo Menu\n');
    console.log('1. Add Task');
    console.log('2. View All Tasks');
    console.log('3. Edit Task');
    console.log('4. Delete Task');
    console.log('5. Search Tasks');
    console.log('6. Logout\n');

    const choice = await askQuestion('Enter your choice: ');

    switch (choice) {
        case '1':
            await handleAddTask();
            break;
        case '2':
            await handleViewAllTasks();
            break;
        case '3':
            await handleEditTask();
            break;
        case '4':
            await handleDeleteTask();
            break;
        case '5':
            await handleSearchTasks();
            break;
        case '6':
            console.log('Logged out successfully!');
            currentUser = null;
            await showMainMenu();
            return;
        default:
            console.log('Invalid choice. Please try again.');
            await showTodoMenu();
    }
}

async function handleAddTask() {
    console.log('\n--- Add Task ---');
    const title = await askQuestion('Enter task title: ');
    const description = await askQuestion('Enter task description: ');
    const dueDate = await askQuestion('Enter due date (YYYY-MM-DD): ');
    const priority = await askQuestion('Enter priority (Low/Medium/High): ');

    const task = await addTask(currentUser.id, title, description, dueDate, priority);

    if (task) {
        console.log('\nTask Data:');
        console.log(`Task ID: ${task.id}`);
        console.log(`Title: ${task.title}`);
        console.log(`Description: ${task.description}`);
        console.log(`Due Date: ${task.dueDate.toISOString().split('T')[0]}`);
        console.log(`Priority: ${task.priority}`);
        console.log(`Status: ${task.status}`);
    }

    await showTodoMenu();
}


async function handleViewAllTasks() {
    console.log('\n--- View All Tasks ---');
    await viewAllTasks(currentUser.id);
    await showTodoMenu();
}


async function handleEditTask() {
    console.log('\n--- Edit Task ---');
    const taskId = await askQuestion('Enter task ID to edit: ');

    const { TodoList } = await import('./db.js');
    const task = await TodoList.findOne({ where: { id: taskId, userId: currentUser.id } });

    if (!task) {
        console.log('Task not found.');
        await showTodoMenu();
        return;
    }

    console.log(`\nCurrent Title: ${task.title}`);
    const newTitle = await askQuestion('Enter new title (press Enter to skip): ');

    console.log(`Current Description: ${task.description}`);
    const newDescription = await askQuestion('Enter new description (press Enter to skip): ');

    console.log(`Current Due Date: ${task.dueDate.toISOString().split('T')[0]}`);
    const newDueDate = await askQuestion('Enter new due date (press Enter to skip): ');

    console.log(`Current Priority: ${task.priority}`);
    const newPriority = await askQuestion('Enter new priority (press Enter to skip): ');

    console.log(`Current Status: ${task.status}`);
    const newStatus = await askQuestion('Enter new status (Pending/Completed) (press Enter to skip): ');

 
    const updates = {};
    if (newTitle && newTitle.trim() !== '') updates.title = newTitle;
    if (newDescription && newDescription.trim() !== '') updates.description = newDescription;
    if (newDueDate && newDueDate.trim() !== '') updates.dueDate = newDueDate;
    if (newPriority && newPriority.trim() !== '') updates.priority = newPriority;
    if (newStatus && newStatus.trim() !== '') updates.status = newStatus;

    await editTask(taskId, currentUser.id, updates);
    await showTodoMenu();
}


async function handleDeleteTask() {
    
    console.log('\n--- Delete Task ---');
    const taskId = await askQuestion('Enter task ID to delete: ');

    const confirm = await askQuestion('Are you sure you want to delete this task? (yes/no): ');

    if (confirm.toLowerCase() === 'yes') {
        await deleteTask(taskId, currentUser.id);
    } else {
        console.log('Delete cancelled.');
    }

    await showTodoMenu();
}


async function handleSearchTasks() {
    
    console.log('\n--- Search Tasks ---');
    const keyword = await askQuestion('Enter search keyword: ');
    await searchTasks(currentUser.id, keyword);
    await showTodoMenu();
}

async function startApp() {
    await initDB();
    await showMainMenu();
}

startApp();
