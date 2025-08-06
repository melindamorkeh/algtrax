export interface BarState {
  values: number[];
  comparing: number[];
  swapping: number[];
  sorted: number[];
  left: number[];
  right: number[];
  merging: boolean;
}

export function mergeSort(arr: number[]): BarState[] {
  const states: BarState[] = [];
  const array = [...arr];
  const n = array.length;

  // Add initial state
  states.push({
    values: [...array],
    comparing: [],
    swapping: [],
    sorted: [],
    left: [],
    right: [],
    merging: false
  });

  // Helper function to merge two sorted subarrays
  function merge(left: number[], right: number[], startIndex: number): number[] {
    const result: number[] = [];
    let i = 0, j = 0;
    let leftStart = startIndex;
    let rightStart = startIndex + left.length;

    // Add state showing the two subarrays to be merged
    const currentArray = [...array];
    states.push({
      values: currentArray,
      comparing: [],
      swapping: [],
      sorted: [],
      left: Array.from({ length: left.length }, (_, idx) => leftStart + idx),
      right: Array.from({ length: right.length }, (_, idx) => rightStart + idx),
      merging: true
    });

    while (i < left.length && j < right.length) {
      // Add comparing state
      states.push({
        values: currentArray,
        comparing: [leftStart + i, rightStart + j],
        swapping: [],
        sorted: Array.from({ length: startIndex }, (_, idx) => idx),
        left: Array.from({ length: left.length }, (_, idx) => leftStart + idx),
        right: Array.from({ length: right.length }, (_, idx) => rightStart + idx),
        merging: true
      });

      if (left[i] <= right[j]) {
        result.push(left[i]);
        i++;
      } else {
        result.push(right[j]);
        j++;
      }

      // Update the array with merged result so far
      for (let k = 0; k < result.length; k++) {
        currentArray[startIndex + k] = result[k];
      }

      // Add state after merge step
      states.push({
        values: [...currentArray],
        comparing: [],
        swapping: [],
        sorted: Array.from({ length: startIndex + result.length }, (_, idx) => idx),
        left: Array.from({ length: left.length }, (_, idx) => leftStart + idx),
        right: Array.from({ length: right.length }, (_, idx) => rightStart + idx),
        merging: true
      });
    }

    // Add remaining elements from left subarray
    while (i < left.length) {
      result.push(left[i]);
      i++;
      
      // Update array
      for (let k = 0; k < result.length; k++) {
        currentArray[startIndex + k] = result[k];
      }

      states.push({
        values: [...currentArray],
        comparing: [],
        swapping: [],
        sorted: Array.from({ length: startIndex + result.length }, (_, idx) => idx),
        left: Array.from({ length: left.length }, (_, idx) => leftStart + idx),
        right: Array.from({ length: right.length }, (_, idx) => rightStart + idx),
        merging: true
      });
    }

    // Add remaining elements from right subarray
    while (j < right.length) {
      result.push(right[j]);
      j++;
      
      // Update array
      for (let k = 0; k < result.length; k++) {
        currentArray[startIndex + k] = result[k];
      }

      states.push({
        values: [...currentArray],
        comparing: [],
        swapping: [],
        sorted: Array.from({ length: startIndex + result.length }, (_, idx) => idx),
        left: Array.from({ length: left.length }, (_, idx) => leftStart + idx),
        right: Array.from({ length: right.length }, (_, idx) => rightStart + idx),
        merging: true
      });
    }

    return result;
  }

  // Recursive merge sort function
  function mergeSortHelper(start: number, end: number): number[] {
    if (end - start <= 1) {
      return array.slice(start, end);
    }

    const mid = Math.floor((start + end) / 2);
    
    // Add state showing division
    states.push({
      values: [...array],
      comparing: [],
      swapping: [],
      sorted: [],
      left: Array.from({ length: mid - start }, (_, idx) => start + idx),
      right: Array.from({ length: end - mid }, (_, idx) => mid + idx),
      merging: false
    });

    // Recursively sort left and right halves
    const left = mergeSortHelper(start, mid);
    const right = mergeSortHelper(mid, end);

    // Merge the sorted halves
    const merged = merge(left, right, start);
    
    // Update the original array with merged result
    for (let i = 0; i < merged.length; i++) {
      array[start + i] = merged[i];
    }

    // Add final state for this merge
    states.push({
      values: [...array],
      comparing: [],
      swapping: [],
      sorted: Array.from({ length: end }, (_, idx) => idx),
      left: [],
      right: [],
      merging: false
    });

    return merged;
  }

  // Start the merge sort
  mergeSortHelper(0, n);

  return states;
} 