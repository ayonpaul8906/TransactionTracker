document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("transactionForm");
    const balanceTable = document.getElementById("balanceTable");
    const totalBalanceElement = document.getElementById("totalBalance");

    // Load transactions from Local Storage or initialize an empty array if none exist
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    // Function to update total balance
    function updateBalance() {
        let balance = 0;
        transactions.forEach(transaction => {
            balance += transaction.type === "credit" ? transaction.amount : -transaction.amount;
        });
        totalBalanceElement.textContent = `Total Balance: Rs${balance.toFixed(2)}`;
    }

    // Function to render transactions in the table
    function renderTransactions() {
        // Clear table rows, keeping header
        balanceTable.innerHTML = `
            <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Action</th>
            </tr>
        `;
        
        transactions.forEach((transaction, index) => {
            const row = balanceTable.insertRow(-1);
            row.innerHTML = `
                <td>${transaction.date}</td>
                <td>Rs${transaction.amount.toFixed(2)}</td>
                <td class="${transaction.type}">${transaction.type === "credit" ? "Credit" : "Debit"}</td>
                <td><button class="remove-btn" onclick="removeTransaction(${index})">Remove</button></td>
            `;
        });

        updateBalance();
    }

    // Function to add a transaction
    function addTransaction(event) {
        event.preventDefault();

        const date = form.date.value;
        const amount = parseFloat(form.amount.value);
        const type = form.transactionType.value;

        // Validate amount
        if (isNaN(amount) || amount <= 0) {
            alert("Please enter a valid amount.");
            return;
        }

        // Create transaction object and add it to the transactions array
        const transaction = { date, amount, type };
        transactions.push(transaction);
        localStorage.setItem("transactions", JSON.stringify(transactions));

        form.reset();
        renderTransactions();
    }

    // Function to remove a transaction by index
    window.removeTransaction = function(index) {
        transactions.splice(index, 1);
        localStorage.setItem("transactions", JSON.stringify(transactions));
        renderTransactions();
    };

    form.addEventListener("submit", addTransaction);

    // Initial render of stored transactions on page load
    renderTransactions();
});
