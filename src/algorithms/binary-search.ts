/**
 * Binary Search Algorithm Implementation
 * 
 * This file contains the binary search algorithm that generates visualization states
 * for the frontend visualizer. Each step of the algorithm creates a state object
 * that describes what the user should see at that moment in the animation.
 */

/**
 * Bar State Interface
 * 
 * Defines the structure for each visualization state in the binary search animation.
 * Each state represents a snapshot of the array at a specific point in the algorithm.
 */
export interface BarState {
  values: number[];      // Current array values
  comparing: number[];   // Indices of elements currently being compared
  searching: number[];   // Indices of elements in the current search range
  found: number[];       // Index of the found element (if found)
  target: number;        // The value being searched for
  left: number;          // Left boundary of current search range
  right: number;         // Right boundary of current search range
  mid: number;           // Middle index of current search range
}

/**
 * Binary Search Algorithm
 * 
 * Implements the binary search algorithm and generates visualization states
 * for each step of the process. This allows users to see exactly how
 * the algorithm works step by step.
 * 
 * The algorithm works by repeatedly dividing the search interval in half.
 * If the value of the search key is less than the item in the middle of
 * the interval, narrow the interval to the lower half. Otherwise, narrow
 * it to the upper half. Repeatedly check until the value is found or
 * the interval is empty.
 * 
 * @param arr - The sorted input array to search in
 * @param target - The value to search for
 * @returns Array of visualization states showing each step of the algorithm
 */
export function binarySearch(arr: number[], target: number): BarState[] {
  const states: BarState[] = [];
  const array = [...arr]; // Create a copy to avoid mutating the original
  let left = 0;
  let right = array.length - 1;

  // Add initial state - shows the sorted array and search range
  states.push({
    values: [...array],
    comparing: [],
    searching: Array.from({ length: array.length }, (_, i) => i),
    found: [],
    target,
    left,
    right,
    mid: -1
  });

  // Main binary search loop
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    // State: Show the current search range and middle element
    // This creates the visual effect of highlighting the search range
    const searchingIndices = Array.from({ length: right - left + 1 }, (_, i) => left + i);
    
    states.push({
      values: [...array],
      comparing: [mid],
      searching: searchingIndices,
      found: [],
      target,
      left,
      right,
      mid
    });

    // Check if the middle element is the target
    if (array[mid] === target) {
      // State: Show that the target was found
      // This creates the visual effect of highlighting the found element
      states.push({
        values: [...array],
        comparing: [],
        searching: [],
        found: [mid],
        target,
        left,
        right,
        mid
      });
      return states;
    }

    // If target is smaller than middle element, search left half
    if (array[mid] > target) {
      right = mid - 1;
      
      // State: Show narrowing to left half
      // This creates the visual effect of eliminating the right half
      const newSearchingIndices = Array.from({ length: right - left + 1 }, (_, i) => left + i);
      
      states.push({
        values: [...array],
        comparing: [],
        searching: newSearchingIndices,
        found: [],
        target,
        left,
        right,
        mid
      });
    } else {
      // If target is larger than middle element, search right half
      left = mid + 1;
      
      // State: Show narrowing to right half
      // This creates the visual effect of eliminating the left half
      const newSearchingIndices = Array.from({ length: right - left + 1 }, (_, i) => left + i);
      
      states.push({
        values: [...array],
        comparing: [],
        searching: newSearchingIndices,
        found: [],
        target,
        left,
        right,
        mid
      });
    }
  }

  // State: Show that the target was not found
  // This creates the visual effect of showing the search completed unsuccessfully
  states.push({
    values: [...array],
    comparing: [],
    searching: [],
    found: [],
    target,
    left: -1,
    right: -1,
    mid: -1
  });

  return states;
}
