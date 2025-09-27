# 💰 Kushala's Expense Tracker

A modern, feature-rich expense tracking web application built with HTML, CSS, and JavaScript. Track your income and expenses in Indian Rupees (₹), analyze spending patterns, and manage your budget effectively.

## 🌐 Live Demo
**[Try it live on GitHub Pages!](https://kushalabrijesh.github.io/Expense-Tracker)**

## ✨ Features

### Core Functionality
- ➕ **Add Transactions**: Record income and expenses with detailed information
- ✏️ **Edit/Delete**: Modify or remove existing transactions
- 💾 **Local Storage**: All data is saved locally in your browser
- 🔍 **Search & Filter**: Find transactions by description, category, type, or date
- 📊 **Dashboard**: Real-time summary of balance, income, and expenses

### Advanced Features
- 📁 **12 Categories**: Organized expense categories with emojis
- 📅 **Date Filtering**: Filter transactions by specific months
- 📈 **Analytics**: Visual breakdown of expenses by category
- 📤 **Export/Import**: CSV export and import functionality
- 🎨 **Responsive Design**: Works perfectly on all devices
- ⌨️ **Keyboard Shortcuts**: Quick navigation and actions
- 🖱️ **Drag & Drop**: Import CSV files by dragging them to the page

### Categories Supported
- 🍔 Food & Dining
- 🚗 Transportation  
- 🎬 Entertainment
- 💡 Utilities
- 🏥 Healthcare
- 🛍️ Shopping
- 📚 Education
- ✈️ Travel
- 💼 Salary
- 💻 Freelance
- 📈 Investment
- 📋 Other

## 🚀 Getting Started

### Option 1: Use Online (Recommended)
Visit the live version at: **[https://kushalabrijesh.github.io/Expense-Tracker](https://kushalabrijesh.github.io/Expense-Tracker)**

### Option 2: Direct Browser Access
1. Clone or download this repository
2. Open `index.html` in your web browser
3. Start tracking your expenses!

### Option 2: Local Server
1. Install Node.js on your computer
2. Open terminal in the project folder
3. Run one of these commands:
   ```bash
   # Using Python (if installed)
   python -m http.server 3000
   
   # Using Node.js http-server
   npm install -g http-server
   npx http-server -p 3000 -o
   ```
4. Open `http://localhost:3000` in your browser

## 📖 How to Use

### Adding Transactions
1. Fill in the transaction form at the top
2. Choose between "Income" or "Expense"
3. Select an appropriate category
4. Set the date (defaults to today)
5. Click "Add Transaction"

### Managing Transactions
- **Edit**: Click the yellow edit button on any transaction
- **Delete**: Click the red delete button to remove a transaction
- **Search**: Use the search box to find specific transactions
- **Filter**: Use dropdowns to filter by category, type, or month

### Exporting Data
- Click "Export CSV" to download your transaction history
- Data includes all transaction details in spreadsheet format
- Perfect for backup or analysis in Excel/Google Sheets

### Importing Data
- Click "Import CSV" and select a CSV file
- Or drag and drop a CSV file anywhere on the page
- CSV should have columns: Date, Description, Category, Type, Amount

### Keyboard Shortcuts
- `Ctrl/Cmd + N`: Focus on description field (new transaction)
- `Ctrl/Cmd + F`: Focus on search field
- `Ctrl/Cmd + E`: Export data to CSV
- `Escape`: Cancel edit mode or close modals

## 💾 Data Storage

All your transaction data is stored locally in your browser using localStorage. This means:
- ✅ **Privacy**: Your data never leaves your device
- ✅ **Fast**: Instant loading and saving
- ✅ **Offline**: Works without internet connection
- ⚠️ **Backup**: Export regularly as browser data can be cleared

## 🎨 Customization

### Colors
The app uses CSS custom properties for easy theming. Main colors are defined in `:root`:
- `--primary-color`: Main blue theme
- `--success-color`: Green for income/positive values
- `--danger-color`: Red for expenses/negative values
- `--secondary-color`: Gray for secondary text

### Categories
To add new categories, modify both:
1. HTML select options in `index.html`
2. Category emoji mapping in `js/app.js` (`getCategoryEmoji` method)

## 🌐 Browser Compatibility

This application works on all modern browsers:
- ✅ Chrome/Chromium (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## 📱 Mobile Support

The app is fully responsive and optimized for mobile devices:
- Touch-friendly interface
- Responsive grid layouts
- Mobile-optimized forms
- Swipe-friendly transaction list

## 🔧 Technical Details

### Technologies Used
- **HTML5**: Semantic markup and modern form elements
- **CSS3**: Flexbox, Grid, custom properties, animations
- **Vanilla JavaScript**: ES6+ features, classes, local storage
- **Font Awesome**: Icons for better UX

### File Structure
```
expense-tracker/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # All styling
├── js/
│   └── app.js          # Application logic
├── package.json        # Project metadata
└── README.md           # This file
```

## 🛠️ Development

### Local Development
1. Clone the repository
2. Make changes to HTML, CSS, or JavaScript files
3. Refresh browser to see changes
4. Use browser dev tools for debugging

### Contributing
Feel free to submit issues and enhancement requests!

## 📊 CSV Format

When importing/exporting, the CSV format is:
```csv
Date,Description,Category,Type,Amount
2023-12-01,"Grocery shopping",food,expense,45.67
2023-12-01,"Salary",salary,income,3000.00
```

## 🚨 Troubleshooting

### Data Not Saving
- Check if browser allows localStorage
- Try clearing browser cache and reload
- Ensure you're not in incognito/private mode

### Import Issues
- Verify CSV format matches expected structure
- Check for proper encoding (UTF-8 recommended)
- Ensure amount values are numbers

### Display Issues
- Try refreshing the page
- Check browser console for errors
- Ensure JavaScript is enabled

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Look for browser console errors
3. Try in a different browser
4. Clear browser data and try again

## 📄 License

This project is open source and available under the MIT License.

## 🎯 Future Enhancements

Potential features for future versions:
- 📊 Interactive charts and graphs
- 🔄 Data synchronization across devices
- 📱 Progressive Web App (PWA) support
- 🎨 Multiple themes/dark mode
- 📅 Budget planning and goals
- 🔔 Spending notifications
- 💳 Bank account integration

---

**Happy budgeting! 💰✨**