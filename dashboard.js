// User data and initialization
let user = {};
let tasks = [
    { 
        id: 1, 
        title: "Watch Video 1 on YouTube", 
        description: "Watch our first tutorial video", 
        reward: 20, 
        link: "https://youtube.com", 
        completed: false 
    },
    { 
        id: 2, 
        title: "Watch Video 2 on YouTube", 
        description: "Watch our second tutorial video", 
        reward: 20, 
        link: "https://youtube.com", 
        completed: false 
    },
    { 
        id: 3, 
        title: "Watch Video 3 on YouTube", 
        description: "Watch our third tutorial video", 
        reward: 20, 
        link: "https://youtube.com", 
        completed: false 
    },
    { 
        id: 4, 
        title: "Watch Video 4 on YouTube", 
        description: "Watch our fourth tutorial video", 
        reward: 20, 
        link: "https://youtube.com", 
        completed: false 
    },
    { 
        id: 5, 
        title: "Watch Video 5 on YouTube", 
        description: "Watch our fifth tutorial video", 
        reward: 20, 
        link: "https://youtube.com", 
        completed: false 
    },
    { 
        id: 6, 
        title: "Watch Video 6 on YouTube", 
        description: "Watch our sixth tutorial video", 
        reward: 20, 
        link: "https://youtube.com", 
        completed: false 
    },
    { 
        id: 7, 
        title: "Watch Video 7 on YouTube", 
        description: "Watch our seventh tutorial video", 
        reward: 10, 
        link: "https://youtube.com", 
        completed: false 
    },
    { 
        id: 8, 
        title: "Watch Video 8 on YouTube", 
        description: "Watch our eighth tutorial video", 
        reward: 10, 
        link: "https://youtube.com", 
        completed: false 
    }
];

// DOM Elements
const usernameDisplay = document.getElementById('usernameDisplay');
const currentBalanceEl = document.getElementById('currentBalance');
const taskListEl = document.getElementById('taskList');
const taskTimerEl = document.getElementById('taskTimer');
const spinBtn = document.getElementById('spinBtn');
const spinStatus = document.getElementById('spinStatus');
const wheel = document.getElementById('wheel');
const logoutBtn = document.getElementById('logoutBtn');
const withdrawBtn = document.getElementById('withdrawBtn');
const withdrawalModal = document.getElementById('withdrawalModal');
const generatePasscodeLink = document.getElementById('generatePasscodeLink');
const noPasscodeMessage = document.getElementById('noPasscodeMessage');
const backToDashboardBtn = document.getElementById('backToDashboard');
const confirmWithdrawBtn = document.getElementById('confirmWithdraw');
const withdrawAmountInput = document.getElementById('withdrawAmount');
const passcodeInput = document.getElementById('passcode');
const spinResultModal = document.getElementById('spinResultModal');
const spinResultText = document.getElementById('spinResultText');
const closeSpinResultBtn = document.getElementById('closeSpinResult');
const creatorsLink = document.getElementById('creatorsLink');

// Initialize the application
function init() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    user = JSON.parse(localStorage.getItem(currentUser)) || {};
    
    if (!user.earnings) user.earnings = 0;
    if (!user.tasksCompleted) user.tasksCompleted = 0;
    if (!user.completedTasks) user.completedTasks = [];
    if (!user.lastSpinDate) user.lastSpinDate = null;
    if (!user.lastTaskDate) user.lastTaskDate = null;
    
    usernameDisplay.textContent = user.username || 'User';
    updateBalance();
    renderTasks();
    checkSpinEligibility();
    checkDailyTasks();
}

function updateBalance() {
    currentBalanceEl.textContent = `$${user.earnings.toFixed(2)}`;
}

function renderTasks() {
    taskListEl.innerHTML = '';
    
    tasks.forEach(task => {
        const isCompleted = user.completedTasks?.includes(task.id) || false;
        const taskEl = document.createElement('div');
        taskEl.className = `task-item ${isCompleted ? 'completed' : ''}`;
        taskEl.innerHTML = `
            <div class="task-info">
                <h4>${task.title}</h4>
                <p>${task.description}</p>
                <a href="${task.link}" target="_blank" class="task-link">Watch Now</a>
            </div>
            <div class="task-reward">$${task.reward}</div>
            <button class="task-action" data-id="${task.id}" ${isCompleted ? 'disabled' : ''}>
                ${isCompleted ? 'Completed' : 'Start Task'}
            </button>
        `;
        taskListEl.appendChild(taskEl);
    });
    
    document.querySelectorAll('.task-action').forEach(btn => {
        if (!btn.disabled) {
            btn.addEventListener('click', handleTaskClick);
        }
    });
}

function handleTaskClick(e) {
    const taskId = parseInt(e.target.getAttribute('data-id'));
    const task = tasks.find(t => t.id === taskId);
    
    if (!task) return;
    
    window.open(task.link, '_blank');
    
    e.target.disabled = true;
    e.target.textContent = 'Processing...';
    
    let seconds = 30;
    taskTimerEl.textContent = `(Task in progress: ${seconds}s)`;
    const timerInterval = setInterval(() => {
        seconds--;
        taskTimerEl.textContent = `(Task in progress: ${seconds}s)`;
        
        if (seconds <= 0) {
            clearInterval(timerInterval);
            taskTimerEl.textContent = '';
            completeTask(task);
        }
    }, 1000);
}

function completeTask(task) {
    if (!user.completedTasks) user.completedTasks = [];
    user.completedTasks.push(task.id);
    
    user.earnings += task.reward;
    user.tasksCompleted = (user.tasksCompleted || 0) + 1;
    user.lastTaskDate = new Date().toISOString();
    
    localStorage.setItem(user.username, JSON.stringify(user));
    
    updateBalance();
    renderTasks();
    checkSpinEligibility();
    
    alert(`Task completed! You've earned $${task.reward}.\n\nCurrent Balance: $${user.earnings.toFixed(2)}`);
}

function checkSpinEligibility() {
    const now = new Date();
    const lastSpinDate = user.lastSpinDate ? new Date(user.lastSpinDate) : null;
    
    // Changed to require ALL tasks completed
    const allTasksCompleted = user.completedTasks && user.completedTasks.length === tasks.length;
    
    const canSpinThisWeek = !lastSpinDate || 
                         (now - lastSpinDate) > (7 * 24 * 60 * 60 * 1000);
    
    if (allTasksCompleted && canSpinThisWeek) {
        spinBtn.disabled = false;
        spinStatus.textContent = "Spin available!";
    } else if (!allTasksCompleted) {
        spinBtn.disabled = true;
        const remaining = tasks.length - (user.completedTasks?.length || 0);
        spinStatus.textContent = `Complete ${remaining} more tasks to unlock spin`;
    } else {
        spinBtn.disabled = true;
        const nextSpinDate = new Date(lastSpinDate);
        nextSpinDate.setDate(nextSpinDate.getDate() + 7);
        spinStatus.textContent = `Next spin available: ${nextSpinDate.toLocaleDateString()}`;
    }
}

spinBtn.addEventListener('click', function() {
    spinBtn.disabled = true;
    
    // Determine random spin result (but ensure it lands on ×6)
    const spinDegrees = 2160 + (360 * 7) + 45; // 6 full rotations + 7 segments + 45deg to land on ×6
    
    wheel.style.transform = `rotate(${spinDegrees}deg)`;
    
    setTimeout(() => {
        const bonus = user.earnings * 6;
        user.earnings += bonus;
        user.lastSpinDate = new Date().toISOString();
        
        localStorage.setItem(user.username, JSON.stringify(user));
        
        updateBalance();
        checkSpinEligibility();
        
        spinResultText.textContent = `Congratulations! You won ×6 bonus: $${bonus.toFixed(2)} has been added to your account.`;
        spinResultModal.style.display = 'block';
        
        setTimeout(() => {
            wheel.style.transition = 'none';
            wheel.style.transform = 'rotate(0deg)';
            setTimeout(() => {
                wheel.style.transition = 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
            }, 10);
        }, 500);
    }, 4000);
});

// ... (rest of the existing functions remain the same) ...
