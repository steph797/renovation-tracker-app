// version 4
// =========================
// CONFIG
// =========================

const API_KEY = "AIzaSyC1GoZ0IqBvy3Qe2A-Pg5Ysa0sbI7QqqIQ";
const SHEET_ID = "1dJp6DuZTGrQ0TUPv81JjB3m9FYbBXdHhWKATSKnvGBE";
const SHEET_NAME = "Sheet1";

// =========================
// LOAD DATA
// =========================

async function loadData() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();

    if (!data.values) {
        alert("No data found.");
        return;
    }

    renderTable(data.values.slice(1));
}

// =========================
// SAVE DATA
// =========================

async function saveData() {
    const rows = getTableData();

    const response = await fetch("https://script.google.com/macros/s/AKfycbzvHQ-KB0Ej6gTcKS1Lezj7EaSSZ_DGeRWLT8ItW2uU_aBhLw001CTT9uToMmv33KK2/exec", {
        method: "POST",
        body: JSON.stringify(rows),
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (response.ok) {
        alert("Saved!");
    } else {
        alert("Save failed.");
    }
}


// =========================
// RENDER TABLE
// =========================

function renderTable(rows) {
    const tableBody = document.querySelector("#unitsTable tbody");
    tableBody.innerHTML = "";

    rows.forEach(row => {
        const tr = document.createElement("tr");

        row.forEach(value => {
            const td = document.createElement("td");
            td.textContent = value ?? "";
            td.contentEditable = "true";
            tr.appendChild(td);
        });

        tableBody.appendChild(tr);
    });
}

// =========================
// ADD UNIT ROW
// =========================

function addUnitRow() {
    const tableBody = document.querySelector("#unitsTable tbody");

    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td contenteditable="true"></td>
        <td contenteditable="true"></td>
        <td contenteditable="true"></td>
        <td contenteditable="true"></td>
        <td contenteditable="true"></td>
        <td contenteditable="true"></td>
        <td contenteditable="true"></td>
        <td contenteditable="true"></td>
        <td contenteditable="true"></td>
        <td contenteditable="true"></td>
    `;

    tableBody.appendChild(tr);
}

// =========================
// COLLECT TABLE DATA
// =========================

function collectTableData() {
    const tableBody = document.querySelector("#unitsTable tbody");
    const rows = [];

    tableBody.querySelectorAll("tr").forEach(tr => {
        const row = [];
        tr.querySelectorAll("td").forEach(td => {
            row.push(td.textContent.trim());
        });
        rows.push(row);
    });

    return rows;
}
// =========================
// BUTTON EVENT LISTENERS
// =========================

// =========================
// BUTTON EVENT LISTENERS
// =========================

document.getElementById("loadDataBtn").addEventListener("click", loadData);
document.getElementById("saveDataBtn").addEventListener("click", saveData);
document.getElementById("addUnitBtn").addEventListener("click", addUnitRow);

