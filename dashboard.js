// User data and initialization
let user = {};
let tasks = [
    { 
        id: 1, 
        title: "Follow our Instagram", 
        description: "Follow our official page", 
        reward: 10, 
        link: "https://instagram.com", 
        completed: false 
    },
    { 
        id: 2, 
        title: "Join our Telegram", 
        description: "Join our community channel", 
        reward: 20, 
        link: "https://telegram.org", 
        completed: false 
    },
    { 
        id: 3, 
        title: "Sign up for Partner", 
        description: "Register with our partner site", 
        reward: 15, 
        link: "https://example.com/signup", 
        completed: false 
    },
    { 
        id: 4, 
        title: "Complete Survey", 
        description: "Quick 5-minute survey", 
        reward: 12, 
        link: "https://example.com/survey", 
        completed: false 
    },
    { 
        id: 5, 
        title: "Download App", 
        description: "Install our mobile application", 
        reward: 18, 
        link: "https://example.com/download", 
        completed: false 
    },
    { 
        id: 6, 
        title: "Tweet About Us", 
        description: "Share on your Twitter", 
        reward: 10, 
        link: "https://twitter.com", 
        completed: false 
    },
    { 
        id: 7, 
        title: "Write Review", 
        description: "Leave us a positive review", 
        reward: 15, 
        link: "https://trustpilot.com", 
        completed: false 
    },
    { 
        id: 8, 
        title: "Watch Tutorial", 
        description: "View our tutorial video", 
        reward: 8, 
        link: "https://youtube.com", 
        completed: false 
    },
    { 
        id: 9, 
        title: "Complete Profile", 
        description: "Fill your profile details", 
        reward: 10, 
        link: "#profile", 
        completed: false 
    },
    { 
        id: 10, 
        title: "Subscribe Newsletter", 
        description: "Join our email list", 
        reward: 10, 
        link: "#newsletter", 
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
    // Check if user is logged in
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    // Load user data
    user = JSON.parse(localStorage.getItem(currentUser)) || {};
    
    // Initialize user properties if they don't exist
    if (!user.earnings) user.earnings = 0;
    if (!user.tasksCompleted) user.tasksCompleted = 0;
    if (!user.completedTasks) user.completedTasks = [];
    if (!user.lastSpinDate) user.lastSpinDate = null;
    if (!user.lastTaskDate) user.lastTaskDate = null;
    
    // Update UI
    usernameDisplay.textContent = user.username || 'User';
    updateBalance();
    renderTasks();
    checkSpinEligibility();
    
    // Check if tasks were completed today
    checkDailyTasks();
}

// Update balance display
function updateBalance() {
    currentBalanceEl.textContent = `$${user.earnings.toFixed(2)}`;
}

// Render tasks
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
                <a href="${task.link}" target="_blank" class="task-link">Go to Task</a>
            </div>
            <div class="task-reward">$${task.reward}</div>
            <button class="task-action" data-id="${task.id}" ${isCompleted ? 'disabled' : ''}>
                ${isCompleted ? 'Completed' : 'Start Task'}
            </button>
        `;
        taskListEl.appendChild(taskEl);
    });
    
    // Add event listeners to task buttons
    document.querySelectorAll('.task-action').forEach(btn => {
        if (!btn.disabled) {
            btn.addEventListener('click', handleTaskClick);
        }
    });
}

// Handle task completion
function handleTaskClick(e) {
    const taskId = parseInt(e.target.getAttribute('data-id'));
    const task = tasks.find(t => t.id === taskId);
    
    if (!task) return;
    
    // Open task link in new tab
    window.open(task.link, '_blank');
    
    // Disable button during task
    e.target.disabled = true;
    e.target.textContent = 'Processing...';
    
    // Show timer for 30 seconds
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

// Complete task and update earnings
function completeTask(task) {
    // Mark task as completed
    if (!user.completedTasks) user.completedTasks = [];
    user.completedTasks.push(task.id);
    
    // Update earnings
    user.earnings += task.reward;
    user.tasksCompleted = (user.tasksCompleted || 0) + 1;
    user.lastTaskDate = new Date().toISOString();
    
    // Save user data
    localStorage.setItem(user.username, JSON.stringify(user));
    
    // Update UI
    updateBalance();
    renderTasks();
    checkSpinEligibility();
    
    // Show completion message with updated balance
    alert(`Task completed! You've earned $${task.reward}.\n\nCurrent Balance: $${user.earnings.toFixed(2)}`);
}

// Check if user can spin the wheel
function checkSpinEligibility() {
    const now = new Date();
    const lastSpinDate = user.lastSpinDate ? new Date(user.lastSpinDate) : null;
    
    // Check if user has completed at least one task
    const hasCompletedTask = user.completedTasks && user.completedTasks.length > 0;
    
    // Check if spin was done this week
    const canSpinThisWeek = !lastSpinDate || 
                         (now - lastSpinDate) > (7 * 24 * 60 * 60 * 1000);
    
    if (hasCompletedTask && canSpinThisWeek) {
        spinBtn.disabled = false;
        spinStatus.textContent = "Spin available!";
    } else if (!hasCompletedTask) {
        spinBtn.disabled = true;
        spinStatus.textContent = "Complete at least one task to spin";
    } else {
        spinBtn.disabled = true;
        const nextSpinDate = new Date(lastSpinDate);
        nextSpinDate.setDate(nextSpinDate.getDate() + 7);
        spinStatus.textContent = `Next spin available: ${nextSpinDate.toLocaleDateString()}`;
    }
}

// Handle spin wheel
spinBtn.addEventListener('click', function() {
    spinBtn.disabled = true;
    
    // Determine the spin result (always lands on ×6 for this implementation)
    const spinResult = "×6";
    const spinDegrees = 2160 + 180; // 6 full rotations + 180 degrees to land on ×6
    
    // Animate the wheel
    wheel.style.transform = `rotate(${spinDegrees}deg)`;
    
    // After animation completes
    setTimeout(() => {
        // Calculate earnings (6x current balance)
        const bonus = user.earnings * 6;
        user.earnings += bonus;
        user.lastSpinDate = new Date().toISOString();
        
        // Save user data
        localStorage.setItem(user.username, JSON.stringify(user));
        
        // Update UI
        updateBalance();
        checkSpinEligibility();
        
        // Show result
        spinResultText.textContent = `Congratulations! You won ${spinResult} bonus: $${bonus.toFixed(2)} has been added to your account.`;
        spinResultModal.style.display = 'block';
        
        // Reset wheel position after showing result
        setTimeout(() => {
            wheel.style.transition = 'none';
            wheel.style.transform = 'rotate(0deg)';
            setTimeout(() => {
                wheel.style.transition = 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
            }, 10);
        }, 500);
    }, 4000);
});

// Check if tasks were completed today
function checkDailyTasks() {
    const today = new Date().toDateString();
    const lastTaskDate = user.lastTaskDate ? new Date(user.lastTaskDate).toDateString() : null;
    
    if (lastTaskDate === today) {
        // Disable all tasks if already completed today
        tasks.forEach(task => {
            if (user.completedTasks.includes(task.id)) {
                task.completed = true;
            }
        });
        renderTasks();
    } else {
        // Reset completed tasks for new day
        user.completedTasks = [];
        localStorage.setItem(user.username, JSON.stringify(user));
        renderTasks();
    }
}

// Withdrawal functionality
withdrawBtn.addEventListener('click', function() {
    if (user.earnings < 500) {
        alert(`To withdraw, your account balance must be above $500. Current balance: $${user.earnings.toFixed(2)}`);
        return;
    }
    
    withdrawalModal.style.display = 'block';
    withdrawAmountInput.value = Math.max(500, Math.min(user.earnings, 500));
    withdrawAmountInput.min = 500;
    withdrawAmountInput.max = user.earnings;
});

// Generate passcode link
generatePasscodeLink.addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('withdrawalForm').style.display = 'none';
    noPasscodeMessage.style.display = 'block';
});

// Back to dashboard button
backToDashboardBtn.addEventListener('click', function() {
    withdrawalModal.style.display = 'none';
    document.getElementById('withdrawalForm').style.display = 'block';
    noPasscodeMessage.style.display = 'none';
});

// Confirm withdrawal
confirmWithdrawBtn.addEventListener('click', function() {
    const amount = parseFloat(withdrawAmountInput.value);
    const passcode = passcodeInput.value;
    
    if (isNaN(amount)) {
        alert('Please enter a valid amount');
        return;
    }
    
    if (amount < 500) {
        alert('Minimum withdrawal amount is $500');
        return;
    }
    
    if (amount > user.earnings) {
        alert('You cannot withdraw more than your current balance');
        return;
    }
    
    if (!passcode) {
        alert('Please enter your passcode');
        return;
    }
    
    // Process withdrawal (simulated)
    user.earnings -= amount;
    localStorage.setItem(user.username, JSON.stringify(user));
    
    alert(`Withdrawal request for $${amount.toFixed(2)} has been submitted. Funds will be processed within 3-5 business days.`);
    withdrawalModal.style.display = 'none';
    updateBalance();
    
    // Reset form
    withdrawAmountInput.value = '';
    passcodeInput.value = '';
});

// Close modals
document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', function() {
        withdrawalModal.style.display = 'none';
        spinResultModal.style.display = 'none';
    });
});

closeSpinResultBtn.addEventListener('click', function() {
    spinResultModal.style.display = 'none';
});

// Creators Insight link
creatorsLink.addEventListener('click', function(e) {
    e.preventDefault();
    alert('Creators Insight registration will be available soon. Please check back later.');
});

// Logout
logoutBtn.addEventListener('click', function() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
});

// Close modals when clicking outside
window.addEventListener('click', function(event) {
    if (event.target === withdrawalModal) {
        withdrawalModal.style.display = 'none';
    }
    if (event.target === spinResultModal) {
        spinResultModal.style.display = 'none';
    }
});

// Initialize the app
init();
