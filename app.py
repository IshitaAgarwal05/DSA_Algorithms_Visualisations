import heapq
import random
from flask import Flask, render_template, request, jsonify, send_from_directory
import webbrowser
import threading
from collections import deque

app = Flask(__name__)

ROWS, COLS = 10, 10

# Generate a grid with walls
def generate_grid(rows, cols, wall_probability=0.2):
    return [['wall' if random.random() < wall_probability else 'empty' for _ in range(cols)] for _ in range(rows)]

grid = generate_grid(ROWS, COLS)

def get_neighbors(grid, cell):
    row, col = cell
    neighbors = [(row + 1, col), (row - 1, col), (row, col + 1), (row, col - 1)]
    return [(r, c) for r, c in neighbors if 0 <= r < len(grid) and 0 <= c < len(grid[0]) and grid[r][c] != 'wall']



def heuristic(a, b):
    # Manhattan distance
    return abs(a[0] - b[0]) + abs(a[1] - b[1])



def dijkstra(grid, start, goal):
    pq = [(0, start)]
    distances = {start: 0}
    previous_nodes = {start: None}
    visited = set()

    while pq:
        current_distance, current_node = heapq.heappop(pq)
        if current_node in visited:
            continue
        visited.add(current_node)

        if current_node == goal:
            path = []
            while current_node:
                path.append(current_node)
                current_node = previous_nodes[current_node]
            return path[::-1]  # Reverse to get the correct path order

        for neighbor in get_neighbors(grid, current_node):
            new_distance = current_distance + 1
            if neighbor not in distances or new_distance < distances[neighbor]:
                distances[neighbor] = new_distance
                previous_nodes[neighbor] = current_node
                heapq.heappush(pq, (new_distance, neighbor))

    return []  # No path found


def bfs(grid, start, goal):
    from collections import deque
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



def dfs(grid, start, goal):
    stack = [start]
    visited = set([start])
    parent = {start: None}

    while stack:
        current = stack.pop()   # LIFO

        if current == goal:
            path = []
            while current:
                path.append(current)
                current = parent[current]
            return path[::-1]

        for neighbor in get_neighbors(grid, current):
            if neighbor not in visited:
                visited.add(neighbor)
                parent[neighbor] = current
                stack.append(neighbor)

    return []


def astar(grid, start, goal):
    open_set = []
    heapq.heappush(open_set, (0, start))

    g_score = {start: 0}
    parent = {start: None}
    visited = set()

    while open_set:
        _, current = heapq.heappop(open_set)

        if current in visited:
            continue
        visited.add(current)

        if current == goal:
            path = []
            while current:
                path.append(current)
                current = parent[current]
            return path[::-1]

        for neighbor in get_neighbors(grid, current):
            temp_g = g_score[current] + 1

            if neighbor not in g_score or temp_g < g_score[neighbor]:
                g_score[neighbor] = temp_g
                f_score = temp_g + heuristic(neighbor, goal)
                parent[neighbor] = current
                heapq.heappush(open_set, (f_score, neighbor))

    return []



@app.route('/assets/<path:filename>')
def assets_file(filename):
    return send_from_directory('assets', filename)

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
        path = dijkstra(grid, start, goal)

    elif algorithm == "astar":
        path = astar(grid, start, goal)  # coming next

    elif algorithm == "bfs":
        path = bfs(grid, start, goal)    # coming next

    elif algorithm == "dfs":
        path = dfs(grid, start, goal)    # coming next

    else:
        path = []

    return jsonify({"path": path})



if __name__ == "__main__":
    def open_browser():
        webbrowser.open_new("http://127.0.0.1:5000")

    threading.Timer(1.5, open_browser).start()
    app.run(debug=True)