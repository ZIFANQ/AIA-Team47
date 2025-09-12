import parse from '../../pseudocode/parse';

export default parse(`
\\Note{ REAL specification of insertion sort for animation

Insertion Sort is a simple comparison-based sorting algorithm that builds 
the final sorted array one element at a time. It works by taking elements 
from the unsorted portion and inserting them into their correct position 
in the sorted portion. The algorithm is similar to how you might sort 
playing cards in your hands.

Time Complexity: 
- Best case: O(n) when array is already sorted
- Average case: O(n²)
- Worst case: O(n²) when array is reverse sorted
Space Complexity: O(1) - it sorts in-place
\\Note}

\\Code{
Main
// Sort array A[0]..A[n-1] in ascending order
InsertionSort(A, n) \\B 1
\\Expl{  Insertion sort works by maintaining a sorted portion at the
        beginning of the array and repeatedly taking the next element
        from the unsorted portion and inserting it into its correct
        position in the sorted portion.
\\Expl}
    for i <- 1 to n-1 \\B 2
    \\Expl{  We start from index 1 because we consider A[0] as the initial
            sorted portion (a single element is always sorted). For each
            iteration, we take the element at position i and insert it
            into its correct position in the sorted portion A[0]..A[i-1].
    \\Expl}
    \\In{
        Store current element    \\Ref StoreKey
        \\Expl{  Store the current element that needs to be inserted
                into the sorted portion.
        \\Expl}
        Find insertion position    \\Ref FindPosition
        \\Expl{  Find the correct position where the current element
                should be inserted in the sorted portion by comparing
                it with elements from right to left.
        \\Expl}
        Insert element at correct position    \\Ref InsertElement
        \\Expl{  Place the stored element at its correct position,
                completing the insertion for this iteration.
        \\Expl}
    \\In}
    // Array is now sorted \\B 7
\\Code}

\\Code{
StoreKey
// Store the current element to be inserted
key <- A[i] \\B 3
\\Expl{  We store the element at position i in a temporary variable 'key'.
        This element needs to be inserted into its correct position
        in the sorted portion A[0]..A[i-1].
\\Expl}
\\Code}

\\Code{
FindPosition
// Find the correct position for key in the sorted portion
j <- i - 1 \\B 4
\\Expl{  Start from the rightmost element of the sorted portion.
        We'll move elements to the right until we find the correct
        position for the key.
\\Expl}
while j >= 0 and A[j] > key \\B 5
\\Expl{  Continue moving elements to the right as long as:
        1. We haven't reached the beginning of the array (j >= 0)
        2. The current element is greater than the key
        This ensures we find the correct position for insertion.
\\Expl}
\\In{
    A[j + 1] <- A[j] \\B 5a
    \\Expl{  Shift the larger element one position to the right
            to make room for the key. This overwrites A[j+1] but
            that's okay because we've already stored the original
            value in 'key'.
    \\Expl}
    j <- j - 1 \\B 5b
    \\Expl{  Move to the next element to the left to continue
            the comparison and shifting process.
    \\Expl}
\\In}
\\Code}

\\Code{
InsertElement
// Insert the key at its correct position
A[j + 1] <- key \\B 6
\\Expl{  Insert the key at position j+1. At this point, either:
        1. j < 0 (we've reached the beginning of the array), or
        2. A[j] <= key (we've found the correct position)
        In both cases, j+1 is the correct position for the key.
\\Expl}
\\Code}

`);
