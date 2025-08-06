export interface HashNode {
  key: string;
  value: number;
  next?: HashNode;
}

export interface HashTableState {
  buckets: (HashNode | null)[];
  searchKey: string;
  currentBucket: number;
  currentNode: number;
  found: boolean;
  searchPath: number[];
  hashValue: number;
}

export function hashTableSearch(
  keys: string[],
  values: number[],
  searchKey: string
): HashTableState[] {
  const states: HashTableState[] = [];
  const size = 10; // Hash table size
  const buckets: (HashNode | null)[] = new Array(size).fill(null);

  // Hash function
  function hash(key: string): number {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = ((hash << 5) - hash + key.charCodeAt(i)) & 0xffffffff;
    }
    return Math.abs(hash) % size;
  }

  // Insert key-value pairs into hash table
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = values[i];
    const index = hash(key);

    const newNode: HashNode = { key, value };

    if (buckets[index] === null) {
      buckets[index] = newNode;
    } else {
      // Collision - add to linked list
      let current = buckets[index];
      while (current!.next !== undefined) {
        current = current!.next;
      }
      current!.next = newNode;
    }
  }

  // Add initial state
  states.push({
    buckets: buckets.map(bucket => bucket ? { ...bucket } : null),
    searchKey,
    currentBucket: -1,
    currentNode: -1,
    found: false,
    searchPath: [],
    hashValue: -1
  });

  // Calculate hash for search key
  const hashValue = hash(searchKey);
  
  // Add state showing hash calculation
  states.push({
    buckets: buckets.map(bucket => bucket ? { ...bucket } : null),
    searchKey,
    currentBucket: -1,
    currentNode: -1,
    found: false,
    searchPath: [],
    hashValue
  });

  // Search in the hash table
  const targetBucket = buckets[hashValue];
  
  if (targetBucket === null) {
    // Key not found - empty bucket
    states.push({
      buckets: buckets.map(bucket => bucket ? { ...bucket } : null),
      searchKey,
      currentBucket: hashValue,
      currentNode: -1,
      found: false,
      searchPath: [hashValue],
      hashValue
    });
  } else {
    // Search through linked list
    let current: HashNode | null = targetBucket;
    let nodeIndex = 0;
    const searchPath = [hashValue];

    states.push({
      buckets: buckets.map(bucket => bucket ? { ...bucket } : null),
      searchKey,
      currentBucket: hashValue,
      currentNode: nodeIndex,
      found: false,
      searchPath,
      hashValue
    });

    while (current !== null) {
      // Add state showing current node being checked
      states.push({
        buckets: buckets.map(bucket => bucket ? { ...bucket } : null),
        searchKey,
        currentBucket: hashValue,
        currentNode: nodeIndex,
        found: current.key === searchKey,
        searchPath,
        hashValue
      });

      if (current.key === searchKey) {
        // Key found
        states.push({
          buckets: buckets.map(bucket => bucket ? { ...bucket } : null),
          searchKey,
          currentBucket: hashValue,
          currentNode: nodeIndex,
          found: true,
          searchPath,
          hashValue
        });
        break;
      }

      current = current.next || null;
      nodeIndex++;

      if (current !== null) {
        // Add state showing next node
        states.push({
          buckets: buckets.map(bucket => bucket ? { ...bucket } : null),
          searchKey,
          currentBucket: hashValue,
          currentNode: nodeIndex,
          found: false,
          searchPath,
          hashValue
        });
      }
    }

    // Key not found in linked list
    if (current === null) {
      states.push({
        buckets: buckets.map(bucket => bucket ? { ...bucket } : null),
        searchKey,
        currentBucket: hashValue,
        currentNode: -1,
        found: false,
        searchPath,
        hashValue
      });
    }
  }

  return states;
} 