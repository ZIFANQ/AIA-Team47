import parse from '../../pseudocode/parse';

export default parse(`
\\Note{  REAL specification of insertion sort animation
        \\Note}

        \\Code{
        Main
        InsertionSort(A, n) // Sort array A[1]..A[n] in ascending order. \\B 1
        \\Expl{  Insertion Sort 维护左侧“已排序区”，将当前元素插入到正确位置。
                 稳定、原地，适合小规模或近乎有序的输入。
        \\Expl}
        \\In{
            ForLoop(A, n)    \\Ref ForLoop
            \\Expl{  从第二个元素开始，逐个将 A[i] 插入到前面已排序区中。
            \\Expl}
        \\In}
        // Done \\B 20
        \\Code}

        \\Code{
        ForLoop
        for i <- 2 to n \\B 2
        \\Expl{  这里数组下标从 1 开始；i=2 表示第一个需要插入的元素。
        \\Expl}
        \\In{
            InsertPass(A, i)    \\Ref InsertPass
            \\Expl{  将位置 i 的元素插入到 A[1..i-1] 的正确位置。
            \\Expl}
        \\In}
        \\Code}

        \\Code{
        InsertPass
        key <- A[i] \\B 3
        \\Expl{  暂存当前要插入的元素。
        \\Expl}
        j <- i - 1 \\B 4
        \\Expl{  从已排序区的末尾开始比较并右移较大的元素。
        \\Expl}
        while j >= 1 and A[j] > key \\B 5
        \\Expl{  只要左侧元素比 key 大，就右移它们给 key 腾位置。
        \\Expl}
        \\In{
            A[j+1] <- A[j] \\B 6
            j <- j - 1 \\B 7
        \\In}
        A[j+1] <- key \\B 8
        \\Expl{  将 key 放入空出的位置；到此 A[1..i] 再次有序。
        \\Expl}
        \\Code}
`);
