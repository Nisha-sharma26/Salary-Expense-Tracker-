const form = document.getElementById("expenseForm");
const salaryInput = document.getElementById("salaryInput");
const expenseName = document.getElementById("expenseName");
const expenseAmount = document.getElementById("expenseAmount");

const salaryDisplay = document.getElementById("salaryDisplay");
const expenseDisplay = document.getElementById("expenseDisplay");
const balanceDisplay = document.getElementById("balanceDisplay");
const warningMessage = document.getElementById("warningMessage");

const expenseContainer = document.getElementById("expenseContainer");
const currency = document.getElementById("currency");
const error = document.getElementById("error");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let salary = Number(localStorage.getItem("salary")) || 0;

let chart;

render();

/* ================= FORM ================= */

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const s = Number(salaryInput.value);
  const name = expenseName.value.trim();
  const amt = Number(expenseAmount.value);

  if (name === "" || amt < 0 || s < 0) {
    error.textContent = "Invalid Input";
    return;
  }

  error.textContent = "";

  if (s > 0) salary = s;

  expenses.push({ name, amount: amt });

  save();
  render();
  form.reset();
});

/* ================= RENDER ================= */

function render() {

  expenseContainer.innerHTML = "";

  let total = 0;

  expenses.forEach((e, i) => {
    total += e.amount;

    const div = document.createElement("div");
    div.classList.add("expense-item");

    div.innerHTML = `
      <span>${e.name}</span>
      <span>${symbol()}${e.amount}</span>
      <button class="delete-btn" onclick="del(${i})">X</button>
    `;

    expenseContainer.appendChild(div);
  });

  const balance = salary - total;

  salaryDisplay.textContent = symbol() + salary;
  expenseDisplay.textContent = symbol() + total;
  balanceDisplay.textContent = symbol() + balance;

  warningMessage.textContent =
    balance < salary * 0.1 ? "⚠ Low Balance Warning" : "";

  updateChart(balance, total);
}

/* ================= DELETE ================= */

function del(i) {
  expenses.splice(i, 1);
  save();
  render();
}

/* ================= SAVE ================= */

function save() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
  localStorage.setItem("salary", salary);
}

/* ================= CURRENCY ================= */

function symbol() {
  return currency.value === "USD" ? "$" : "₹";
}

currency.addEventListener("change", render);

/* ================= CHART ================= */

function updateChart(b, t) {
  const ctx = document.getElementById("expenseChart");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Balance", "Expenses"],
      datasets: [{ data: [b, t] }]
    }
  });
}

/* ================= RESET BUTTONS ================= */

document.getElementById("resetSalary")
.addEventListener("click", () => {
  salary = 0;
  localStorage.removeItem("salary");
  render();
});

document.getElementById("resetAll")
.addEventListener("click", () => {
  salary = 0;
  expenses = [];
  localStorage.clear();
  render();
});

/* ================= FINTECH PDF EXPORT ================= */

document.getElementById("downloadPDF")
.addEventListener("click", () => {

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const totalExpense = expenses.reduce((s, e) => s + e.amount, 0);
  const balance = salary - totalExpense;
  const date = new Date().toLocaleString();

  /* ---------- HEADER ---------- */

  doc.setFillColor(17, 24, 39);
  doc.rect(0, 0, 220, 42, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("FINANCIAL STATEMENT", 45, 22);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated: ${date}`, 140, 30);

  /* ---------- BALANCE CARD ---------- */

  doc.setFillColor(240, 245, 255);
  doc.roundedRect(15, 55, 180, 35, 6, 6, "F");

  doc.setTextColor(37, 99, 235);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("CURRENT BALANCE", 20, 68);

  doc.setFontSize(24);
  doc.text(`₹ ${balance}`, 20, 88);

  /* ---------- SUMMARY ---------- */

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);

  doc.text(`Total Salary: ₹${salary}`, 20, 105);
  doc.text(`Total Expenses: ₹${totalExpense}`, 20, 115);

  /* ---------- TABLE HEADER ---------- */

  let y = 135;

  doc.setFillColor(37, 99, 235);
  doc.rect(15, y, 180, 12, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);

  doc.text("#", 22, y + 8);
  doc.text("DESCRIPTION", 45, y + 8);
  doc.text("AMOUNT", 150, y + 8);

  y += 18;

  /* ---------- TABLE ROWS ---------- */

  expenses.forEach((exp, i) => {

    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    doc.setFillColor(i % 2 === 0 ? 245 : 235);
    doc.rect(15, y - 6, 180, 10, "F");

    doc.setTextColor(0, 0, 0);
    doc.text(`${i + 1}`, 22, y);
    doc.text(exp.name, 45, y);

    doc.setTextColor(239, 68, 68);
    doc.text(`₹ ${exp.amount}`, 150, y);

    y += 12;
  });

  /* ---------- TOTAL BOX ---------- */

  y += 10;

  doc.setFillColor(16, 185, 129);
  doc.roundedRect(15, y, 180, 25, 5, 5, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);

  doc.text("NET SUMMARY", 20, y + 10);

  doc.setFontSize(11);
  doc.text(`Remaining Balance: ₹ ${balance}`, 20, y + 20);

  /* ---------- FOOTER ---------- */

  doc.setDrawColor(200);
  doc.line(15, 285, 195, 285);

  doc.setFontSize(9);
  doc.setTextColor(120);

  doc.text("Fintech Statement | Cash Flow Tracker", 15, 292);
  doc.text(date, 140, 292);

  doc.save("Financial_Statement.pdf");
});