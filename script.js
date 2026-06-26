const excelFileUrl = "./data/Empire%20Carpet%20Care%20-%20Unit%20Renovation%20Tracker.xlsx";
const sheetName = "Sheet1";

async function loadExcelData() {
    try {
        const response = await fetch(excelFileUrl, {
            mode: "cors",
            headers: {
                "Accept": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            }
        });

        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "buffer" });
        const sheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(sheet);

        populateTable(json);
    } catch (error) {
        alert("Error loading Excel data.");
        console.error(error);
    }
}

function populateTable(data) {
    const tbody = document.querySelector("#excelBody");
    tbody.innerHTML = "";

    // Sort rows by UnitNumber
    data.sort((a, b) => Number(a.UnitNumber) - Number(b.UnitNumber));

    data.forEach(row => {
        const tr = document.createElement("tr");

        // Color coding based on Status
        if (row.Status) {
            const status = row.Status.toLowerCase();
            if (status.includes("not")) tr.classList.add("status-not-started");
            else if (status.includes("progress")) tr.classList.add("status-in-progress");
            else if (status.includes("complete")) tr.classList.add("status-complete");
        }

        Object.keys(row).forEach(key => {
            const td = document.createElement("td");
            td.contentEditable = true;
            td.innerText = row[key] ?? "";
            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });
}

// Auto-calc status
function computeStatus(cells) {
    const steps = cells.slice(2, 9).map(td => td.innerText.trim());
    if (steps.every(s => s === "")) return "Not Started";
    if (steps.every(s => s !== "")) return "Complete";
    return "In Progress";
}

async function saveExcelData() {
    const rows = [];
    const trs = document.querySelectorAll("#excelBody tr");

    trs.forEach(tr => {
        const cells = tr.querySelectorAll("td");
        const row = {
            UnitNumber: cells[0].innerText,
            Floor: cells[1].innerText,
            Step1_Demo: cells[2].innerText,
            Step2_PlumberVisit1: cells[3].innerText,
            Step3_RedGuard_PanCut_BackerBoard: cells[4].innerText,
            Step4_ConcreteFill: cells[5].innerText,
            Step5_CabinetInstall: cells[6].innerText,
            Step6_PlumberV2: cells[7].innerText,
            Step7_ShowerPanels_GrabBars: cells[8].innerText,
            Status: computeStatus(cells),
            Notes: cells[10].innerText,
            LastUpdatedBy: "Stephanie",
            LastUpdatedAt: new Date().toLocaleString()
        };
        rows.push(row);
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "Empire Carpet Care-Unit Renovation Tracker.xlsx";
    a.click();
}

// Add new unit
document.getElementById("addUnitBtn").addEventListener("click", () => {
    const tbody = document.querySelector("#excelBody");
    const tr = document.createElement("tr");

    for (let i = 0; i < 13; i++) {
        const td = document.createElement("td");
        td.contentEditable = true;
        tr.appendChild(td);
    }

    tbody.appendChild(tr);
});

// Filters
document.getElementById("floorFilter").addEventListener("change", applyFilters);
document.getElementById("statusFilter").addEventListener("change", applyFilters);

function applyFilters() {
    const floor = document.getElementById("floorFilter").value;
    const status = document.getElementById("statusFilter").value.toLowerCase();

    document.querySelectorAll("#excelBody tr").forEach(tr => {
        const cells = tr.querySelectorAll("td");
        const rowFloor = cells[1].innerText;
        const rowStatus = cells[9].innerText.toLowerCase();

        let show = true;

        if (floor && rowFloor !== floor) show = false;
        if (status && !rowStatus.includes(status)) show = false;

        tr.style.display = show ? "" : "none";
    });
}

// Collapsible legend
function toggleLegend() {
    document.querySelectorAll(".legend-row").forEach(row => {
        row.style.display = row.style.display === "none" ? "" : "none";
    });
}

// Buttons
document.getElementById("loadDataBtn").addEventListener("click", loadExcelData);
document.getElementById("saveDataBtn").addEventListener("click", saveExcelData);
