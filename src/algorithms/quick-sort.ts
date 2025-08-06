export interface BarState {
  values: number[];
  comparing: number[];
  swapping: number[];
  sorted: number[];
  pivot: number[];
  partition: number[];
  left: number[];
  right: number[];
}

export function quickSort(arr: number[]): BarState[] {
  const states: BarState[] = [];
  const array = [...arr];
  const n = array.length;

  // Add initial state
  states.push({
    values: [...array],
    comparing: [],
    swapping: [],
    sorted: [],
    pivot: [],
    partition: [],
    left: [],
    right: []
  });

  // Helper function to partition the array
  function partition(low: number, high: number): number {
    const pivot = array[high];
    let i = low - 1;

    // Add state showing pivot selection
    states.push({
      values: [...array],
      comparing: [],
      swapping: [],
      sorted: [],
      pivot: [high],
      partition: Array.from({ length: high - low + 1 }, (_, idx) => low + idx),
      left: [],
      right: []
    });

    for (let j = low; j < high; j++) {
      // Add comparing state
      states.push({
        values: [...array],
        comparing: [j, high],
        swapping: [],
        sorted: [],
        pivot: [high],
        partition: Array.from({ length: high - low + 1 }, (_, idx) => low + idx),
        left: [],
        right: []
      });

      if (array[j] <= pivot) {
        i++;
        
        if (i !== j) {
          // Add swapping state
          states.push({
            values: [...array],
            comparing: [],
            swapping: [i, j],
            sorted: [],
            pivot: [high],
            partition: Array.from({ length: high - low + 1 }, (_, idx) => low + idx),
            left: [],
            right: []
          });

          // Swap elements
          [array[i], array[j]] = [array[j], array[i]];

          // Add state after swap
          states.push({
            values: [...array],
            comparing: [],
            swapping: [],
            sorted: [],
            pivot: [high],
            partition: Array.from({ length: high - low + 1 }, (_, idx) => low + idx),
            left: [],
            right: []
          });
        }
      }
    }

    // Place pivot in correct position
    if (i + 1 !== high) {
      states.push({
        values: [...array],
        comparing: [],
        swapping: [i + 1, high],
        sorted: [],
        pivot: [high],
        partition: Array.from({ length: high - low + 1 }, (_, idx) => low + idx),
        left: [],
        right: []
      });

      [array[i + 1], array[high]] = [array[high], array[i + 1]];

      states.push({
        values: [...array],
        comparing: [],
        swapping: [],
        sorted: [i + 1],
        pivot: [],
        partition: [],
        left: [],
        right: []
      });
    } else {
      states.push({
        values: [...array],
        comparing: [],
        swapping: [],
        sorted: [i + 1],
        pivot: [],
        partition: [],
        left: [],
        right: []
      });
    }

    return i + 1;
  }

  // Recursive quick sort function
  function quickSortHelper(low: number, high: number) {
    if (low < high) {
      // Add state showing current subarray
      states.push({
        values: [...array],
        comparing: [],
        swapping: [],
        sorted: [],
        pivot: [],
        partition: [],
        left: Array.from({ length: low }, (_, idx) => idx),
        right: Array.from({ length: n - high - 1 }, (_, idx) => high + 1 + idx)
      });

      const pi = partition(low, high);

      // Add state showing partition result
      states.push({
        values: [...array],
        comparing: [],
        swapping: [],
        sorted: [pi],
        pivot: [],
        partition: [],
        left: Array.from({ length: pi }, (_, idx) => idx),
        right: Array.from({ length: n - pi - 1 }, (_, idx) => pi + 1 + idx)
      });

      // Recursively sort left and right subarrays
      quickSortHelper(low, pi - 1);
      quickSortHelper(pi + 1, high);
    } else if (low === high) {
      // Single element is already sorted
      states.push({
        values: [...array],
        comparing: [],
        swapping: [],
        sorted: [low],
        pivot: [],
        partition: [],
        left: Array.from({ length: low }, (_, idx) => idx),
        right: Array.from({ length: n - high - 1 }, (_, idx) => high + 1 + idx)
      });
    }
  }

  // Start the quick sort
  quickSortHelper(0, n - 1);

  // Add final sorted state
  states.push({
    values: [...array],
    comparing: [],
    swapping: [],
    sorted: Array.from({ length: n }, (_, idx) => idx),
    pivot: [],
    partition: [],
    left: [],
    right: []
  });

  return states;
} 