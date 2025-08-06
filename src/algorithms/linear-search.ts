export interface BarState {
  values: number[];
  comparing: number[];
  swapping: number[];
  sorted: number[];
  searching: number[];
  found: number[];
  target: number;
}

export function linearSearch(arr: number[], target: number): BarState[] {
  const states: BarState[] = [];
  const array = [...arr];

  // Add initial state
  states.push({
    values: [...array],
    comparing: [],
    swapping: [],
    sorted: [],
    searching: [],
    found: [],
    target
  });

  for (let i = 0; i < array.length; i++) {
    // Add state showing current element being searched
    states.push({
      values: [...array],
      comparing: [i],
      swapping: [],
      sorted: [],
      searching: [i],
      found: [],
      target
    });

    if (array[i] === target) {
      // Add state showing found element
      states.push({
        values: [...array],
        comparing: [],
        swapping: [],
        sorted: [],
        searching: [],
        found: [i],
        target
      });
      break;
    } else {
      // Add state showing element not found, moving to next
      states.push({
        values: [...array],
        comparing: [],
        swapping: [],
        sorted: [],
        searching: [],
        found: [],
        target
      });
    }
  }

  // If target not found, add final state
  if (!array.includes(target)) {
    states.push({
      values: [...array],
      comparing: [],
      swapping: [],
      sorted: [],
      searching: [],
      found: [],
      target
    });
  }

  return states;
} 