# Algtrax - Interactive Algorithm Learning Platform

Algtrax is a comprehensive web application for learning algorithms through interactive visualizations and code practice. Users can explore various algorithms, write code implementations, and watch real-time visualizations of how algorithms work.

## 🚀 Features

### Core Functionality
- **Interactive Algorithm Visualizations**: Real-time animations showing how algorithms work step-by-step
- **Code Editor**: Write and test algorithm implementations in multiple languages (JavaScript, Python, Java)
- **Multiple Algorithm Categories**: Sorting, Searching, Graph Traversal, and Path Finding algorithms
- **Dark/Light Theme**: Toggle between themes for comfortable viewing
- **User Authentication**: Sign up and manage your learning progress
- **GIF Export**: Export algorithm visualizations as animated GIFs for sharing

### Algorithm Categories
- **Sorting**: Bubble Sort, Insertion Sort, Merge Sort, Quick Sort
- **Searching**: Linear Search, Binary Search, Hash Table Search
- **Graph Traversal**: Breadth-First Search, Depth-First Search
- **Path Finding**: Dijkstra's Algorithm, A* Algorithm

## 🏗️ Project Structure

### Frontend Architecture

```
src/
├── app/                    # Next.js app router pages
│   ├── page.tsx           # Landing page with algorithm showcase
│   ├── visualizer/        # Algorithm visualization page
│   └── layout.tsx         # Root layout with providers
├── components/            # Reusable UI components
│   ├── visualiser/       # Visualization components
│   ├── codeEditor/       # Code editor with syntax highlighting
│   ├── controls/         # Playback and execution controls
│   └── gifExporter/      # GIF export functionality
├── algorithms/           # Algorithm implementations
│   ├── bubble-sort.ts   # Sorting algorithm with visualization states
│   ├── bfs.ts           # Graph traversal algorithm
│   └── ...              # Other algorithm implementations
├── data/                # Static data and configurations
│   └── algorithms.ts    # Algorithm metadata and categories
├── store.ts             # Global state management (Zustand)
├── utils/               # Utility functions and services
│   └── algorithmService.ts  # Algorithm state generation service
└── styles/              # Global styles and theme configuration
```

### Key Components

#### Landing Page (`src/app/page.tsx`)
- **Purpose**: Main entry point showcasing available algorithms
- **Features**: 
  - Animated hero section with parallax effects
  - Algorithm cards organized by category
  - User authentication integration
  - Smooth scroll navigation
- **User Experience**: Users can browse algorithms, view complexity information, and click to start learning

#### Visualizer Page (`src/app/visualizer/page.tsx`)
- **Purpose**: Main learning interface for algorithm exploration
- **Features**:
  - Split view: Code editor + visualization side-by-side
  - Full-screen visualization mode
  - Algorithm information and complexity display
  - Mode toggle between code and visualization
- **User Experience**: Users can write code, run algorithms, and watch real-time visualizations

#### Code Editor (`src/components/codeEditor/codeEditor.tsx`)
- **Purpose**: Interactive code writing and testing
- **Features**:
  - Monaco Editor integration with syntax highlighting
  - Multiple language support (JavaScript, Python, Java)
  - Algorithm-specific starter templates
  - Model solutions for reference
  - Code validation and feedback
- **User Experience**: Users can write, test, and compare their implementations

#### Visualizer (`src/components/visualiser/visualiser.tsx`)
- **Purpose**: Display algorithm animations and provide playback controls
- **Features**:
  - Three visualization types: bar charts, graphs, hash tables
  - Playback controls (play, pause, step forward/backward)
  - Speed adjustment
  - Progress tracking
- **User Experience**: Users can watch algorithm execution at their own pace

#### Algorithm Service (`src/utils/algorithmService.ts`)
- **Purpose**: Bridge between algorithm implementations and visualization system
- **Features**:
  - Generates visualization states for different algorithm types
  - Provides default test data
  - Routes algorithms to appropriate visualization components
- **Backend Integration**: Coordinates with algorithm implementations to create animation frames

### State Management

#### Global Store (`src/store.ts`)
- **Purpose**: Centralized state management using Zustand
- **State**:
  - `code`: Current editor content
  - `states`: Visualization animation frames
  - `currentAlgorithm`: Selected algorithm ID
- **Actions**:
  - `runAlgorithm()`: Execute user code
  - `generateStates()`: Create visualization frames
  - `setCode()`: Update editor content

### Algorithm Implementation Pattern

Each algorithm follows a consistent pattern for generating visualization states:

```typescript
// Example: Bubble Sort implementation
export function bubbleSort(arr: number[]): BarState[] {
  const states: BarState[] = [];
  
  // Add initial state
  states.push({
    values: [...array],
    comparing: [],
    swapping: [],
    sorted: []
  });
  
  // Algorithm logic with state generation at each step
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // State: Show comparison
      states.push({
        values: [...array],
        comparing: [j, j + 1],
        swapping: [],
        sorted: [...]
      });
      
      if (array[j] > array[j + 1]) {
        // State: Show swapping
        states.push({...});
        // Perform swap
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        // State: Show result
        states.push({...});
      }
    }
  }
  
  return states;
}
```

## 🎨 Visualization Types

### Bar Chart Visualizations
- **Used for**: Sorting and array-based algorithms
- **Features**: 
  - Each bar represents an array element
  - Colors indicate current operation (comparing, swapping, sorted)
  - Animated transitions between states
  - Progress tracking and legends

### Graph Visualizations
- **Used for**: Graph traversal and pathfinding algorithms
- **Features**:
  - Nodes and edges with visual states
  - Path highlighting and node status tracking
  - Queue and visited node visualization
  - Weight display for weighted algorithms

### Hash Table Visualizations
- **Used for**: Hash table operations
- **Features**:
  - Bucket and chain visualization
  - Hash function demonstration
  - Collision resolution visualization
  - Search path highlighting

## 🔧 Technical Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with dark/light theme support
- **State Management**: Zustand for lightweight global state
- **Code Editor**: Monaco Editor with syntax highlighting
- **Authentication**: Clerk for user management
- **Animations**: Framer Motion for smooth transitions
- **Visualizations**: Custom SVG-based components

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/algtrax.git
   cd algtrax
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Add your Clerk authentication keys
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 📚 Learning Flow

1. **Browse Algorithms**: Start on the landing page to explore available algorithms
2. **Select Algorithm**: Click on an algorithm card to open the visualizer
3. **Watch Visualization**: Use playback controls to understand how the algorithm works
4. **Write Code**: Switch to code editor mode to implement the algorithm
5. **Test Implementation**: Run your code and compare with the visualization
6. **Export Results**: Save visualizations as GIFs for sharing or reference

## 🎯 Educational Value

Algtrax provides a comprehensive learning experience by combining:
- **Visual Learning**: Step-by-step algorithm animations
- **Hands-on Practice**: Interactive code editor with multiple languages
- **Immediate Feedback**: Real-time visualization of code execution
- **Progressive Learning**: From simple sorting to complex graph algorithms

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for details on:
- Code style and standards
- Adding new algorithms
- Improving visualizations
- Bug reports and feature requests

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
