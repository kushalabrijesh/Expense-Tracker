// Expense Tracker JavaScript
class ExpenseTracker {
    constructor() {
        this.transactions = this.loadTransactions();
        this.editingId = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateDisplay();
        this.setDefaultDate();
    }

    bindEvents() {
        // Form submission
        document.getElementById('expense-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });

        // Search and filter
        document.getElementById('search').addEventListener('input', () => this.filterTransactions());
        document.getElementById('filter-category').addEventListener('change', () => this.filterTransactions());
        document.getElementById('filter-type').addEventListener('change', () => this.filterTransactions());
        document.getElementById('filter-month').addEventListener('change', () => this.filterTransactions());

        // Clear filters
        document.getElementById('clear-filters').addEventListener('click', () => this.clearFilters());

        // Export and clear all
        document.getElementById('export-data').addEventListener('click', () => this.exportToCSV());
        document.getElementById('clear-all').addEventListener('click', () => this.clearAllTransactions());

        // Cancel edit
        document.getElementById('cancel-edit').addEventListener('click', () => this.cancelEdit());

        // Modal close
        document.getElementById('close-modal').addEventListener('click', () => this.closeModal());
    }

    setDefaultDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('date').value = today;
    }

    handleFormSubmit() {
        const formData = new FormData(document.getElementById('expense-form'));
        const transaction = {
            id: this.editingId || Date.now().toString(),
            description: formData.get('description'),
            amount: parseFloat(formData.get('amount')),
            type: formData.get('type'),
            category: formData.get('category'),
            date: formData.get('date'),
            timestamp: new Date().toISOString()
        };

        if (this.editingId) {
            this.updateTransaction(transaction);
        } else {
            this.addTransaction(transaction);
        }
    }

    addTransaction(transaction) {
        this.transactions.push(transaction);
        this.saveTransactions();
        this.updateDisplay();
        this.resetForm();
        this.showNotification('Transaction added successfully!', 'success');
    }

    updateTransaction(transaction) {
        const index = this.transactions.findIndex(t => t.id === this.editingId);
        if (index !== -1) {
            this.transactions[index] = transaction;
            this.saveTransactions();
            this.updateDisplay();
            this.resetForm();
            this.cancelEdit();
            this.showNotification('Transaction updated successfully!', 'success');
        }
    }

    deleteTransaction(id) {
        if (confirm('Are you sure you want to delete this transaction?')) {
            this.transactions = this.transactions.filter(t => t.id !== id);
            this.saveTransactions();
            this.updateDisplay();
            this.showNotification('Transaction deleted successfully!', 'success');
        }
    }

    editTransaction(id) {
        const transaction = this.transactions.find(t => t.id === id);
        if (transaction) {
            this.editingId = id;
            this.populateForm(transaction);
            document.getElementById('cancel-edit').style.display = 'inline-flex';
            document.querySelector('#expense-form button[type="submit"]').innerHTML = '<i class="fas fa-save"></i> Update Transaction';
        }
    }

    populateForm(transaction) {
        document.getElementById('description').value = transaction.description;
        document.getElementById('amount').value = transaction.amount;
        document.getElementById('type').value = transaction.type;
        document.getElementById('category').value = transaction.category;
        document.getElementById('date').value = transaction.date;
    }

    cancelEdit() {
        this.editingId = null;
        this.resetForm();
        document.getElementById('cancel-edit').style.display = 'none';
        document.querySelector('#expense-form button[type="submit"]').innerHTML = '<i class="fas fa-plus"></i> Add Transaction';
    }

    resetForm() {
        document.getElementById('expense-form').reset();
        this.setDefaultDate();
    }

    updateDisplay() {
        this.updateSummary();
        this.displayTransactions();
        this.updateCategoryBreakdown();
    }

    updateSummary() {
        const income = this.transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const expenses = this.transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const balance = income - expenses;

        document.getElementById('total-income').textContent = this.formatCurrency(income);
        document.getElementById('total-expenses').textContent = this.formatCurrency(expenses);
        document.getElementById('total-balance').textContent = this.formatCurrency(balance);
    }

    displayTransactions(transactionsToShow = null) {
        const transactions = transactionsToShow || this.transactions;
        const transactionList = document.getElementById('transaction-list');

        if (transactions.length === 0) {
            transactionList.innerHTML = `
                <div class="no-transactions">
                    <i class="fas fa-receipt"></i>
                    <p>No transactions found.</p>
                </div>
            `;
            return;
        }

        // Sort transactions by date (newest first)
        const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

        transactionList.innerHTML = sortedTransactions.map(transaction => {
            const categoryEmoji = this.getCategoryEmoji(transaction.category);
            const formattedDate = new Date(transaction.date).toLocaleDateString();
            
            return `
                <div class="transaction-item">
                    <div class="transaction-info">
                        <div class="transaction-description">${transaction.description}</div>
                        <div class="transaction-details">
                            <span><i class="fas fa-tag"></i> ${categoryEmoji} ${this.formatCategory(transaction.category)}</span>
                            <span><i class="fas fa-calendar"></i> ${formattedDate}</span>
                            <span class="transaction-type ${transaction.type}">
                                <i class="fas fa-${transaction.type === 'income' ? 'arrow-up' : 'arrow-down'}"></i>
                                ${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                            </span>
                        </div>
                    </div>
                    <div class="transaction-amount ${transaction.type}">
                        ${transaction.type === 'income' ? '+' : '-'}${this.formatCurrency(transaction.amount)}
                    </div>
                    <div class="transaction-actions">
                        <button class="action-btn edit-btn" onclick="expenseTracker.editTransaction('${transaction.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete-btn" onclick="expenseTracker.deleteTransaction('${transaction.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    filterTransactions() {
        const search = document.getElementById('search').value.toLowerCase();
        const categoryFilter = document.getElementById('filter-category').value;
        const typeFilter = document.getElementById('filter-type').value;
        const monthFilter = document.getElementById('filter-month').value;

        let filtered = this.transactions.filter(transaction => {
            const matchesSearch = transaction.description.toLowerCase().includes(search) ||
                                transaction.category.toLowerCase().includes(search);
            
            const matchesCategory = !categoryFilter || transaction.category === categoryFilter;
            const matchesType = !typeFilter || transaction.type === typeFilter;
            
            let matchesMonth = true;
            if (monthFilter) {
                const transactionMonth = transaction.date.substring(0, 7); // YYYY-MM format
                matchesMonth = transactionMonth === monthFilter;
            }

            return matchesSearch && matchesCategory && matchesType && matchesMonth;
        });

        this.displayTransactions(filtered);
    }

    clearFilters() {
        document.getElementById('search').value = '';
        document.getElementById('filter-category').value = '';
        document.getElementById('filter-type').value = '';
        document.getElementById('filter-month').value = '';
        this.displayTransactions();
    }

    updateCategoryBreakdown() {
        const categoryBreakdown = document.getElementById('category-breakdown');
        
        // Calculate expense totals by category
        const categoryTotals = {};
        this.transactions
            .filter(t => t.type === 'expense')
            .forEach(t => {
                if (!categoryTotals[t.category]) {
                    categoryTotals[t.category] = 0;
                }
                categoryTotals[t.category] += t.amount;
            });

        // Sort categories by amount (highest first)
        const sortedCategories = Object.entries(categoryTotals)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 8); // Show top 8 categories

        if (sortedCategories.length === 0) {
            categoryBreakdown.innerHTML = '<p style="text-align: center; color: var(--secondary-color);">No expense data to display</p>';
            return;
        }

        categoryBreakdown.innerHTML = sortedCategories.map(([category, amount]) => {
            const emoji = this.getCategoryEmoji(category);
            return `
                <div class="category-item">
                    <div class="category-name">${emoji} ${this.formatCategory(category)}</div>
                    <div class="category-amount">${this.formatCurrency(amount)}</div>
                </div>
            `;
        }).join('');
    }

    getCategoryEmoji(category) {
        const emojis = {
            'food': '🍔',
            'transportation': '🚗',
            'entertainment': '🎬',
            'utilities': '💡',
            'healthcare': '🏥',
            'shopping': '🛍️',
            'education': '📚',
            'travel': '✈️',
            'salary': '💼',
            'freelance': '💻',
            'investment': '📈',
            'other': '📋'
        };
        return emojis[category] || '📋';
    }

    formatCategory(category) {
        return category.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    }

    exportToCSV() {
        if (this.transactions.length === 0) {
            this.showNotification('No transactions to export!', 'warning');
            return;
        }

        const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
        const csvContent = [
            headers.join(','),
            ...this.transactions.map(t => [
                t.date,
                `"${t.description}"`,
                t.category,
                t.type,
                t.amount
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `expense-tracker-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);

        this.showNotification('Data exported successfully!', 'success');
    }

    clearAllTransactions() {
        if (this.transactions.length === 0) {
            this.showNotification('No transactions to clear!', 'warning');
            return;
        }

        if (confirm('Are you sure you want to delete ALL transactions? This action cannot be undone!')) {
            this.transactions = [];
            this.saveTransactions();
            this.updateDisplay();
            this.showNotification('All transactions cleared!', 'success');
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            ${message}
        `;

        // Add notification styles if not already present
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 15px 20px;
                    border-radius: 8px;
                    color: white;
                    font-weight: 600;
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    animation: slideInRight 0.3s ease;
                }
                .notification-success { background: #10b981; }
                .notification-warning { background: #f59e0b; }
                .notification-error { background: #ef4444; }
                .notification-info { background: #3b82f6; }
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    closeModal() {
        document.getElementById('edit-modal').style.display = 'none';
    }

    saveTransactions() {
        localStorage.setItem('expense-tracker-transactions', JSON.stringify(this.transactions));
    }

    loadTransactions() {
        const saved = localStorage.getItem('expense-tracker-transactions');
        return saved ? JSON.parse(saved) : [];
    }

    // Statistics methods
    getMonthlyStats() {
        const currentMonth = new Date().toISOString().substring(0, 7);
        const monthlyTransactions = this.transactions.filter(t => 
            t.date.substring(0, 7) === currentMonth
        );

        return {
            income: monthlyTransactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0),
            expenses: monthlyTransactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0),
            count: monthlyTransactions.length
        };
    }

    getCategoryStats() {
        const categoryStats = {};
        this.transactions
            .filter(t => t.type === 'expense')
            .forEach(t => {
                if (!categoryStats[t.category]) {
                    categoryStats[t.category] = { amount: 0, count: 0 };
                }
                categoryStats[t.category].amount += t.amount;
                categoryStats[t.category].count += 1;
            });

        return categoryStats;
    }

    getRecentTransactions(limit = 5) {
        return [...this.transactions]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, limit);
    }

    // Import functionality
    importFromCSV(csvText) {
        try {
            const lines = csvText.split('\n');
            const headers = lines[0].split(',');
            
            if (!headers.includes('Date') || !headers.includes('Amount') || !headers.includes('Description')) {
                throw new Error('Invalid CSV format. Required columns: Date, Description, Amount');
            }

            const newTransactions = [];
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;

                const values = line.split(',');
                if (values.length >= 3) {
                    const transaction = {
                        id: Date.now().toString() + i,
                        description: values[1].replace(/"/g, '') || 'Imported transaction',
                        amount: parseFloat(values[3]) || 0,
                        type: values[4] || (parseFloat(values[3]) > 0 ? 'income' : 'expense'),
                        category: values[2] || 'other',
                        date: values[0] || new Date().toISOString().split('T')[0],
                        timestamp: new Date().toISOString()
                    };
                    newTransactions.push(transaction);
                }
            }

            this.transactions = [...this.transactions, ...newTransactions];
            this.saveTransactions();
            this.updateDisplay();
            this.showNotification(`Imported ${newTransactions.length} transactions!`, 'success');

        } catch (error) {
            this.showNotification(`Import failed: ${error.message}`, 'error');
        }
    }
}

// Initialize the app
const expenseTracker = new ExpenseTracker();

// Add file import functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add import button to the history header
    const historyActions = document.querySelector('.history-actions');
    if (historyActions) {
        const importButton = document.createElement('button');
        importButton.className = 'btn btn-outline';
        importButton.innerHTML = '<i class="fas fa-upload"></i> Import CSV';
        importButton.onclick = () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.csv';
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        expenseTracker.importFromCSV(e.target.result);
                    };
                    reader.readAsText(file);
                }
            };
            input.click();
        };
        historyActions.insertBefore(importButton, historyActions.firstChild);
    }

    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'n':
                    e.preventDefault();
                    document.getElementById('description').focus();
                    break;
                case 'f':
                    e.preventDefault();
                    document.getElementById('search').focus();
                    break;
                case 'e':
                    e.preventDefault();
                    expenseTracker.exportToCSV();
                    break;
            }
        }
        
        if (e.key === 'Escape') {
            if (expenseTracker.editingId) {
                expenseTracker.cancelEdit();
            }
            expenseTracker.closeModal();
        }
    });
});

// Add drag and drop functionality for CSV import
document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.container');
    
    container.addEventListener('dragover', (e) => {
        e.preventDefault();
        container.style.background = 'rgba(37, 99, 235, 0.1)';
    });
    
    container.addEventListener('dragleave', (e) => {
        e.preventDefault();
        container.style.background = '';
    });
    
    container.addEventListener('drop', (e) => {
        e.preventDefault();
        container.style.background = '';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    expenseTracker.importFromCSV(e.target.result);
                };
                reader.readAsText(file);
            } else {
                expenseTracker.showNotification('Please drop a CSV file', 'warning');
            }
        }
    });
});