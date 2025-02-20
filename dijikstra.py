import heapq
import random
from flask import Flask, render_template, request, jsonify
import webbrowser
import threading

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

if __name__ == "__main__":
    def open_browser():
        webbrowser.open_new("http://127.0.0.1:5000")

    threading.Timer(1.5, open_browser).start()
    app.run(debug=True)