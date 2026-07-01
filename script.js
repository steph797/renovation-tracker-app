// =========================
// CONFIG
// =========================

// Your Google Sheets API key
const API_KEY = "AIzaSyC1GoZ0IqBvy3Qe2A-Pg5Ysa0sbI7QqqIQ";

// Your Google Sheet ID
const SHEET_ID = "1dJp6DuZTGrQ0TUPv81JjB3m9FYbBXdHhWKATSKnvGBE";

// The sheet/tab name inside your Google Sheet
const SHEET_NAME = "Sheet1"; // Change if your tab name is different

// =========================
// LOAD DATA FROM GOOGLE SHEETS
// =========================

async function loadData() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`;

    const res = await fetch(url);
    const data = await res.json();

    if (!data.values) {
        alert("No data found in Google Sheet.");
        return [];
    }

    // Remove header row
    return data.values.slice(1);
}

// =========================
// SAVE DATA TO GOOGLE SHEETS
// =========================

async function saveData(rows) {
    const body = {
        values: rows
    };

    const url =
        `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}!A2:Z999?valueInputOption=RAW&key=${API_KEY}`;

    const res = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
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
    const tbody = document.querySelector("#unitsTable tbody");
    tbody.innerHTML = "";

    rows.forEach(row => {
        const tr = document.createElement("tr");

        row.forEach(value => {
            const td = document.createElement("td");
            td.textContent = value ?? "";
            td.contentEditable = "true";
            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });
}

// =========================
// COLLECT TABLE DATA
// =========================

function collectTableData() {
    const rows = [];

    document.querySelectorAll("#unitsTable tbody tr").forEach(tr => {
        const cells = Array.from(tr.querySelectorAll("td")).map(td =>
            td.textContent.trim()
        );
        rows.push(cells);
    });

    return rows;
}

// =========================
// BUTTON HANDLERS
// =========================

document.getElementById("loadBtn").addEventListener("click", async () => {
    const rows = await loadData();
    renderTable(rows);
});

document.getElementById("saveBtn").addEventListener("click", async () => {
    const rows = collectTableData();
    await saveData(rows);
});
ick", loadExcelData);
document.getElementById("saveDataBtn").addEventListener("click", saveExcelData);
