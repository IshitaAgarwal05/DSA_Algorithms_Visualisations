let start = null;
let goal = null;

function createGrid() {
    const gridContainer = document.getElementById("grid");
    gridContainer.innerHTML = "";

    for (let r = 0; r < gridData.length; r++) {
        for (let c = 0; c < gridData[r].length; c++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.row = r;
            cell.dataset.col = c;

            if (gridData[r][c] === "wall") {
                cell.classList.add("wall");
            }

            cell.onclick = () => selectCell(cell, r, c);
            gridContainer.appendChild(cell);
        }
    }
}

function animatePath(path) {
    path.forEach(([r, c], index) => {
        setTimeout(() => {
            document.querySelectorAll(".cell").forEach(cell => {
                if (+cell.dataset.row === r && +cell.dataset.col === c) {
                    cell.classList.add("path");
                }
            });
        }, index * 200);
    });
}

function resetGrid() {
    start = null;
    goal = null;
    createGrid();
}

createGrid();


// Algorithm Selector Logic
function runAlgorithm() {
    if (!start || !goal) {
        alert("Select start and goal first!");
        return;
    }

    const algorithm = document.getElementById("algorithm").value;

    fetch("/run_algorithm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ start, goal, algorithm })
    })
    .then(res => res.json())
    .then(data => animatePath(data.path));
}

function selectCell(cell, row, col) {
    if (!start && !cell.classList.contains("wall")) {
        start = [row, col];
        cell.classList.add("start");
    }
    else if (!goal && !cell.classList.contains("wall")) {
        goal = [row, col];
        cell.classList.add("goal");
    }
}
