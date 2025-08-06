export interface BarState {
  values: number[];
  comparing: number[];
  swapping: number[];
  sorted: number[];
  key: number;
}

export function insertionSort(arr: number[]): BarState[] {
  const states: BarState[] = [];
  const n = arr.length;
  const array = [...arr];

  // Add initial state
  states.push({
    values: [...array],
    comparing: [],
    swapping: [],
    sorted: [0], // First element is considered sorted
    key: -1
  });

  for (let i = 1; i < n; i++) {
    const key = array[i];
    let j = i - 1;

    // Add state showing key element
    states.push({
      values: [...array],
      comparing: [],
      swapping: [],
      sorted: Array.from({ length: i }, (_, index) => index),
      key: i
    });

    while (j >= 0 && array[j] > key) {
      // Add comparing state
      states.push({
        values: [...array],
        comparing: [j, j + 1],
        swapping: [],
        sorted: Array.from({ length: i }, (_, index) => index),
        key: i
      });

      // Add shifting state
      states.push({
        values: [...array],
        comparing: [],
        swapping: [j, j + 1],
        sorted: Array.from({ length: i }, (_, index) => index),
        key: i
      });

      array[j + 1] = array[j];
      j--;

      // Add state after shift
      states.push({
        values: [...array],
        comparing: [],
        swapping: [],
        sorted: Array.from({ length: i }, (_, index) => index),
        key: i
      });
    }

    array[j + 1] = key;

    // Add final state for this iteration
    states.push({
      values: [...array],
      comparing: [],
      swapping: [],
      sorted: Array.from({ length: i + 1 }, (_, index) => index),
      key: -1
    });
  }

  return states;
} 