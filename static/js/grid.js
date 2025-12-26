let start = null;
let goal = null;
let mode = "grid";

const gridAlgorithms = [
    { value: "dijkstra", label: "Dijkstra" },
    { value: "astar", label: "A* Search" },
    { value: "bfs", label: "BFS" },
    { value: "dfs", label: "DFS" }
];

const graphAlgorithms = [
    { value: "prim", label: "Prim's Algorithm" },
    { value: "kruskal", label: "Kruskal's Algorithm" },
    { value: "dijkstra", label: "Dijkstra" },
    { value: "astar", label: "A* Search" },
    { value: "bfs", label: "BFS" },
    { value: "dfs", label: "DFS" }
];



const algoInfo = {
    dijkstra: {
        title: "Dijkstra’s Algorithm",
        desc: "Finds the shortest path from a source to all vertices in a weighted graph with non-negative weights.",
        time: "O(E log V)",
        space: "O(V)",
        pseudo: `
1. Initialize distance[source] = 0
2. Push source into priority queue
3. While queue not empty:
   a. Extract min distance node
   b. Relax all adjacent edges
`
    },

    bfs: {
        title: "Breadth First Search (BFS)",
        desc: "Explores nodes level by level and finds the shortest path in unweighted graphs.",
        time: "O(V + E)",
        space: "O(V)",
        pseudo: `
1. Push start node into queue
2. Mark as visited
3. While queue not empty:
   a. Dequeue node
   b. Visit unvisited neighbors
`
    },

    dfs: {
        title: "Depth First Search (DFS)",
        desc: "Explores as deep as possible before backtracking. Does not guarantee shortest path.",
        time: "O(V + E)",
        space: "O(V)",
        pseudo: `
1. Push start node into stack
2. While stack not empty:
   a. Pop node
   b. Visit unvisited neighbors
`
    },

    astar: {
        title: "A* Algorithm",
        desc: "Optimized shortest path algorithm using heuristics to guide the search.",
        time: "O(E)",
        space: "O(V)",
        pseudo: `
f(n) = g(n) + h(n)
Use priority queue ordered by f(n)
`
    },

    prim: {
        title: "Prim’s Algorithm (Minimum Spanning Tree)",
        desc: "Prim’s algorithm builds a Minimum Spanning Tree by starting from a node and repeatedly adding the minimum-weight edge that connects a new vertex.",
        time: "O(E log V)",
        space: "O(V)",
        pseudo: `
    1. Start with any vertex
    2. Add it to MST set
    3. Pick minimum weight edge connecting MST to non-MST vertex
    4. Repeat until all vertices are included
    `
    },

    kruskal: {
        title: "Kruskal’s Algorithm (Minimum Spanning Tree)",
        desc: "Kruskal’s algorithm builds MST by sorting all edges and adding them one by one while avoiding cycles using DSU.",
        time: "O(E log E)",
        space: "O(V)",
        pseudo: `
    1. Sort all edges by weight
    2. Initialize DSU
    3. For each edge:
    - If it does not form a cycle, add to MST
    `
    }
};


function updateInfoPanel() {
    const algo = document.getElementById("algorithm").value;
    const info = algoInfo[algo];

    document.getElementById("algoTitle").innerText = info.title;
    document.getElementById("algoDesc").innerText = info.desc;
    document.getElementById("timeComplexity").innerText = info.time;
    document.getElementById("spaceComplexity").innerText = info.space;
    document.getElementById("pseudoCode").innerText = info.pseudo;
}





function switchMode() {
    mode = document.getElementById("mode").value;

    document.getElementById("grid").style.display =
        mode === "grid" ? "inline-grid" : "none";

    document.getElementById("graphCanvas").style.display =
        mode === "graph" ? "block" : "none";

    document.getElementById("graphControls").style.display =
        mode === "graph" ? "inline-flex" : "none";

    populateAlgorithms(mode);   
    resetGrid();
}




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


function animateResult(visited, path) {
    visited.forEach(([r, c], index) => {
        setTimeout(() => {
            document.querySelectorAll(".cell").forEach(cell => {
                if (+cell.dataset.row === r && +cell.dataset.col === c) {
                    if (!cell.classList.contains("start") &&
                        !cell.classList.contains("goal")) {
                        cell.classList.add("visited");
                    }
                }
            });
        }, index * 50);
    });

    setTimeout(() => {
        path.forEach(([r, c], index) => {
            setTimeout(() => {
                document.querySelectorAll(".cell").forEach(cell => {
                    if (+cell.dataset.row === r && +cell.dataset.col === c) {
                        cell.classList.remove("visited");
                        cell.classList.add("path");
                    }
                });
            }, index * 100);
        });
    }, visited.length * 50);
}


function resetGrid() {
    start = null;
    goal = null;
    document.getElementById("legend").style.display = "none";
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
    .then(data => animateResult(data.visited, data.path));
}


function compareAlgorithms() {
    if (!start || !goal) {
        alert("Select start and goal first!");
        return;
    }

    fetch("/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ start, goal })
    })
    .then(res => res.json())
    .then(data => drawComparison(data));
    document.getElementById("legend").style.display = "flex";
}


function drawComparison(results) {
    Object.keys(results).forEach(algo => {
        results[algo].forEach(([r, c], index) => {
            setTimeout(() => {
                document.querySelectorAll(".cell").forEach(cell => {
                    if (+cell.dataset.row === r && +cell.dataset.col === c) {
                        if (!cell.classList.contains("start") &&
                            !cell.classList.contains("goal")) {
                            cell.classList.add(algo);
                        }
                    }
                });
            }, index * 100);
        });
    });
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


function populateAlgorithms(mode) {
    const algoSelect = document.getElementById("algorithm");
    algoSelect.innerHTML = "";

    const list = (mode === "graph") ? graphAlgorithms : gridAlgorithms;

    list.forEach(algo => {
        const option = document.createElement("option");
        option.value = algo.value;
        option.textContent = algo.label;
        algoSelect.appendChild(option);
    });

    updateInfoPanel(); // update theory panel as well
}

populateAlgorithms("grid");
