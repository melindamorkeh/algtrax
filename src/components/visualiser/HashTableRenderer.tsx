'use client';

import { motion } from 'framer-motion';

interface HashNode {
  key: string;
  value: number;
  next?: HashNode;
}

interface HashTableRendererProps {
  buckets: (HashNode | null)[];
  searchKey: string;
  currentBucket: number;
  currentNode: number;
  found: boolean;
  searchPath: number[];
  hashValue: number;
}

export function HashTableRenderer({
  buckets,
  searchKey,
  currentBucket,
  currentNode,
  found,
  searchPath,
  hashValue
}: HashTableRendererProps) {
  const renderBucket = (bucket: HashNode | null, index: number) => {
    const isCurrentBucket = index === currentBucket;
    const isInSearchPath = searchPath.includes(index);
    const isHashValue = index === hashValue;

    return (
      <div
        key={index}
        className={`border-2 rounded-lg p-3 min-h-[80px] ${
          isCurrentBucket
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : isInSearchPath
            ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
            : isHashValue
            ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
        }`}
      >
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          Bucket {index}
          {isHashValue && (
            <span className="ml-2 text-green-600 dark:text-green-400">
              (Hash: {hashValue})
            </span>
          )}
        </div>
        
        {bucket ? (
          <div className="space-y-2">
            {renderLinkedList(bucket, index)}
          </div>
        ) : (
          <div className="text-gray-400 dark:text-gray-500 text-sm italic">
            Empty
          </div>
        )}
      </div>
    );
  };

  const renderLinkedList = (node: HashNode, bucketIndex: number, nodeIndex: number = 0) => {
    const isCurrentNode = bucketIndex === currentBucket && nodeIndex === currentNode;
    const isFound = found && isCurrentNode;

    return (
      <motion.div
        key={`${bucketIndex}-${nodeIndex}`}
        className={`p-2 rounded border ${
          isFound
            ? 'border-green-500 bg-green-100 dark:bg-green-900/30'
            : isCurrentNode
            ? 'border-blue-500 bg-blue-100 dark:bg-blue-900/30'
            : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'
        }`}
        initial={{ scale: 1 }}
        animate={{ scale: isCurrentNode ? 1.05 : 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="text-sm font-medium">
          Key: <span className="text-blue-600 dark:text-blue-400">{node.key}</span>
        </div>
        <div className="text-sm">
          Value: <span className="text-green-600 dark:text-green-400">{node.value}</span>
        </div>
        {node.next && (
          <div className="mt-2">
            <div className="text-xs text-gray-500 dark:text-gray-400">↓</div>
            {renderLinkedList(node.next, bucketIndex, nodeIndex + 1)}
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          <strong>Searching for:</strong> {searchKey}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <strong>Hash Value:</strong> {hashValue}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <strong>Status:</strong> {found ? 'Found!' : 'Searching...'}
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-5 gap-4">
          {buckets.map((bucket, index) => renderBucket(bucket, index))}
        </div>
      </div>
      
      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
        <span className="inline-block w-3 h-3 bg-green-500 rounded mr-1"></span>
        Hash Value
        <span className="inline-block w-3 h-3 bg-yellow-500 rounded ml-3 mr-1"></span>
        Search Path
        <span className="inline-block w-3 h-3 bg-blue-500 rounded ml-3 mr-1"></span>
        Current Node
        <span className="inline-block w-3 h-3 bg-green-400 rounded ml-3 mr-1"></span>
        Found
      </div>
    </div>
  );
} 