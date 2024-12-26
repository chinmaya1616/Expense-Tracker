const form = document.getElementById("expense-form");
const expenseList = document.getElementById("expense-list");
const totalElement = document.getElementById("total");
const ctx = document.getElementById("expense-chart").getContext("2d");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

function updateUI() {
    // Clear list
    expenseList.innerHTML = "";

    // Populate list
    expenses.forEach((expense, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            ${expense.description} - ₹${expense.amount} (${expense.category})
            <button onclick="deleteExpense(${index})">X</button>
        `;
        expenseList.appendChild(li);
    });

    // Update total
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    totalElement.textContent = `Total: ₹${total}`;

    // Update chart
    updateChart();
}

function updateChart() {
    const categories = ["Food", "Travel", "Shopping", "Other"];
    const data = categories.map((category) =>
        expenses
            .filter((expense) => expense.category === category)
            .reduce((sum, exp) => sum + exp.amount, 0)
    );

    new Chart(ctx, {
        type: "pie",
        data: {
            labels: categories,
            datasets: [
                {
                    data: data,
                    backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50"],
                },
            ],
        },
    });
}

function addExpense(event) {
    event.preventDefault();

    const description = document.getElementById("description").value.trim();
    const amount = parseFloat(document.getElementById("amount").value);
    const category = document.getElementById("category").value;

    if (!description || isNaN(amount) || !category) {
        alert("Please fill out all fields!");
        return;
    }

    expenses.push({ description, amount, category });
    localStorage.setItem("expenses", JSON.stringify(expenses));

    form.reset();
    updateUI();
}

function deleteExpense(index) {
    expenses.splice(index, 1);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    updateUI();
}

form.addEventListener("submit", addExpense);
updateUI();