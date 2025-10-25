<<<<<<< Updated upstream
=======
import parse from '../../pseudocode/parse';

export default parse(`
\\Note{  REAL specification of selection sort animation
        \\Note}

        \\Code{
        Main
        SelectionSort(A, n) // Sort array A[1]..A[n] in ascending order. \\B 1
        \\Expl{  Selection Sort selects the smallest element from the unsorted portion each time,
                 place it at the end of the sorted section.
                 Simple and intuitive, but unstable, with a time complexity of O(n^2).
        \\Expl}
        \\In{
            ForLoop_i(A, n)   \\Ref ForLoop_i
            \\Expl{  Outer loop: Determine the final position of A[i].
            \\Expl}
        \\In}
        // Done \\B 8
        \\Code}

        \\Code{
        ForLoop_i
        for i <- 1 to n-1 \\B 2
        \\Expl{  i start from 1, indicates the position of the smallest element to be placed at this moment.
        \\Expl}
        \\In{
            min <- i \\B 3
            \\Expl{  Assume the current position is the index of the minimum value.
            \\Expl}
            ForLoop_j(i+1, n)   \\Ref ForLoop_j
            \\Expl{  Inner loop: Find a smaller element within A[i+1..n].
            \\Expl}
            SwapIfNeed(A[i], A[min]) \\B 8
            \\Expl{  If a smaller element is found, swap the positions of these two elements, 
                     so that A[i] becomes the current minimum.
            \\Expl}
        \\In}
        \\Code}

        \\Code{
        ForLoop_j
        for j <- i+1 to n \\B 4
        \\Expl{  Iterate through each element in the unsorted region.
        \\Expl}
        \\In{
            if A[j] < A[min] \\B 5
            \\Expl{  If it is smaller than the current minimum value, update the minimum value index.
            \\Expl}
            \\In{
                min <- j \\B 6
            \\In}
        \\In}
        EndFor_j // end for j \\B 7
        \\Code}
`);
>>>>>>> Stashed changes
