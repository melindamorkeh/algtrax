/**
 * Bubble Sort Algorithm Implementation
 * 
 * This file contains the bubble sort algorithm that generates visualization states
 * for the frontend visualizer. Each step of the algorithm creates a state object
 * that describes what the user should see at that moment in the animation.
 */

/**
 * Bar State Interface
 * 
 * Defines the structure for each visualization state in the bubble sort animation.
 * Each state represents a snapshot of the array at a specific point in the algorithm.
 */
export interface BarState {
  values: number[];      // Current array values
  comparing: number[];   // Indices of elements currently being compared
  swapping: number[];    // Indices of elements currently being swapped
  sorted: number[];      // Indices of elements that are already sorted
}

/**
 * Bubble Sort Algorithm
 * 
 * Implements the bubble sort algorithm and generates visualization states
 * for each step of the process. This allows users to see exactly how
 * the algorithm works step by step.
 * 
 * The algorithm works by repeatedly stepping through the list, comparing
 * adjacent elements and swapping them if they are in the wrong order.
 * 
 * @param arr - The input array to sort
 * @returns Array of visualization states showing each step of the algorithm
 */
export function bubbleSort(arr: number[]): BarState[] {
  const states: BarState[] = [];
  const n = arr.length;
  const array = [...arr]; // Create a copy to avoid mutating the original

  // Add initial state - shows the unsorted array
  states.push({
    values: [...array],
    comparing: [],
    swapping: [],
    sorted: []
  });

  // Outer loop - controls the number of passes through the array
  for (let i = 0; i < n - 1; i++) {
    // Inner loop - compares adjacent elements
    for (let j = 0; j < n - i - 1; j++) {
      // State: Show which elements are being compared
      // This creates the visual effect of highlighting the current comparison
      states.push({
        values: [...array],
        comparing: [j, j + 1], // Highlight the two elements being compared
        swapping: [],
        sorted: Array.from({ length: i }, (_, index) => n - 1 - index) // Show already sorted elements
      });

      // If current element is greater than next element, swap them
      if (array[j] > array[j + 1]) {
        // State: Show the swapping animation
        // This creates the visual effect of elements being swapped
        states.push({
          values: [...array],
          comparing: [],
          swapping: [j, j + 1], // Highlight the elements being swapped
          sorted: Array.from({ length: i }, (_, index) => n - 1 - index)
        });

        // Perform the actual swap
        [array[j], array[j + 1]] = [array[j + 1], array[j]];

        // State: Show the result after the swap
        // This shows the array with the swapped elements in their new positions
        states.push({
          values: [...array],
          comparing: [],
          swapping: [],
          sorted: Array.from({ length: i }, (_, index) => n - 1 - index)
        });
      }
    }

    // After each pass, the largest element "bubbles up" to its correct position
    // State: Mark the last element as sorted
    // This shows that the largest element is now in its final position
    states.push({
      values: [...array],
      comparing: [],
      swapping: [],
      sorted: Array.from({ length: i + 1 }, (_, index) => n - 1 - index) // Include the newly sorted element
    });
  }

  return states;
} 