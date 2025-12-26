let stack = [];

function pushStack() {
    const value = document.getElementById("stackValue").value;
    if (value === "") return;

    stack.push(value);
    renderStack();
    document.getElementById("stackValue").value = "";
}

function popStack() {
    if (stack.length === 0) return;
    stack.pop();
    renderStack();
}

function renderStack() {
    const container = document.getElementById("stackContainer");
    container.innerHTML = "";

    stack.forEach(item => {
        const div = document.createElement("div");
        div.className = "stack-item";
        div.innerText = item;
        container.appendChild(div);
    });
}

let queue = [];

function enqueue() {
    const value = document.getElementById("queueValue").value;
    if (value === "") return;

    queue.push(value);      // rear insert
    renderQueue();
    document.getElementById("queueValue").value = "";
}

function dequeue() {
    if (queue.length === 0) return;

    queue.shift();          // front remove
    renderQueue();
}

function renderQueue() {
    const container = document.getElementById("queueContainer");
    container.innerHTML = "";

    queue.forEach(item => {
        const div = document.createElement("div");
        div.className = "queue-item";
        div.innerText = item;
        container.appendChild(div);
    });
}

let linkedList = [];

function insertLL() {
    const value = document.getElementById("llValue").value;
    if (!value) return;

    const container = document.getElementById("llContainer");

    // Step 1: Create node visually (floating)
    const newNode = document.createElement("div");
    newNode.className = "ll-node temp-node";
    newNode.innerText = value;
    container.appendChild(newNode);

    // Step 2: After delay, attach it
    setTimeout(() => {
        linkedList.push(value);
        renderLL();
    }, 800);
}


function deleteLL() {
    const value = document.getElementById("llValue").value;
    const index = linkedList.indexOf(value);
    if (index === -1) return;

    const nodes = document.querySelectorAll(".ll-node");
    nodes[index].classList.add("delete-node");

    setTimeout(() => {
        linkedList.splice(index, 1);
        renderLL();
    }, 800);
}


function renderLL() {
    const container = document.getElementById("llContainer");
    container.innerHTML = "";

    linkedList.forEach((value, index) => {
        const node = document.createElement("div");
        node.className = "ll-node";
        node.innerText = value;
        container.appendChild(node);

        if (index < linkedList.length - 1) {
            const arrow = document.createElement("span");
            arrow.className = "ll-arrow";
            arrow.innerHTML = "→";   // pointer
            container.appendChild(arrow);
        }
    });
}


const treeCanvas = document.getElementById("treeCanvas");
const tctx = treeCanvas.getContext("2d");

let tree = [];

function calculateTreePositions() {
    const levelGap = 70;
    tree.forEach((node, i) => {
        const level = Math.floor(Math.log2(i + 1));
        const index = i - (2 ** level - 1);
        const nodesInLevel = 2 ** level;

        node.x = (treeCanvas.width / (nodesInLevel + 1)) * (index + 1);
        node.y = 40 + level * levelGap;
    });
}

function insertTree() {
    const value = document.getElementById("treeValue").value;
    if (!value) return;

    tree.push({ value });
    calculateTreePositions();
    drawTree();
}

function drawTree(highlightIndex = -1) {
    tctx.clearRect(0, 0, treeCanvas.width, treeCanvas.height);

    const radius = 18;
    const levelGap = 70;

    tree.forEach((node, i) => {
        const level = Math.floor(Math.log2(i + 1));
        const indexInLevel = i - (2 ** level - 1);
        const nodesInLevel = 2 ** level;

        const x =
            (treeCanvas.width / (nodesInLevel + 1)) * (indexInLevel + 1);
        const y = 40 + level * levelGap;

        // -------- DRAW EDGE WITH POINTER ARROW --------
        if (i !== 0) {
            const parent = Math.floor((i - 1) / 2);
            const pLevel = Math.floor(Math.log2(parent + 1));
            const pIndex = parent - (2 ** pLevel - 1);
            const pNodes = 2 ** pLevel;

            const px =
                (treeCanvas.width / (pNodes + 1)) * (pIndex + 1);
            const py = 40 + pLevel * levelGap;

            // main edge
            tctx.beginPath();
            tctx.moveTo(px, py);
            tctx.lineTo(x, y);
            tctx.strokeStyle = "#94a3b8";
            tctx.lineWidth = 2;
            tctx.stroke();

            // arrow head (pointer)
            const angle = Math.atan2(y - py, x - px);
            tctx.beginPath();
            tctx.moveTo(
                x - 10 * Math.cos(angle - 0.3),
                y - 10 * Math.sin(angle - 0.3)
            );
            tctx.lineTo(x, y);
            tctx.lineTo(
                x - 10 * Math.cos(angle + 0.3),
                y - 10 * Math.sin(angle + 0.3)
            );
            tctx.fillStyle = "#94a3b8";
            tctx.fill();
        }

        // -------- DRAW NODE --------
        tctx.beginPath();
        tctx.arc(x, y, radius, 0, Math.PI * 2);
        tctx.fillStyle =
            i === highlightIndex ? "#facc15" : "#38bdf8";
        tctx.fill();
        tctx.strokeStyle = "#0f172a";
        tctx.stroke();

        // -------- DRAW VALUE --------
        tctx.fillStyle = "black";
        tctx.font = "14px Arial";
        tctx.textAlign = "center";
        tctx.textBaseline = "middle";
        tctx.fillText(node.value, x, y);
    });
}

function traverse(type) {
    let order = [];

    function inorder(i) {
        if (i >= tree.length) return;
        inorder(2*i + 1);
        order.push(i);
        inorder(2*i + 2);
    }

    function preorder(i) {
        if (i >= tree.length) return;
        order.push(i);
        preorder(2*i + 1);
        preorder(2*i + 2);
    }

    function postorder(i) {
        if (i >= tree.length) return;
        postorder(2*i + 1);
        postorder(2*i + 2);
        order.push(i);
    }

    if (type === "inorder") inorder(0);
    if (type === "preorder") preorder(0);
    if (type === "postorder") postorder(0);

    animateTraversal(order);
}


function traverse(type) {
    let order = [];

    function inorder(i) {
        if (i >= tree.length) return;
        inorder(2*i + 1);
        order.push(i);
        inorder(2*i + 2);
    }

    function preorder(i) {
        if (i >= tree.length) return;
        order.push(i);
        preorder(2*i + 1);
        preorder(2*i + 2);
    }

    function postorder(i) {
        if (i >= tree.length) return;
        postorder(2*i + 1);
        postorder(2*i + 2);
        order.push(i);
    }

    if (type === "inorder") inorder(0);
    if (type === "preorder") preorder(0);
    if (type === "postorder") postorder(0);

    // 🔥 FULL SEQUENCE (static)
    const sequence = order.map(i => tree[i].value).join(" → ");
    document.getElementById("treeSequence").innerText =
        `Traversal Order: ${sequence}`;

    animateTraversal(order);
}



function animateTraversal(order) {
    let i = 0;

    function step() {
        if (i >= order.length) return;

        drawTree(order[i]);   // highlight current node
        updateTreeExplain(order[i]);  // 👈 explanation text

        i++;
        setTimeout(step, 900);
    }

    step();
}

function updateTreeExplain(index) {
    document.getElementById("treeExplain").innerText =
        `Visiting node ${tree[index].value}`;
}





// -------------------------HEAP-------------------------
let heap = [];
let heapType = "min"; // or "max"

function insertHeapUI() {
    const value = parseInt(document.getElementById("heapValue").value);
    heapType = document.getElementById("heapType").value;
    if (isNaN(value)) return;

    insertHeap(value);
    document.getElementById("heapValue").value = "";
}

function extractRootUI() {
    heapType = document.getElementById("heapType").value;
    extractRoot();
}


function insertHeap(value) {
    heap.push(value);
    heapifyUp(heap.length - 1);
    drawHeap();
}

function extractRoot() {
    if (heap.length === 0) return;
    heap[0] = heap.pop();
    heapifyDown(0);
    drawHeap();
}

function heapifyUp(i) {
    if (i === 0) return;
    const parent = Math.floor((i - 1) / 2);

    if (
        (heapType === "min" && heap[i] < heap[parent]) ||
        (heapType === "max" && heap[i] > heap[parent])
    ) {
        [heap[i], heap[parent]] = [heap[parent], heap[i]];
        heapifyUp(parent);
    }
}


function heapifyDown(i) {
    let left = 2*i + 1;
    let right = 2*i + 2;
    let target = i;

    if (left < heap.length &&
        ((heapType === "min" && heap[left] < heap[target]) ||
         (heapType === "max" && heap[left] > heap[target])))
        target = left;

    if (right < heap.length &&
        ((heapType === "min" && heap[right] < heap[target]) ||
         (heapType === "max" && heap[right] > heap[target])))
        target = right;

    if (target !== i) {
        [heap[i], heap[target]] = [heap[target], heap[i]];
        heapifyDown(target);
    }
}

const heapCanvas = document.getElementById("heapCanvas");
const hctx = heapCanvas.getContext("2d");

function drawHeap() {
    hctx.clearRect(0, 0, heapCanvas.width, heapCanvas.height);

    const levelGap = 70;
    const radius = 18;

    heap.forEach((val, i) => {
        const level = Math.floor(Math.log2(i + 1));
        const index = i - (2 ** level - 1);
        const nodesInLevel = 2 ** level;

        const x = (heapCanvas.width / (nodesInLevel + 1)) * (index + 1);
        const y = 40 + level * levelGap;

        // draw edge
        if (i !== 0) {
            const parent = Math.floor((i - 1) / 2);
            const pLevel = Math.floor(Math.log2(parent + 1));
            const pIndex = parent - (2 ** pLevel - 1);
            const pNodes = 2 ** pLevel;

            const px = (heapCanvas.width / (pNodes + 1)) * (pIndex + 1);
            const py = 40 + pLevel * levelGap;

            hctx.beginPath();
            hctx.moveTo(px, py);
            hctx.lineTo(x, y);
            hctx.strokeStyle = "#94a3b8";
            hctx.stroke();

            // arrow
            const angle = Math.atan2(y - py, x - px);
            hctx.beginPath();
            hctx.moveTo(x - 10 * Math.cos(angle - 0.3), y - 10 * Math.sin(angle - 0.3));
            hctx.lineTo(x, y);
            hctx.lineTo(x - 10 * Math.cos(angle + 0.3), y - 10 * Math.sin(angle + 0.3));
            hctx.fillStyle = "#94a3b8";
            hctx.fill();
        }

        // draw node
        hctx.beginPath();
        hctx.arc(x, y, radius, 0, Math.PI * 2);
        hctx.fillStyle = "#38bdf8";
        hctx.fill();
        hctx.stroke();

        hctx.fillStyle = "black";
        hctx.fillText(heap[i], x - 6, y + 4);
    });

    document.getElementById("heapExplain").innerText =
        `${heapType.toUpperCase()} Heap: Root = ${heap[0] ?? "-"}`;
}
