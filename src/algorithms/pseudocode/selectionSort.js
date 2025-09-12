import parse from '../../pseudocode/parse';

export default parse(`
\\Note{ REAL specification of selection sort for animation

Selection Sort is a simple comparison-based sorting algorithm that works by
repeatedly finding the minimum element from the unsorted portion of the array
and placing it at the beginning of the sorted portion. The algorithm maintains
two subarrays: a sorted subarray at the beginning and an unsorted subarray
for the remaining elements.

Time Complexity: O(n²) in all cases (best, average, worst)
Space Complexity: O(1) - it sorts in-place
\\Note}

\\Code{
Main
// Sort array A[0]..A[n-1] in ascending order
SelectionSort(A, n) \\B 1
\\Expl{  Selection sort works by dividing the array into two parts:
        a sorted portion at the beginning and an unsorted portion.
        We repeatedly find the minimum element in the unsorted portion
        and swap it with the first element of the unsorted portion.
\\Expl}
    for i <- 0 to n-2 \\B 2
    \\Expl{  We iterate through positions 0 to n-2. After each iteration,
            the element at position i will be in its final sorted position.
            We don't need to process the last element (n-1) as it will
            automatically be the largest after all other elements are sorted.
    \\Expl}
    \\In{
        Find minimum element in unsorted portion    \\Ref FindMinimum
        \\Expl{  Find the index of the smallest element in the unsorted
                portion of the array (from position i to n-1).
        \\Expl}
        Swap minimum with current position    \\Ref SwapMinimum
        \\Expl{  Place the minimum element found in the unsorted portion
                at the current position i, expanding the sorted portion.
        \\Expl}
    \\In}
    // Array is now sorted \\B 6
\\Code}

\\Code{
FindMinimum
// Find index of minimum element in A[i]..A[n-1]
minIndex <- i \\B 3
\\Expl{  Initialize minIndex to the first position of the unsorted portion.
        We assume the first element is the minimum and then check if
        any other element in the unsorted portion is smaller.
\\Expl}
for j <- i+1 to n-1 \\B 4
\\Expl{  Scan through the remaining unsorted elements to find the
        actual minimum element.
\\Expl}
\\In{
    if A[j] < A[minIndex] \\B 4a
    \\Expl{  If we find an element smaller than our current minimum,
            update minIndex to point to this new minimum element.
    \\Expl}
    \\In{
        minIndex <- j \\B 4b
        \\Expl{  Update the index of the minimum element found so far.
        \\Expl}
    \\In}
\\In}
\\Code}

\\Code{
SwapMinimum
// Swap the minimum element with the element at position i
if minIndex != i \\B 5
\\Expl{  Only swap if the minimum element is not already at position i.
        This avoids unnecessary swaps when the element is already in
        the correct position.
\\Expl}
\\In{
    swap(A[i], A[minIndex]) \\B 5a
    \\Expl{  Exchange the minimum element found in the unsorted portion
            with the element at the current position i. After this swap,
            position i contains the correct element for the sorted portion.
    \\Expl}
\\In}
\\Code}

`);
