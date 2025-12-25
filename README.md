# DSA Algorithm Visualizer

An interactive, web-based **Data Structures and Algorithms Visualizer** built using **Python (Flask)** for backend and **HTML, CSS, JavaScript** for frontend. This project is designed to help students **visually understand** core DSA concepts through animations and interactive controls.

---

## Features
### Pathfinding Algorithms (Grid Mode)
- Dijkstra’s Algorithm
- Breadth First Search (BFS)
- Depth First Search (DFS)
- A* Algorithm (Manhattan Heuristic)
- Step-by-step **visited node animation**
- Shortest path visualization
- Algorithm comparison on the same grid

### Graph Algorithms (Graph Mode)
- Interactive graph creation (nodes + weighted edges)
- Prim’s Algorithm (Minimum Spanning Tree)
- Kruskal’s Algorithm with DSU (Union-Find)
- Visual MST construction (edge-by-edge animation)
- Cycle detection visualization

### Data Structures Visualization
- Stack (Push / Pop) — LIFO
- Queue (Enqueue / Dequeue) — FIFO
- Singly Linked List (Insert / Delete)
- Binary Tree
  - Inorder Traversal
  - Preorder Traversal
  - Postorder Traversal
  - Animated traversal highlighting

---

## 🛠️ Tech Stack

| Layer | Technology |
|-----|-----------|
| Backend | Python, Flask |
| Frontend | HTML, CSS, JavaScript |
| Visualization | HTML Canvas |
| Algorithms | DSA (Graphs, Trees, DSU) |

---

## 📂 Project Structure
```
dsa-algorithm-visualizer/
│
├── app.py
├── templates/
│ └── index.html
│
├── static/
│ ├── css/
│ │ └── style.css
│ ├── js/
│ │ ├── grid.js
│ │ ├── graph.js
│ │ └── ds.js
│ └── favicon.jpg
│
├── README.md
```


---

## ▶️ How to Run Locally

1. Clone the repository
   ```bash
   git clone https://github.com/IshitaAgarwal05/DSA_Algorithms_Visualisations.git
  ```

2. Navigate to the project directory
  ```bash
  cd dsa-algorithm-visualizer
  ```

3. Install Flask
  ```bash
  pip install flask
  ```

4. Run the application
  ```bash
  python app.py
  ```

5. Open browser and go to:
  ```bash
  http://127.0.0.1:5000
  ```

## Academic Relevance
This project demonstrates:
- Graph traversal and shortest path algorithms
- Greedy algorithms (Prim, Kruskal)
- Disjoint Set Union (Union-Find)
- Core data structures with visual learning
- Separation of concerns (UI, logic, backend)


## 📌 Future Enhancements
- BST insertion & deletion
- AVL / Red-Black Tree
- Floyd–Warshall algorithm
- Export traversal steps


## 👨‍💻 Author
**Ishita Agarwal**