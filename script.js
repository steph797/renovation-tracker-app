// version 3
// =========================
// CONFIG
// =========================

// Your Google Sheets API key
const API_KEY = "AIzaSyC1GoZ0IqBvy3Qe2A-Pg5Ysa0sbI7QqqIQ";

// Your Google Sheet ID
const SHEET_ID = "1dJp6DuZTGrQ0TUPv81JjB3m9FYbBXdHhWKATSKnvGBE";

// The sheet/tab name inside your Google Sheet
const SHEET_NAME = "Sheet1";

// =========================
// LOAD DATA FROM GOOGLE SHEETS
// =========================

async function loadData() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`;

    const res = await fetch(url);
    const data = await res.json();

    if (!data.values) {
        alert("No data found in Google Sheet.");
        return;
    }

    // Remove header row
    renderTable(data.values.slice(1));
}

// =========================
// SAVE DATA TO GOOGLE SHEETS
// =========================

async function saveData() {
    const rows = collectTableData();

    const body = { values: rows };

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}!A2:Z999?valueInputOption=RAW&key=${API_KEY}`;

    const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    if (!res.ok) {
        console.error(await res.text());
        alert("Error saving data to Google Sheets.");
        return;
    }

    alert("Saved to Google Sheets!");
}

// =========================
// RENDER TABLE
// =========================

function renderTable(rows) {
    const tableBody = document.querySelector("#unitsTable tbody");
    tableBody.innerHTML = ""; // Clear existing rows

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

    const newRow = document.createElement("tr");

    newRow.innerHTML = `
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

    tableBody.appendChild(newRow);
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

   
