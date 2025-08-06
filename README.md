# Algorithm Visualizer

A comprehensive web application for learning and visualizing algorithms with interactive animations.

## Features

### Algorithm Visualization
- **Sorting Algorithms**: Visualize sorting algorithms with animated bar charts
  - Bubble Sort
  - Insertion Sort
  - Merge Sort (coming soon)
- **Searching Algorithms**: Watch search algorithms in action
  - Binary Search
  - Linear Search
- **Graph Traversal**: Interactive graph visualizations
  - Breadth-First Search (BFS)
  - Depth-First Search (DFS)
- **Pathfinding**: Find shortest paths with visual feedback
  - Dijkstra's Algorithm
  - A* Algorithm (coming soon)

### Interactive Features
- **Step-by-step Animation**: Control the visualization speed and step through algorithms
- **Real-time Visualization**: Watch algorithms execute in real-time
- **Multiple Views**: Switch between code editor and visualization modes
- **Dark Mode Support**: Toggle between light and dark themes

### Code Editor
- **Multi-language Support**: JavaScript, Python, and Java
- **Syntax Highlighting**: Monaco Editor integration
- **Algorithm Templates**: Pre-built starter templates for each algorithm
- **Code Analysis**: Get feedback on your implementations

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Open in Browser**
   Navigate to `http://localhost:3000`

## Usage

### Viewing Algorithm Visualizations
1. Navigate to the visualizer page
2. Select an algorithm from the dropdown
3. Click the "Visualization" tab
4. Use the controls to play, pause, or step through the animation

### Writing Code
1. Select an algorithm
2. Choose your preferred programming language
3. Write your implementation in the code editor
4. Submit your code for analysis

### Visualization Controls
- **Play/Pause**: Start or stop the animation
- **Previous/Next**: Step through the algorithm manually
- **Reset**: Return to the beginning
- **Speed Slider**: Adjust animation speed

## Algorithm Categories

### Sorting Algorithms
Visualize how different sorting algorithms work by watching bars move and change colors:
- **Yellow**: Elements being compared
- **Red**: Elements being swapped
- **Green**: Sorted elements

### Graph Algorithms
Watch graph traversal and pathfinding algorithms:
- **Green**: Start node
- **Red**: End node
- **Blue**: Current node being processed
- **Purple**: Visited nodes
- **Yellow**: Path nodes

## Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Code Editor**: Monaco Editor
- **State Management**: Zustand

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details.
