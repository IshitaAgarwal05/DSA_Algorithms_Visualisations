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
    if (value === "") return;

    linkedList.push(value);   // insert at end
    renderLL();
    document.getElementById("llValue").value = "";
}

function deleteLL() {
    const value = document.getElementById("llValue").value;
    if (value === "") return;

    linkedList = linkedList.filter(v => v !== value);
    renderLL();
    document.getElementById("llValue").value = "";
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
            arrow.innerHTML = "&#8594;"; // →
            container.appendChild(arrow);
        }
    });
}

const treeCanvas = document.getElementById("treeCanvas");
const tctx = treeCanvas.getContext("2d");

let tree = [];

function insertTree() {
    const value = document.getElementById("treeValue").value;
    if (value === "") return;

    tree.push(value);   // level-order insert
    drawTree();
    document.getElementById("treeValue").value = "";
}

function drawTree(highlightIndex = -1) {
    tctx.clearRect(0, 0, treeCanvas.width, treeCanvas.height);

    const radius = 18;
    const levelGap = 70;

    tree.forEach((val, i) => {
        const level = Math.floor(Math.log2(i + 1));
        const indexInLevel = i - (2 ** level - 1);
        const nodesInLevel = 2 ** level;

        const x =
            (treeCanvas.width / (nodesInLevel + 1)) * (indexInLevel + 1);
        const y = 40 + level * levelGap;

        // Draw edge
        if (i !== 0) {
            const parent = Math.floor((i - 1) / 2);
            const pLevel = Math.floor(Math.log2(parent + 1));
            const pIndex = parent - (2 ** pLevel - 1);
            const pNodes = 2 ** pLevel;

            const px =
                (treeCanvas.width / (pNodes + 1)) * (pIndex + 1);
            const py = 40 + pLevel * levelGap;

            tctx.beginPath();
            tctx.moveTo(px, py);
            tctx.lineTo(x, y);
            tctx.strokeStyle = "#94a3b8";
            tctx.stroke();
        }

        // Draw node
        tctx.beginPath();
        tctx.arc(x, y, radius, 0, Math.PI * 2);
        tctx.fillStyle = (i === highlightIndex) ? "#facc15" : "#38bdf8";
        tctx.fill();
        tctx.strokeStyle = "#0f172a";
        tctx.stroke();

        tctx.fillStyle = "black";
        tctx.fillText(val, x - 6, y + 4);
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

    animateTraversal(order);
}
