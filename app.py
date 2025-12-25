import heapq
import random
from flask import Flask, render_template, request, jsonify
import webbrowser
import threading
from collections import deque

app = Flask(__name__)

ROWS, COLS = 10, 10

# ---------------- GRID ---------------- #

def generate_grid(rows, cols, wall_probability=0.2):
    return [
        ['wall' if random.random() < wall_probability else 'empty'
         for _ in range(cols)]
        for _ in range(rows)
    ]

grid = generate_grid(ROWS, COLS)

def get_neighbors(grid, cell):
    row, col = cell
    neighbors = [
        (row + 1, col),
        (row - 1, col),
        (row, col + 1),
        (row, col - 1)
    ]
    return [
        (r, c) for r, c in neighbors
        if 0 <= r < ROWS and 0 <= c < COLS and grid[r][c] != 'wall'
    ]

# ---------------- HEURISTIC ---------------- #

def heuristic(a, b):
    # Manhattan distance
    return abs(a[0] - b[0]) + abs(a[1] - b[1])

# ---------------- DIJKSTRA ---------------- #

def dijkstra(grid, start, goal):
    pq = [(0, start)]
    distances = {start: 0}
    parent = {start: None}
    visited = set()
    visit_order = []

    while pq:
        current_distance, current = heapq.heappop(pq)

        if current in visited:
            continue

        visited.add(current)
        visit_order.append(current)

        if current == goal:
            path = []
            while current:
                path.append(current)
                current = parent[current]
            return visit_order, path[::-1]

        for neighbor in get_neighbors(grid, current):
            new_dist = current_distance + 1
            if neighbor not in distances or new_dist < distances[neighbor]:
                distances[neighbor] = new_dist
                parent[neighbor] = current
                heapq.heappush(pq, (new_dist, neighbor))

    return visit_order, []

# ---------------- BFS ---------------- #

def bfs(grid, start, goal):
    queue = deque([start])
    visited = set([start])
    parent = {start: None}
    visit_order = []

    while queue:
        current = queue.popleft()
        visit_order.append(current)

        if current == goal:
            path = []
            while current:
                path.append(current)
                current = parent[current]
            return visit_order, path[::-1]

        for neighbor in get_neighbors(grid, current):
            if neighbor not in visited:
                visited.add(neighbor)
                parent[neighbor] = current
                queue.append(neighbor)

    return visit_order, []

# ---------------- DFS ---------------- #

def dfs(grid, start, goal):
    stack = [start]
    visited = set([start])
    parent = {start: None}
    visit_order = []

    while stack:
        current = stack.pop()
        visit_order.append(current)

        if current == goal:
            path = []
            while current:
                path.append(current)
                current = parent[current]
            return visit_order, path[::-1]

        for neighbor in get_neighbors(grid, current):
            if neighbor not in visited:
                visited.add(neighbor)
                parent[neighbor] = current
                stack.append(neighbor)

    return visit_order, []

# ---------------- A* ---------------- #

def astar(grid, start, goal):
    open_set = []
    heapq.heappush(open_set, (0, start))

    g_score = {start: 0}
    parent = {start: None}
    visited = set()
    visit_order = []

    while open_set:
        _, current = heapq.heappop(open_set)

        if current in visited:
            continue

        visited.add(current)
        visit_order.append(current)

        if current == goal:
            path = []
            while current:
                path.append(current)
                current = parent[current]
            return visit_order, path[::-1]

        for neighbor in get_neighbors(grid, current):
            temp_g = g_score[current] + 1
            if neighbor not in g_score or temp_g < g_score[neighbor]:
                g_score[neighbor] = temp_g
                f_score = temp_g + heuristic(neighbor, goal)
                parent[neighbor] = current
                heapq.heappush(open_set, (f_score, neighbor))

    return visit_order, []


@app.route("/compare", methods=["POST"])
def compare():
    data = request.json
    start = tuple(data["start"])
    goal = tuple(data["goal"])

    results = {
        "bfs": bfs(grid, start, goal)[1],
        "dfs": dfs(grid, start, goal)[1],
        "dijkstra": dijkstra(grid, start, goal)[1],
        "astar": astar(grid, start, goal)[1]
    }

    return jsonify(results)




# ---------------- GRAPHS ---------------- #
def prim(nodes, edges):
    import heapq

    adj = {i: [] for i in range(len(nodes))}
    for u, v, w in edges:
        adj[u].append((w, v))
        adj[v].append((w, u))

    visited = set()
    mst = []
    pq = [(0, 0, -1)]  # (weight, node, parent)

    while pq:
        w, node, parent = heapq.heappop(pq)
        if node in visited:
            continue

        visited.add(node)
        if parent != -1:
            mst.append((parent, node, w))

        for wt, nei in adj[node]:
            if nei not in visited:
                heapq.heappush(pq, (wt, nei, node))

    return mst


class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb:
            return False
        if self.rank[ra] < self.rank[rb]:
            self.parent[ra] = rb
        elif self.rank[ra] > self.rank[rb]:
            self.parent[rb] = ra
        else:
            self.parent[rb] = ra
            self.rank[ra] += 1
        return True


def kruskal(nodes, edges):
    dsu = DSU(len(nodes))
    mst = []
    rejected = []

    # sort edges by weight
    edges_sorted = sorted(edges, key=lambda e: e["weight"])

    for e in edges_sorted:
        u, v, w = e["u"], e["v"], e["weight"]
        if dsu.union(u, v):
            mst.append([u, v, w])
        else:
            rejected.append([u, v, w])

    return mst, rejected








@app.route("/run_prim", methods=["POST"])
def run_prim():
    data = request.json
    nodes = data["nodes"]
    edges = data["edges"]

    mst = prim(nodes, edges)
    return jsonify({"mst": mst})

@app.route("/run_kruskal", methods=["POST"])
def run_kruskal():
    data = request.json
    nodes = data["nodes"]
    edges = data["edges"]

    mst, rejected = kruskal(nodes, edges)

    return jsonify({
        "mst": mst,
        "rejected": rejected
    })



# ---------------- ROUTES ---------------- #

@app.route("/")
def home():
    return render_template("index.html", grid=grid)


@app.route("/find_path", methods=["POST"])
def find_path():
    data = request.json
    start = tuple(data["start"])
    goal = tuple(data["goal"])
    
    path = dijkstra(grid, start, goal)
    return jsonify({"path": path})


@app.route("/run_algorithm", methods=["POST"])
def run_algorithm():
    data = request.json
    start = tuple(data["start"])
    goal = tuple(data["goal"])
    algorithm = data["algorithm"]

    if algorithm == "dijkstra":
        visited, path = dijkstra(grid, start, goal)

    elif algorithm == "bfs":
        visited, path = bfs(grid, start, goal)

    elif algorithm == "dfs":
        visited, path = dfs(grid, start, goal)

    elif algorithm == "astar":
        visited, path = astar(grid, start, goal)

    else:
        visited, path = [], []

    return jsonify({
        "visited": visited,
        "path": path
    })

# ---------------- MAIN ---------------- #

if __name__ == "__main__":
    def open_browser():
        webbrowser.open_new("http://127.0.0.1:5000")

    threading.Timer(1.5, open_browser).start()
    app.run(debug=True)
