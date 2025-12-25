const canvas = document.getElementById("graphCanvas");
const ctx = canvas.getContext("2d");

let nodes = [];
let edges = [];
let selectedNode = null;

const RADIUS = 18;

// ---------------- DRAW GRAPH ---------------- //
function drawGraph() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw edges
    edges.forEach(e => {
        const u = nodes[e.u];
        const v = nodes[e.v];

        ctx.beginPath();
        ctx.moveTo(u.x, u.y);
        ctx.lineTo(v.x, v.y);
        ctx.strokeStyle = "#94a3b8";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw weight
        const mx = (u.x + v.x) / 2;
        const my = (u.y + v.y) / 2;
        ctx.fillStyle = "#e5e7eb";
        ctx.font = "14px Arial";
        ctx.fillText(e.weight, mx, my);
    });

    // Draw nodes
    nodes.forEach(n => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = "#38bdf8";
        ctx.fill();
        ctx.strokeStyle = "#0f172a";
        ctx.stroke();

        ctx.fillStyle = "black";
        ctx.font = "14px Arial";
        ctx.fillText(n.id, n.x - 4, n.y + 4);
    });
}

// ---------------- NODE HIT TEST ---------------- //
function getNodeAt(x, y) {
    return nodes.find(n =>
        Math.hypot(n.x - x, n.y - y) <= RADIUS
    );
}

// ---------------- CLICK HANDLER ---------------- //
canvas.addEventListener("click", e => {
    if (mode !== "graph") return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clickedNode = getNodeAt(x, y);

    // Case 1: Click on empty space → create node
    if (!clickedNode) {
        nodes.push({ id: nodes.length, x, y });
        selectedNode = null;
        drawGraph();
        return;
    }

    // Case 2: First node selected
    if (selectedNode === null) {
        selectedNode = clickedNode;
        return;
    }

    // Case 3: Second node selected → create edge
    if (selectedNode && selectedNode !== clickedNode) {
        const weight = prompt("Enter edge weight:");
        if (weight !== null && weight !== "") {
            edges.push({
                u: selectedNode.id,
                v: clickedNode.id,
                weight: parseInt(weight)
            });
        }
        selectedNode = null;
        drawGraph();
    }
});


function runPrim() {
    if (mode !== "graph") return;

    fetch("/run_prim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nodes, edges })
    })
    .then(res => res.json())
    .then(data => animateMST(data.mst));
}


function animateMST(mstEdges) {
    let i = 0;

    function step() {
        if (i >= mstEdges.length) return;

        const [u, v, w] = mstEdges[i];

        // Highlight this edge
        ctx.beginPath();
        ctx.moveTo(nodes[u].x, nodes[u].y);
        ctx.lineTo(nodes[v].x, nodes[v].y);
        ctx.strokeStyle = "#22c55e"; // green
        ctx.lineWidth = 4;
        ctx.stroke();

        i++;
        setTimeout(step, 800);
    }

    step();
}

function runKruskal() {
    if (mode !== "graph") return;

    fetch("/run_kruskal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nodes, edges })
    })
    .then(res => res.json())
    .then(data => animateKruskal(data.mst, data.rejected));
}

function animateKruskal(mst, rejected) {
    let i = 0;

    function step() {
        if (i >= mst.length) return;

        const [u, v] = mst[i];

        ctx.beginPath();
        ctx.moveTo(nodes[u].x, nodes[u].y);
        ctx.lineTo(nodes[v].x, nodes[v].y);
        ctx.strokeStyle = "#22c55e"; // green MST
        ctx.lineWidth = 4;
        ctx.stroke();

        i++;
        setTimeout(step, 800);
    }

    step();

    // Optional: rejected edges in red (cycle detection)
    rejected.forEach(([u, v]) => {
        ctx.beginPath();
        ctx.moveTo(nodes[u].x, nodes[u].y);
        ctx.lineTo(nodes[v].x, nodes[v].y);
        ctx.strokeStyle = "#ef4444"; // red
        ctx.lineWidth = 2;
        ctx.stroke();
    });
}
