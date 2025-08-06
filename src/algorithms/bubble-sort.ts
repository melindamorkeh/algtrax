export interface BarState {
  values: number[];
  comparing: number[];
  swapping: number[];
  sorted: number[];
}

export function bubbleSort(arr: number[]): BarState[] {
  const states: BarState[] = [];
  const n = arr.length;
  const array = [...arr];

  // Add initial state
  states.push({
    values: [...array],
    comparing: [],
    swapping: [],
    sorted: []
  });

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Add comparing state
      states.push({
        values: [...array],
        comparing: [j, j + 1],
        swapping: [],
        sorted: Array.from({ length: i }, (_, index) => n - 1 - index)
      });

      if (array[j] > array[j + 1]) {
        // Add swapping state
        states.push({
          values: [...array],
          comparing: [],
          swapping: [j, j + 1],
          sorted: Array.from({ length: i }, (_, index) => n - 1 - index)
        });

        // Swap elements
        [array[j], array[j + 1]] = [array[j + 1], array[j]];

        // Add state after swap
        states.push({
          values: [...array],
          comparing: [],
          swapping: [],
          sorted: Array.from({ length: i }, (_, index) => n - 1 - index)
        });
      }
    }

    // Mark the last element as sorted
    states.push({
      values: [...array],
      comparing: [],
      swapping: [],
      sorted: Array.from({ length: i + 1 }, (_, index) => n - 1 - index)
    });
  }

  return states;
} 