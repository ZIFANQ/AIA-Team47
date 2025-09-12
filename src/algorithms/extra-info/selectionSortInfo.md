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

Geeks for Geeks Link: [**Selection Sort**][G4GLink]

[G4GLink]: https://www.geeksforgeeks.org/selection-sort/

## Exercises/Exploration

Selection sort always makes the same number of comparisons, regardless of the input order. Try sorting:
- Already sorted data
- Reversed data
- Random data

Compare how many *swaps* happen in each case — what does that tell you?

Selection sort is not efficient for large lists, but it's sometimes used in cases where memory writes are expensive (e.g. EEPROM, flash). Why might that be?

Explore how selection sort compares to bubble sort and insertion sort in terms of:
- Number of comparisons
- Number of swaps
- Best/worst/average-case time complexity

Also, try implementing an **optimized version** of selection sort that stops early if the rest of the list is sorted — does it help?


