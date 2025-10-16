<style>
a:link {
    color: #1e28f0;
}
a:visited{
    color: #3c1478;
}
a:hover{
    color: #1e288c;
}
</style>

## Extra Info

-----

Geeks for Geeks Link: [**Insertion Sort**][G4GLink]

[G4GLink]: https://www.geeksforgeeks.org/insertion-sort/

## Exercises/Exploration

Insertion sort works very efficiently on small or **nearly sorted** lists. Try it on:
- A fully sorted list
- A reversed list
- A list where only a few elements are out of order

Measure the number of comparisons and shifts (not swaps!) required in each case. What do you notice?

Insertion sort is often used in hybrid sorting algorithms (like Timsort) for small subarrays — why might this be a good idea?

Modify the insertion sort to sort in **descending** order instead of ascending. What changes are needed?

What is the **worst-case** input for insertion sort, and why does it happen?

Explore how insertion sort behaves compared to bubble sort and selection sort in:
- Best/worst/average case complexity
- Number of writes to the array
- Usefulness in real-world scenarios
