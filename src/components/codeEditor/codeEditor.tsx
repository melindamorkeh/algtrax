'use client';

import { useState, useRef, useEffect } from 'react';
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Code Editor Component
 * 
 * This component provides a full-featured code editor for algorithm implementation.
 * It includes:
 * - Monaco Editor integration for syntax highlighting and code completion
 * - Multiple language support (JavaScript, Python, Java)
 * - Algorithm-specific code templates and model solutions
 * - Code validation and feedback system
 * - Integration with the visualization system
 * 
 * The editor automatically loads appropriate starter templates and model code
 * based on the selected algorithm and programming language.
 */

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
    ssr: false,
});

interface CodeEditorProps {
    code: string;
    onChange: (value: string) => void;
    algorithmId?: string;
}

interface CodeFeedback {
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    details?: string;
}

// Model code for different algorithms and languages
const modelCode = {
    'bubble-sort': {
        javascript: `function bubbleSort(arr) {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // Swap elements
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    return arr;
}

// Example usage
const array = [64, 34, 25, 12, 22, 11, 90];
console.log(bubbleSort(array));`,

        python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                # Swap elements
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

# Example usage
array = [64, 34, 25, 12, 22, 11, 90]
print(bubble_sort(array))`,

        java: `public class BubbleSort {
    public static void bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    // Swap elements
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }
    
    public static void main(String[] args) {
        int[] array = {64, 34, 25, 12, 22, 11, 90};
        bubbleSort(array);
        for (int num : array) {
            System.out.print(num + " ");
        }
    }
}`
    },

    'insertion-sort': {
        javascript: `function insertionSort(arr) {
    for (let i = 1; i < arr.length; i++) {
        let key = arr[i];
        let j = i - 1;
        
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
    return arr;
}

// Example usage
const array = [64, 34, 25, 12, 22, 11, 90];
console.log(insertionSort(array));`,

        python: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    
    return arr

# Example usage
array = [64, 34, 25, 12, 22, 11, 90]
print(insertion_sort(array))`,

        java: `public class InsertionSort {
    public static void insertionSort(int[] arr) {
        for (int i = 1; i < arr.length; i++) {
            int key = arr[i];
            int j = i - 1;
            
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j--;
            }
            arr[j + 1] = key;
        }
    }
    
    public static void main(String[] args) {
        int[] array = {64, 34, 25, 12, 22, 11, 90};
        insertionSort(array);
        for (int num : array) {
            System.out.print(num + " ");
        }
    }
}`
    },

    'merge-sort': {
        javascript: `function mergeSort(arr) {
    if (arr.length <= 1) return arr;
    
    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));
    
    return merge(left, right);
}

function merge(left, right) {
    const result = [];
    let i = 0, j = 0;
    
    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
            result.push(left[i]);
            i++;
        } else {
            result.push(right[j]);
            j++;
        }
    }
    
    return result.concat(left.slice(i)).concat(right.slice(j));
}

// Example usage
const array = [64, 34, 25, 12, 22, 11, 90];
console.log(mergeSort(array));`,

        python: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    
    result.extend(left[i:])
    result.extend(right[j:])
    return result

# Example usage
array = [64, 34, 25, 12, 22, 11, 90]
print(merge_sort(array))`,

        java: `public class MergeSort {
    public static void mergeSort(int[] arr) {
        if (arr.length <= 1) return;
        
        int mid = arr.length / 2;
        int[] left = new int[mid];
        int[] right = new int[arr.length - mid];
        
        System.arraycopy(arr, 0, left, 0, mid);
        System.arraycopy(arr, mid, right, 0, arr.length - mid);
        
        mergeSort(left);
        mergeSort(right);
        merge(arr, left, right);
    }
    
    private static void merge(int[] arr, int[] left, int[] right) {
        int i = 0, j = 0, k = 0;
        
        while (i < left.length && j < right.length) {
            if (left[i] <= right[j]) {
                arr[k++] = left[i++];
            } else {
                arr[k++] = right[j++];
            }
        }
        
        while (i < left.length) {
            arr[k++] = left[i++];
        }
        
        while (j < right.length) {
            arr[k++] = right[j++];
        }
    }
    
    public static void main(String[] args) {
        int[] array = {64, 34, 25, 12, 22, 11, 90};
        mergeSort(array);
        for (int num : array) {
            System.out.print(num + " ");
        }
    }
}`
    },

    'quick-sort': {
        javascript: `function quickSort(arr) {
    if (arr.length <= 1) return arr;
    
    const pivot = arr[arr.length - 1];
    const left = [];
    const right = [];
    
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] <= pivot) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }
    
    return [...quickSort(left), pivot, ...quickSort(right)];
}

// Example usage
const array = [64, 34, 25, 12, 22, 11, 90];
console.log(quickSort(array));`,

        python: `def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    
    pivot = arr[-1]
    left = [x for x in arr[:-1] if x <= pivot]
    right = [x for x in arr[:-1] if x > pivot]
    
    return quick_sort(left) + [pivot] + quick_sort(right)

# Example usage
array = [64, 34, 25, 12, 22, 11, 90]
print(quick_sort(array))`,

        java: `public class QuickSort {
    public static void quickSort(int[] arr, int low, int high) {
        if (low < high) {
            int pi = partition(arr, low, high);
            quickSort(arr, low, pi - 1);
            quickSort(arr, pi + 1, high);
        }
    }
    
    private static int partition(int[] arr, int low, int high) {
        int pivot = arr[high];
        int i = low - 1;
        
        for (int j = low; j < high; j++) {
            if (arr[j] <= pivot) {
                i++;
                int temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }
        
        int temp = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp;
        
        return i + 1;
    }
    
    public static void main(String[] args) {
        int[] array = {64, 34, 25, 12, 22, 11, 90};
        quickSort(array, 0, array.length - 1);
        for (int num : array) {
            System.out.print(num + " ");
        }
    }
}`
    },

    'hash-table-search': {
        javascript: `class HashNode {
    constructor(key, value) {
        this.key = key;
        this.value = value;
        this.next = null;
    }
}

class HashTable {
    constructor(size = 10) {
        this.size = size;
        this.buckets = new Array(size).fill(null);
    }
    
    hash(key) {
        let hash = 0;
        for (let i = 0; i < key.length; i++) {
            hash = ((hash << 5) - hash + key.charCodeAt(i)) & 0xffffffff;
        }
        return Math.abs(hash) % this.size;
    }
    
    put(key, value) {
        const index = this.hash(key);
        const newNode = new HashNode(key, value);
        
        if (!this.buckets[index]) {
            this.buckets[index] = newNode;
        } else {
            let current = this.buckets[index];
            while (current.next) {
                current = current.next;
            }
            current.next = newNode;
        }
    }
    
    get(key) {
        const index = this.hash(key);
        let current = this.buckets[index];
        
        while (current) {
            if (current.key === key) {
                return current.value;
            }
            current = current.next;
        }
        return null;
    }
}

// Example usage
const ht = new HashTable();
ht.put("apple", 1);
ht.put("banana", 2);
ht.put("cherry", 3);
console.log(ht.get("cherry")); // Output: 3`,

        python: `class HashNode:
    def __init__(self, key, value):
        self.key = key
        self.value = value
        self.next = None

class HashTable:
    def __init__(self, size=10):
        self.size = size
        self.buckets = [None] * size
    
    def hash(self, key):
        hash_value = 0
        for char in key:
            hash_value = ((hash_value << 5) - hash_value + ord(char)) & 0xffffffff
        return abs(hash_value) % self.size
    
    def put(self, key, value):
        index = self.hash(key)
        new_node = HashNode(key, value)
        
        if not self.buckets[index]:
            self.buckets[index] = new_node
        else:
            current = self.buckets[index]
            while current.next:
                current = current.next
            current.next = new_node
    
    def get(self, key):
        index = self.hash(key)
        current = self.buckets[index]
        
        while current:
            if current.key == key:
                return current.value
            current = current.next
        return None

# Example usage
ht = HashTable()
ht.put("apple", 1)
ht.put("banana", 2)
ht.put("cherry", 3)
print(ht.get("cherry"))  # Output: 3`,

        java: `class HashNode {
    String key;
    int value;
    HashNode next;
    
    HashNode(String key, int value) {
        this.key = key;
        this.value = value;
        this.next = null;
    }
}

class HashTable {
    private HashNode[] buckets;
    private int size;
    
    public HashTable(int size) {
        this.size = size;
        this.buckets = new HashNode[size];
    }
    
    private int hash(String key) {
        int hash = 0;
        for (int i = 0; i < key.length(); i++) {
            hash = ((hash << 5) - hash + key.charAt(i)) & 0xffffffff;
        }
        return Math.abs(hash) % size;
    }
    
    public void put(String key, int value) {
        int index = hash(key);
        HashNode newNode = new HashNode(key, value);
        
        if (buckets[index] == null) {
            buckets[index] = newNode;
        } else {
            HashNode current = buckets[index];
            while (current.next != null) {
                current = current.next;
            }
            current.next = newNode;
        }
    }
    
    public Integer get(String key) {
        int index = hash(key);
        HashNode current = buckets[index];
        
        while (current != null) {
            if (current.key.equals(key)) {
                return current.value;
            }
            current = current.next;
        }
        return null;
    }
    
    public static void main(String[] args) {
        HashTable ht = new HashTable(10);
        ht.put("apple", 1);
        ht.put("banana", 2);
        ht.put("cherry", 3);
        System.out.println(ht.get("cherry")); // Output: 3
    }
}`
    },

    'depth-first-search': {
        javascript: `class Graph {
    constructor() {
        this.adjacencyList = {};
    }
    
    addVertex(vertex) {
        if (!this.adjacencyList[vertex]) {
            this.adjacencyList[vertex] = [];
        }
    }
    
    addEdge(vertex1, vertex2) {
        this.adjacencyList[vertex1].push(vertex2);
        this.adjacencyList[vertex2].push(vertex1);
    }
    
    depthFirstSearch(start) {
        const result = [];
        const visited = {};
        const adjacencyList = this.adjacencyList;
        
        function dfs(vertex) {
            if (!vertex) return null;
            visited[vertex] = true;
            result.push(vertex);
            
            adjacencyList[vertex].forEach(neighbor => {
                if (!visited[neighbor]) {
                    return dfs(neighbor);
                }
            });
        }
        
        dfs(start);
        return result;
    }
}

// Example usage
const g = new Graph();
g.addVertex("A");
g.addVertex("B");
g.addVertex("C");
g.addVertex("D");
g.addEdge("A", "B");
g.addEdge("A", "C");
g.addEdge("B", "D");
g.addEdge("C", "D");
console.log(g.depthFirstSearch("A")); // Output: ["A", "B", "D", "C"]`,

        python: `class Graph:
    def __init__(self):
        self.adjacency_list = {}
    
    def add_vertex(self, vertex):
        if vertex not in self.adjacency_list:
            self.adjacency_list[vertex] = []
    
    def add_edge(self, vertex1, vertex2):
        self.adjacency_list[vertex1].append(vertex2)
        self.adjacency_list[vertex2].append(vertex1)
    
    def depth_first_search(self, start):
        result = []
        visited = set()
        
        def dfs(vertex):
            if not vertex:
                return None
            visited.add(vertex)
            result.append(vertex)
            
            for neighbor in self.adjacency_list[vertex]:
                if neighbor not in visited:
                    dfs(neighbor)
        
        dfs(start)
        return result

# Example usage
g = Graph()
g.add_vertex("A")
g.add_vertex("B")
g.add_vertex("C")
g.add_vertex("D")
g.add_edge("A", "B")
g.add_edge("A", "C")
g.add_edge("B", "D")
g.add_edge("C", "D")
print(g.depth_first_search("A"))  # Output: ["A", "B", "D", "C"]`,

        java: `import java.util.*;

class Graph {
    private Map<String, List<String>> adjacencyList;
    
    public Graph() {
        this.adjacencyList = new HashMap<>();
    }
    
    public void addVertex(String vertex) {
        if (!adjacencyList.containsKey(vertex)) {
            adjacencyList.put(vertex, new ArrayList<>());
        }
    }
    
    public void addEdge(String vertex1, String vertex2) {
        adjacencyList.get(vertex1).add(vertex2);
        adjacencyList.get(vertex2).add(vertex1);
    }
    
    public List<String> depthFirstSearch(String start) {
        List<String> result = new ArrayList<>();
        Set<String> visited = new HashSet<>();
        
        dfs(start, visited, result);
        return result;
    }
    
    private void dfs(String vertex, Set<String> visited, List<String> result) {
        if (vertex == null) return;
        
        visited.add(vertex);
        result.add(vertex);
        
        for (String neighbor : adjacencyList.get(vertex)) {
            if (!visited.contains(neighbor)) {
                dfs(neighbor, visited, result);
            }
        }
    }
    
    public static void main(String[] args) {
        Graph g = new Graph();
        g.addVertex("A");
        g.addVertex("B");
        g.addVertex("C");
        g.addVertex("D");
        g.addEdge("A", "B");
        g.addEdge("A", "C");
        g.addEdge("B", "D");
        g.addEdge("C", "D");
        System.out.println(g.depthFirstSearch("A")); // Output: [A, B, D, C]
    }
}`
    },

    'binary-search': {
        javascript: `function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (arr[mid] === target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return -1; // Target not found
}

// Example usage
const array = [1, 3, 5, 7, 9, 11, 13, 15];
console.log(binarySearch(array, 7)); // Output: 3`,

        python: `def binary_search(arr, target):
    left = 0
    right = len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1  # Target not found

# Example usage
array = [1, 3, 5, 7, 9, 11, 13, 15]
print(binary_search(array, 7))  # Output: 3`,

        java: `public class BinarySearch {
    public static int binarySearch(int[] arr, int target) {
        int left = 0;
        int right = arr.length - 1;
        
        while (left <= right) {
            int mid = (left + right) / 2;
            
            if (arr[mid] == target) {
                return mid;
            } else if (arr[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        
        return -1; // Target not found
    }
    
    public static void main(String[] args) {
        int[] array = {1, 3, 5, 7, 9, 11, 13, 15};
        System.out.println(binarySearch(array, 7)); // Output: 3
    }
}`
    },

    'linear-search': {
        javascript: `function linearSearch(arr, target) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === target) {
            return i;
        }
    }
    return -1; // Target not found
}

// Example usage
const array = [64, 34, 25, 12, 22, 11, 90];
console.log(linearSearch(array, 25)); // Output: 2`,

        python: `def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1  # Target not found

# Example usage
array = [64, 34, 25, 12, 22, 11, 90]
print(linear_search(array, 25))  # Output: 2`,

        java: `public class LinearSearch {
    public static int linearSearch(int[] arr, int target) {
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] == target) {
                return i;
            }
        }
        return -1; // Target not found
    }
    
    public static void main(String[] args) {
        int[] array = {64, 34, 25, 12, 22, 11, 90};
        System.out.println(linearSearch(array, 25)); // Output: 2
    }
}`
    }
};

// Starter templates for different algorithms and languages
const starterTemplates = {
    'bubble-sort': {
        javascript: `function bubbleSort(arr) {
    // TODO: Implement bubble sort algorithm
    // Hint: Use nested loops to compare adjacent elements
    
}`,

        python: `def bubble_sort(arr):
    # TODO: Implement bubble sort algorithm
    # Hint: Use nested loops to compare adjacent elements
    
    pass`,

        java: `public class BubbleSort {
    public static void bubbleSort(int[] arr) {
        // TODO: Implement bubble sort algorithm
        // Hint: Use nested loops to compare adjacent elements
        
    }
    
    public static void main(String[] args) {
        int[] array = {64, 34, 25, 12, 22, 11, 90};
        bubbleSort(array);
        for (int num : array) {
            System.out.print(num + " ");
        }
    }
}`
    },

    'insertion-sort': {
        javascript: `function insertionSort(arr) {
    // TODO: Implement insertion sort algorithm
    // Hint: Use a key element and shift elements to make space
    
}`,

        python: `def insertion_sort(arr):
    # TODO: Implement insertion sort algorithm
    // Hint: Use a key element and shift elements to make space
    
    pass`,

        java: `public class InsertionSort {
    public static void insertionSort(int[] arr) {
        // TODO: Implement insertion sort algorithm
        // Hint: Use a key element and shift elements to make space
        
    }
    
    public static void main(String[] args) {
        int[] array = {64, 34, 25, 12, 22, 11, 90};
        insertionSort(array);
        for (int num : array) {
            System.out.print(num + " ");
        }
    }
}`
    },

    'merge-sort': {
        javascript: `function mergeSort(arr) {
    // TODO: Implement merge sort algorithm
    // Hint: Divide array into halves, sort recursively, then merge
    
}

function merge(left, right) {
    // TODO: Implement merge function to combine sorted arrays
    
}`,

        python: `def merge_sort(arr):
    # TODO: Implement merge sort algorithm
    # Hint: Divide array into halves, sort recursively, then merge
    
    pass

def merge(left, right):
    # TODO: Implement merge function to combine sorted arrays
    
    pass`,

        java: `public class MergeSort {
    public static void mergeSort(int[] arr) {
        // TODO: Implement merge sort algorithm
        // Hint: Divide array into halves, sort recursively, then merge
        
    }
    
    private static void merge(int[] arr, int[] left, int[] right) {
        // TODO: Implement merge function to combine sorted arrays
        
    }
    
    public static void main(String[] args) {
        int[] array = {64, 34, 25, 12, 22, 11, 90};
        mergeSort(array);
        for (int num : array) {
            System.out.print(num + " ");
        }
    }
}`
    },

    'quick-sort': {
        javascript: `function quickSort(arr) {
    // TODO: Implement quick sort algorithm
    // Hint: Choose a pivot, partition around it, then sort recursively
    
}

function partition(arr, low, high) {
    // TODO: Implement partition function to place pivot in correct position
    
}`,

        python: `def quick_sort(arr):
    # TODO: Implement quick sort algorithm
    # Hint: Choose a pivot, partition around it, then sort recursively
    
    pass

def partition(arr, low, high):
    # TODO: Implement partition function to place pivot in correct position
    
    pass`,

        java: `public class QuickSort {
    public static void quickSort(int[] arr, int low, int high) {
        // TODO: Implement quick sort algorithm
        // Hint: Choose a pivot, partition around it, then sort recursively
        
    }
    
    private static int partition(int[] arr, int low, int high) {
        // TODO: Implement partition function to place pivot in correct position
        
        return 0;
    }
    
    public static void main(String[] args) {
        int[] array = {64, 34, 25, 12, 22, 11, 90};
        quickSort(array, 0, array.length - 1);
        for (int num : array) {
            System.out.print(num + " ");
        }
    }
}`
    },

    'hash-table-search': {
        javascript: `class HashNode {
    constructor(key, value) {
        this.key = key;
        this.value = value;
        this.next = null;
    }
}

class HashTable {
    constructor(size = 10) {
        this.size = size;
        this.buckets = new Array(size).fill(null);
    }
    
    hash(key) {
        // TODO: Implement hash function
        // Hint: Convert string to hash value using character codes
        
    }
    
    put(key, value) {
        // TODO: Implement put method
        // Hint: Hash the key, handle collisions with linked lists
        
    }
    
    get(key) {
        // TODO: Implement get method
        // Hint: Hash the key, search through linked list if needed
        
    }
}`,

        python: `class HashNode:
    def __init__(self, key, value):
        self.key = key
        self.value = value
        self.next = None

class HashTable:
    def __init__(self, size=10):
        self.size = size
        self.buckets = [None] * size
    
    def hash(self, key):
        # TODO: Implement hash function
        # Hint: Convert string to hash value using character codes
        
        pass
    
    def put(self, key, value):
        # TODO: Implement put method
        # Hint: Hash the key, handle collisions with linked lists
        
        pass
    
    def get(self, key):
        # TODO: Implement get method
        # Hint: Hash the key, search through linked list if needed
        
        pass`,

        java: `class HashNode {
    String key;
    int value;
    HashNode next;
    
    HashNode(String key, int value) {
        this.key = key;
        this.value = value;
        this.next = null;
    }
}

class HashTable {
    private HashNode[] buckets;
    private int size;
    
    public HashTable(int size) {
        this.size = size;
        this.buckets = new HashNode[size];
    }
    
    private int hash(String key) {
        // TODO: Implement hash function
        // Hint: Convert string to hash value using character codes
        
        return 0;
    }
    
    public void put(String key, int value) {
        // TODO: Implement put method
        // Hint: Hash the key, handle collisions with linked lists
        
    }
    
    public Integer get(String key) {
        // TODO: Implement get method
        // Hint: Hash the key, search through linked list if needed
        
        return null;
    }
}`
    },

    'binary-search': {
        javascript: `function binarySearch(arr, target) {
    // TODO: Implement binary search algorithm
    // Hint: Use left and right pointers, calculate middle
    
}`,

        python: `def binary_search(arr, target):
    # TODO: Implement binary search algorithm
    # Hint: Use left and right pointers, calculate middle
    
    pass`,

        java: `public class BinarySearch {
    public static int binarySearch(int[] arr, int target) {
        // TODO: Implement binary search algorithm
        // Hint: Use left and right pointers, calculate middle
        
        return -1;
    }
    
    public static void main(String[] args) {
        int[] array = {1, 3, 5, 7, 9, 11, 13, 15};
        System.out.println(binarySearch(array, 7)); // Should return 3
    }
}`
    },



    'linear-search': {
        javascript: `function linearSearch(arr, target) {
    // TODO: Implement linear search algorithm
    // Hint: Iterate through array and compare each element
    
}`,

        python: `def linear_search(arr, target):
    # TODO: Implement linear search algorithm
    // Hint: Iterate through array and compare each element
    
    pass`,

        java: `public class LinearSearch {
    public static int linearSearch(int[] arr, int target) {
        // TODO: Implement linear search algorithm
        // Hint: Iterate through array and compare each element
        
        return -1;
    }
    
    public static void main(String[] args) {
        int[] array = {64, 34, 25, 12, 22, 11, 90};
        System.out.println(linearSearch(array, 25)); // Should return 2
    }
}`
    },

    'depth-first-search': {
        javascript: `class Graph {
    constructor() {
        this.adjacencyList = {};
    }
    
    addVertex(vertex) {
        // TODO: Add vertex to adjacency list
        // Hint: Create empty array for new vertex
        
    }
    
    addEdge(vertex1, vertex2) {
        // TODO: Add edge between vertices
        // Hint: Add each vertex to the other's adjacency list
        
    }
    
    depthFirstSearch(start) {
        // TODO: Implement depth-first search
        // Hint: Use recursion or stack, track visited nodes
        
    }
}`,

        python: `class Graph:
    def __init__(self):
        self.adjacency_list = {}
    
    def add_vertex(self, vertex):
        # TODO: Add vertex to adjacency list
        # Hint: Create empty list for new vertex
        
        pass
    
    def add_edge(self, vertex1, vertex2):
        # TODO: Add edge between vertices
        # Hint: Add each vertex to the other's adjacency list
        
        pass
    
    def depth_first_search(self, start):
        # TODO: Implement depth-first search
        # Hint: Use recursion, track visited nodes
        
        pass`,

        java: `import java.util.*;

class Graph {
    private Map<String, List<String>> adjacencyList;
    
    public Graph() {
        this.adjacencyList = new HashMap<>();
    }
    
    public void addVertex(String vertex) {
        // TODO: Add vertex to adjacency list
        // Hint: Create empty list for new vertex
        
    }
    
    public void addEdge(String vertex1, String vertex2) {
        // TODO: Add edge between vertices
        // Hint: Add each vertex to the other's adjacency list
        
    }
    
    public List<String> depthFirstSearch(String start) {
        // TODO: Implement depth-first search
        // Hint: Use recursion, track visited nodes
        
        return new ArrayList<>();
    }
}`
    }
};

const supportedLanguages = [
    { id: 'javascript', name: 'JavaScript', extension: 'js' },
    { id: 'python', name: 'Python', extension: 'py' },
    { id: 'java', name: 'Java', extension: 'java' }
];

export function CodeEditor({ code, onChange, algorithmId }: CodeEditorProps) {
    const [selectedLanguage, setSelectedLanguage] = useState('javascript');
    const [feedback, setFeedback] = useState<CodeFeedback | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showModelCode, setShowModelCode] = useState(false);
    const [hasInitialized, setHasInitialized] = useState(false);
    const editorRef = useRef<any>(null);

    // Load starter template when component mounts or algorithm/language changes
    useEffect(() => {
        if (algorithmId) {
            const starterTemplate = starterTemplates[algorithmId as keyof typeof starterTemplates]?.[selectedLanguage as keyof typeof starterTemplates[keyof typeof starterTemplates]];
            if (starterTemplate && (!code || code.trim() === '')) {
                onChange(starterTemplate);
                setHasInitialized(true);
            }
        }
    }, [algorithmId, selectedLanguage, code, onChange, hasInitialized]);

    const handleLanguageChange = (language: string) => {
        setSelectedLanguage(language);
        // Reset feedback when language changes
        setFeedback(null);
        setShowModelCode(false);
        
        // Load starter template for new language
        if (algorithmId) {
            const starterTemplate = starterTemplates[algorithmId as keyof typeof starterTemplates]?.[language as keyof typeof starterTemplates[keyof typeof starterTemplates]];
            if (starterTemplate) {
                onChange(starterTemplate);
            }
        }
    };

    const getModelCode = () => {
        if (!algorithmId || !modelCode[algorithmId as keyof typeof modelCode]) {
            return null;
        }
        return modelCode[algorithmId as keyof typeof modelCode][selectedLanguage as keyof typeof modelCode[keyof typeof modelCode]];
    };

    const handleViewModelCode = () => {
        const model = getModelCode();
        if (model) {
            onChange(model);
            setShowModelCode(true);
            setFeedback({
                type: 'info',
                message: 'Model code loaded',
                details: 'This is the reference implementation. You can modify it or write your own version.'
            });
        } else {
            setFeedback({
                type: 'warning',
                message: 'No model code available',
                details: 'Model code is not available for this algorithm and language combination.'
            });
        }
    };

    const handleLoadStarterTemplate = () => {
        if (algorithmId) {
            const starterTemplate = starterTemplates[algorithmId as keyof typeof starterTemplates]?.[selectedLanguage as keyof typeof starterTemplates[keyof typeof starterTemplates]];
            if (starterTemplate) {
                onChange(starterTemplate);
                setShowModelCode(false);
                setFeedback({
                    type: 'info',
                    message: 'Starter template loaded',
                    details: 'This provides a basic structure to help you get started. Fill in the TODO comments!'
                });
            }
        }
    };

    const validateSyntax = (code: string, language: string): CodeFeedback | null => {
        // Basic syntax validation
        if (!code.trim()) {
            return {
                type: 'error',
                message: 'Code cannot be empty',
                details: 'Please write some code before submitting.'
            };
        }

        // Language-specific validation
        switch (language) {
            case 'javascript':
                if (!code.includes('function') && !code.includes('const') && !code.includes('let') && !code.includes('var')) {
                    return {
                        type: 'warning',
                        message: 'Consider adding a function declaration',
                        details: 'Most algorithms are implemented as functions in JavaScript.'
                    };
                }
                break;
            case 'python':
                if (!code.includes('def ') && !code.includes('class ')) {
                    return {
                        type: 'warning',
                        message: 'Consider adding a function definition',
                        details: 'Most algorithms are implemented as functions in Python.'
                    };
                }
                break;
            case 'java':
                if (!code.includes('public class') && !code.includes('public static')) {
                    return {
                        type: 'warning',
                        message: 'Consider adding a class or method declaration',
                        details: 'Java code typically requires class and method declarations.'
                    };
                }
                break;
        }

        return null;
    };

    const compareWithModel = (userCode: string, language: string): CodeFeedback => {
        if (!algorithmId || !modelCode[algorithmId as keyof typeof modelCode]) {
            return {
                type: 'info',
                message: 'No model code available for comparison',
                details: 'This algorithm does not have a reference implementation yet.'
            };
        }

        const model = modelCode[algorithmId as keyof typeof modelCode][language as keyof typeof modelCode[keyof typeof modelCode]];
        
        if (!model) {
            return {
                type: 'info',
                message: 'No model code available for this language',
                details: 'Try switching to a different language or check back later.'
            };
        }

        // Simple comparison - check for key algorithm concepts
        const userCodeLower = userCode.toLowerCase();
        const modelLower = model.toLowerCase();
        
        let score = 0;
        let suggestions: string[] = [];

        // Check for basic algorithm structure
        if (algorithmId === 'bubble-sort') {
            if (userCodeLower.includes('for') && userCodeLower.includes('if')) {
                score += 30;
            } else {
                suggestions.push('Consider using nested loops for bubble sort');
            }
            
            if (userCodeLower.includes('swap') || userCodeLower.includes('temp')) {
                score += 20;
            } else {
                suggestions.push('Include swapping logic for adjacent elements');
            }
        } else if (algorithmId === 'insertion-sort') {
            if (userCodeLower.includes('for') && userCodeLower.includes('while')) {
                score += 30;
            } else {
                suggestions.push('Consider using nested loops for insertion sort');
            }
            
            if (userCodeLower.includes('key') || userCodeLower.includes('temp')) {
                score += 20;
            } else {
                suggestions.push('Include key element tracking for insertion sort');
            }
        } else if (algorithmId === 'merge-sort') {
            if (userCodeLower.includes('function') || userCodeLower.includes('def') || userCodeLower.includes('public')) {
                score += 20;
            } else {
                suggestions.push('Consider using function declarations for merge sort');
            }
            
            if (userCodeLower.includes('mid') || userCodeLower.includes('middle')) {
                score += 20;
            } else {
                suggestions.push('Include middle element calculation for divide step');
            }
            
            if (userCodeLower.includes('merge') || userCodeLower.includes('combine')) {
                score += 20;
            } else {
                suggestions.push('Include merge/combine logic for sorted subarrays');
            }
        } else if (algorithmId === 'binary-search') {
            if (userCodeLower.includes('while') || userCodeLower.includes('for')) {
                score += 30;
            } else {
                suggestions.push('Consider using a loop for binary search');
            }
            
            if (userCodeLower.includes('mid') || userCodeLower.includes('middle')) {
                score += 20;
            } else {
                suggestions.push('Include middle element calculation');
            }
        } else if (algorithmId === 'linear-search') {
            if (userCodeLower.includes('for') || userCodeLower.includes('while')) {
                score += 30;
            } else {
                suggestions.push('Consider using a loop for linear search');
            }
            
            if (userCodeLower.includes('if') || userCodeLower.includes('==') || userCodeLower.includes('===')) {
                score += 20;
            } else {
                suggestions.push('Include comparison logic to find target element');
            }
        }

        if (score >= 50) {
            return {
                type: 'success',
                message: 'Great job! Your code shows good understanding of the algorithm.',
                details: suggestions.length > 0 ? `Suggestions: ${suggestions.join(', ')}` : undefined
            };
        } else if (score >= 30) {
            return {
                type: 'warning',
                message: 'Good start! Consider improving your implementation.',
                details: `Suggestions: ${suggestions.join(', ')}`
            };
        } else {
            return {
                type: 'error',
                message: 'Your implementation needs improvement.',
                details: `Suggestions: ${suggestions.join(', ')}`
            };
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setFeedback(null);

        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Syntax validation
        const syntaxFeedback = validateSyntax(code, selectedLanguage);
        if (syntaxFeedback) {
            setFeedback(syntaxFeedback);
            setIsSubmitting(false);
            return;
        }

        // Compare with model code
        const comparisonFeedback = compareWithModel(code, selectedLanguage);
        setFeedback(comparisonFeedback);
        setIsSubmitting(false);
    };

    const handleEditorDidMount = (editor: any) => {
        editorRef.current = editor;
    };

    return (
        <div className="h-full flex flex-col">
            {/* Language Selector */}
            <div className="flex items-center justify-between mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-4">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Language:
                    </label>
                    <select
                        value={selectedLanguage}
                        onChange={(e) => handleLanguageChange(e.target.value)}
                        className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {supportedLanguages.map(lang => (
                            <option key={lang.id} value={lang.id}>
                                {lang.name}
                            </option>
                        ))}
                    </select>
                </div>
                
                <div className="flex items-center space-x-3">
                    <button
                        onClick={handleViewModelCode}
                        className="px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm"
                    >
                        View Model Code
                    </button>
                    <button
                        onClick={handleLoadStarterTemplate}
                        className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                    >
                        Load Starter Template
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isSubmitting ? 'Analyzing...' : 'Submit Code'}
                    </button>
                </div>
            </div>

            {/* Code Editor */}
            <div className="flex-1 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                <MonacoEditor
                    height="100%"
                    language={selectedLanguage}
                    value={code}
                    onChange={(value) => onChange(value || '')}
                    theme="vs-dark"
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: 'on',
                        roundedSelection: false,
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                    }}
                    onMount={handleEditorDidMount}
                />
            </div>

            {/* Feedback Section */}
            <AnimatePresence>
                {feedback && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`mt-4 p-4 rounded-lg border ${
                            feedback.type === 'success' 
                                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                                : feedback.type === 'error'
                                ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                                : feedback.type === 'warning'
                                ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                                : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                        }`}
                    >
                        <div className="flex items-start">
                            <div className={`w-2 h-2 rounded-full mt-2 mr-3 ${
                                feedback.type === 'success' ? 'bg-green-500' :
                                feedback.type === 'error' ? 'bg-red-500' :
                                feedback.type === 'warning' ? 'bg-yellow-500' :
                                'bg-blue-500'
                            }`} />
                            <div className="flex-1">
                                <h4 className={`font-medium ${
                                    feedback.type === 'success' ? 'text-green-800 dark:text-green-200' :
                                    feedback.type === 'error' ? 'text-red-800 dark:text-red-200' :
                                    feedback.type === 'warning' ? 'text-yellow-800 dark:text-yellow-200' :
                                    'text-blue-800 dark:text-blue-200'
                                }`}>
                                    {feedback.message}
                                </h4>
                                {feedback.details && (
                                    <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">
                                        {feedback.details}
                                    </p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}