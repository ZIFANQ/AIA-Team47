// Merge sort for arrays, top down
// Adapted code from Quicksort...
// XXX Could do with a good clean up!
// Lots of crud, mostly abandoned attempt at QS-style stack display.
// Uses simple stack display like DFSrec; stack vanishes inside
// merge+copy because screen real-estate is limited and details of merge
// are independent of stack details anyway (may cause some surprise
// though) XXX would be nice to add QS/REX style stack display instead

import { msort_arr_td } from '../explanations';
import {colors} from '../../components/DataStructures/colors';

// Animation should be consistent with BUP/Nat merge sort
// XXX (could make code more similar and use shared code here)
const apColor = colors.apple;
const runAColor = colors.peach;
const runBColor = colors.sky;
const sortColor = colors.leaf;
const doneColor = colors.stone;

const run = run_msort();

export default {
  explanation: msort_arr_td,
  initVisualisers,
  run
};


// XXX (was) Quicksort common code
// Example of a recursive algorithm that could serve as a guide to
// implementing others.  Some things to note:
// 1) A depth parameter is added to the recursive code and also passed
// to chunker.add()
// 2) Recursive calls are in code blocks that can be collapsed, so the
// whole recursive call can be done in a single step. To do this we must
// have chunks at the recursion level of the call at the start and end
// of the collapsed computation. Here the start chunk is a comment line.
// It does nothing but notes that the call on the next line is recursive.
// At the next step control goes back to the start of the function so
// an extra comment is not a bad thing to do for clarity in any case.
// The chunk after the recursive computation is at the line of code with
// the call, so the call is highlighted when it returns, as we would
// want.
// 3) The stack is visualised in the animation, to help understanding of
// the algorithm overall and also where we are in the recursion.
// 4) There is chunk at the end of the whole computation that cleans up
// the final display a bit.

// There may be remnants of code from a previous version that didn't
// encapsulate the recursive calls properly

// import 1D tracer to generate array in a separate component of the middle panel
import ArrayTracer from '../../components/DataStructures/Array/Array1DTracer';

import {
  areExpanded,
} from './collapseChunkPlugin';

/////////////////////////////////////////////////////

// arrayB exists and is displayed only if MergeCopy is expanded
function isMergeCopyExpanded() {
  return areExpanded(['MergeCopy']);
}

// We don't strictly need isMergeExpanded: only needed if last chunk of
// merge still had extra vars displayed.  Some code still needs
// isMergeCopyExpanded because it uses arrayB
function isMergeExpanded() {
  return areExpanded(['MergeCopy', 'Merge']); // MergeCopy contains Merge
}

// checks if either recursive call is expanded (otherwise stack is not
// displayed)
function isRecursionExpanded() {
  return areExpanded(['MergesortL']) || areExpanded(['MergesortR']);
}

// see stackFrameColour in index.js to find corresponding function mapping to css
const STACK_FRAME_COLOR = {
  No_color: 0,
  In_progress_stackFrame: 1,
  Current_stackFrame: 2,
  Finished_stackFrame: 3,
  I_color: 4,
  J_color: 5,
  P_color: 6, // pivot
};

// for simple DFS-like stack display
let simple_stack = [];


// ----------------------------------------------------------------------------------------------------------------------------

// Define helper functions
// without javascript Closure arguements (IE 'global variables')
// ----------------------------------------------------------------------------------------------------------------------------

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}


export function update_vis_with_stack_frame(a, stack_frame, stateVal) {
  let left, right, depth;
  [left, right, depth] = stack_frame;

  // For merge sort, we want to show the range being processed more clearly
  // Show a more compact representation that emphasizes the divide-and-conquer structure
  
  const segmentLength = right - left + 1;
  
  // Check if depth array exists and is properly initialized
  if (!a[depth]) {
    console.error(`Array at depth ${depth} is undefined!`);
    return a;
  }
  
  if (segmentLength === 1) {
    // Base case: single element
    if (left < a[depth].length) {
      a[depth][left] = { base: stateVal, extra: [] };
    }
  } else if (segmentLength <= 3) {
    // Small segments: show all elements
    for (let i = left; i <= right; i += 1) {
      if (i < a[depth].length) {
        a[depth][i] = { base: stateVal, extra: [] };
      }
    }
  } else {
    // Larger segments: show strategic positions to indicate the range and split
    
    // Always show the boundaries
    if (left < a[depth].length) {
      a[depth][left] = { base: stateVal, extra: [] };
    }
    if (right < a[depth].length) {
      a[depth][right] = { base: stateVal, extra: [] };
    }
    
    // Show the split point with a different color
    let mid = Math.floor((left + right) / 2);
    if (mid < a[depth].length && mid !== left && mid !== right) {
      a[depth][mid] = { base: STACK_FRAME_COLOR.P_color, extra: [] };
    }
    
    // For very long segments, add one more position on each side of boundaries
    if (segmentLength > 6) {
      if (left + 1 < a[depth].length && left + 1 <= right) {
        a[depth][left + 1] = { base: stateVal, extra: [] };
      }
      if (right - 1 >= 0 && right - 1 >= left && right - 1 < a[depth].length) {
        a[depth][right - 1] = { base: stateVal, extra: [] };
      }
    }
  }

  return a;
}


const highlight = (vis, index, color) => {
  vis.array.selectColor(index, color);
};

const highlightB = (vis, index, color) => {
  vis.arrayB.selectColor(index, color);
};

// XXX third arg unused
const unhighlight = (vis, index, isPrimaryColor = true) => {
  vis.array.deselect(index);
};

// XXX third arg unused
const unhighlightB = (vis, index, isPrimaryColor = true) => {
  vis.arrayB.deselect(index);
};


// ----------------------------------------------------------------------------------------------------------------------------


// We hide array B entirely if mergeCopy is collapsed
// When recursion is expanded, we show stack visualization
// When merge is expanded, we show Array B
export function initVisualisers() {
  const visualizers = {
    array: {
      instance: new ArrayTracer('array', null, 'Array A', {
        arrayItemMagnitudes: true,
      }),
      order: 0,
    },
  };

  // Add Array B when merge operations are expanded
  if (isMergeCopyExpanded()) {
    visualizers.arrayB = {
      instance: new ArrayTracer('arrayB', null, 'Array B', {
        arrayItemMagnitudes: true,
      }),
      order: 1,
    };
  }
  
  // Always add Stack visualization - we'll control visibility through the refresh_stack function
  // This ensures the stack visualizer is always available when needed
  const stackLabel = isMergeCopyExpanded() ? 'Stack' : 'Array B/Stack';
  visualizers.stack = {
    instance: new ArrayTracer('stack', null, stackLabel, {
      arrayItemMagnitudes: false,
    }),
    order: isMergeCopyExpanded() ? 2 : 1,
  };

  return visualizers;
}

/**
 *
 * @param {object} chunker
 * @param {array} nodes array of numbers needs to be sorted
 */

export function run_msort() {

  return function run(chunker, { nodes }) {
    // can't rename from nodes

    // ----------------------------------------------------------------------------------------------------------------------------
    // Define 'global' variables
    // ----------------------------------------------------------------------------------------------------------------------------

    const entire_num_array = nodes;
    let A = nodes;
    let B = [...entire_num_array].fill(undefined);
    let max_depth_index = -1; // indexes into 2D array, starts at zero
    const finished_stack_frames = []; // [ [left, right,  depth], ...]  (although depth could be implicit this is easier)
    const real_stack = []; // [ [left, right,  depth], ...]

    // ----------------------------------------------------------------------------------------------------------------------------
    // Define helper functions
    // ----------------------------------------------------------------------------------------------------------------------------

    function derive_stack(cur_real_stack, cur_finished_stack_frames, cur_left, cur_right, cur_depth) {
      // return 2D array stack_vis containing color values corresponding to stack frame states and indexes in those stack frames
      // for visualise this data

      let stack_vis = [];

      for (let i = 0; i < max_depth_index + 1; i++) {
        // for whatever reason fill() does not work here... JavaScript
        stack_vis.push(
          [...Array.from({ length: entire_num_array.length })].map(() => ({
            base: STACK_FRAME_COLOR.No_color,
            extra: [],
          })),
        );
      }

      // First render finished stack frames (green)
      cur_finished_stack_frames.forEach((stack_frame) => {
        stack_vis = update_vis_with_stack_frame(
          stack_vis,
          stack_frame,
          STACK_FRAME_COLOR.Finished_stackFrame,
        );
      });

      // Then render in-progress stack frames (yellow), but exclude the current one
      if (cur_real_stack.length > 1) {
        cur_real_stack.slice(0, -1).forEach((stack_frame) => {
          stack_vis = update_vis_with_stack_frame(
            stack_vis,
            stack_frame,
            STACK_FRAME_COLOR.In_progress_stackFrame,
          );
        });
      }

      // Finally render the current stack frame (red) - this should be on top
      if (cur_real_stack.length > 0) {
        stack_vis = update_vis_with_stack_frame(
          stack_vis,
          cur_real_stack[cur_real_stack.length - 1],
          STACK_FRAME_COLOR.Current_stackFrame,
        );
      }

      return stack_vis;
    }

    const refresh_stack = (vis, cur_real_stack, cur_finished_stack_frames, cur_left, cur_right, cur_depth) => {

      assert(vis.array);
      assert(cur_real_stack && cur_finished_stack_frames);

      // Always show stack visualization - the improved version
      const stackVis = derive_stack(cur_real_stack, cur_finished_stack_frames, cur_left, cur_right, cur_depth);
      
      // If we have a separate stack visualizer, use it
      if (vis.stack) {
        vis.stack.setStackDepth(cur_real_stack.length);
        vis.stack.setStack(stackVis);
      } else {
        // Fallback to array visualizer for stack
        vis.array.setStackDepth(cur_real_stack.length);
        vis.array.setStack(stackVis);
      }

    };


    function assignVarToA(vis, variable_name, index) {
      if (index === undefined)
        vis.array.removeVariable(variable_name);
      else
        vis.array.assignVariable(variable_name, index);
    }

    function assignVarToB(vis, variable_name, index) {
      if (index === undefined)
        vis.arrayB.removeVariable(variable_name);
      else
        vis.arrayB.assignVariable(variable_name, index);
    }

    // ----------------------------------------------------------------------------------------------------------------------------
    // Define quicksort functions
    // ----------------------------------------------------------------------------------------------------------------------------

    function renderInMerge(vis, a, b, cur_left, cur_ap1, cur_ap2, cur_bp, cur_max1, cur_max2, c_stk) {
      // re-does a fair bit of work - could make more like BUP/Nat
      if (isMergeExpanded()) {
        vis.array.set(a, 'msort_arr_td');
        // set_simple_stack(vis.array, c_stk);
        assignVarToA(vis, 'ap1', cur_ap1);
        assignVarToA(vis, 'max1', cur_max1);
        for (let i = cur_left; i <= cur_max1; i++) {
          if (i === cur_ap1)
            highlight(vis, i, apColor);
          else
            highlight(vis, i, runAColor);
        }
        for (let i = cur_max1+1; i <= cur_max2; i++) {
          if (i === cur_ap2)
            highlight(vis, i, apColor);
          else
            highlight(vis, i, runBColor);
        }
        if (cur_ap2 < a.length) { // can't render beyond array:(
          assignVarToA(vis, 'ap2', cur_ap2);
          assignVarToA(vis, 'ap2='+(a.length+1), undefined);
        } else {
          assignVarToA(vis, 'ap2='+(a.length+1), a.length - 1);
          assignVarToA(vis, 'ap2', undefined);
        }
        assignVarToA(vis, 'max2', cur_max2);
        vis.arrayB.set(b, 'msort_arr_td');
        assignVarToB(vis, 'bp', cur_bp);
        for (let i = cur_left; i < cur_bp; i++) {
          highlightB(vis, i, sortColor);
        }
      }
    }

    // calls vis.array.setList(c_stk) to display simple stack but only
    // if recursion is expanded (otherwise stack is never displayed)
    // XXX is this confusing if we run the algorithm a bit with
    // recursion expanded then collapse recursion? I guess if you are
    // doing that you have a pretty good understanding anyway?
    const set_simple_stack = (vis_array, c_stk) => {
      if (isRecursionExpanded())
        vis_array.setList(c_stk);
    }

    function MergeSort(left, right, depth) {


      //// start mergesort -------------------------------------------------------- 
      // XXXXX

      real_stack.push([left, right, depth]);
      max_depth_index = Math.max(max_depth_index, depth);
      simple_stack.unshift('(' + (left + 1) + ',' + (right + 1) + ')');

      let pivot;

      // should show animation if doing high level steps for whole array OR if code is expanded to do all reccursive steps

      chunker.add('Main', (vis, a, b, cur_left, cur_right, cur_depth,
        cur_real_stack, cur_finished_stack_frames, c_stk) => {
        vis.array.set(a, 'msort_arr_td');
        if (cur_depth === 0) {
          vis.array.setLargestValue(maxValue);
          vis.array.setStack([]); // used for a custom stack visualisation
          if (isMergeCopyExpanded()) {
            vis.arrayB.set(b, 'msort_arr_td');
            vis.arrayB.setLargestValue(maxValue);
          }
        }
        assignVarToA(vis, 'left', cur_left);
        assignVarToA(vis, 'right', cur_right);
        for (let i = cur_left; i <= cur_right; i++) {
          highlight(vis, i, runAColor)
        }
        // Use improved stack visualization
        refresh_stack(vis, cur_real_stack, cur_finished_stack_frames, cur_left, cur_right, cur_depth);
        // Keep simple stack as fallback for when recursion is collapsed
        if (!isRecursionExpanded()) {
          set_simple_stack(vis.array, c_stk);
        }
      }, [A, B, left, right, depth, real_stack, finished_stack_frames,
        simple_stack], depth);

      chunker.add('left<right', (vis, a, cur_left, cur_right) => {
        // assignVarToA(vis, 'left', undefined);
        // assignVarToA(vis, 'right', undefined);
        for (let i = cur_left; i <= cur_right; i++) {
          // unhighlight(vis, i, true)
        }
      }, [A, left, right], depth);

      if (left < right) {
        let mid = Math.floor((left + right) / 2);
        chunker.add('mid', (vis, a, cur_left, cur_mid, cur_right) => {
          for (let i = cur_mid + 1; i <= cur_right; i++) {
            unhighlight(vis, i, true)
            highlight(vis, i, runBColor)
          }
          assignVarToA(vis, 'mid', cur_mid);
        }, [A, left, mid, right], depth);

        // dummy chunk for before recursive call - we need this so there
        // is a chunk at this recursion level as the first chunk in the
        // collapsed code for the recursive call
        chunker.add('preSortL', (vis, a, cur_left, cur_mid, cur_right) => {
          assignVarToA(vis, 'left', undefined);
          assignVarToA(vis, 'right', undefined);
          assignVarToA(vis, 'mid', undefined);
          // for (let i = cur_mid + 1; i <= right; i++) {
            // highlight(vis, i, true)
          // }
        }, [A, left, mid, right], depth);

        MergeSort(left, mid, depth + 1);

        // chunk after recursive call - it's good to highlight the
        // recursive call once it has returned plus we need a chunk at
        // this level when the recursive code is collapsed
        chunker.add('sortL', (vis, a, cur_left, cur_mid, cur_right,
          cur_real_stack, cur_finished_stack_frames, c_stk) => {
          vis.array.set(a, 'msort_arr_td');
          // Use improved stack visualization
          refresh_stack(vis, cur_real_stack, cur_finished_stack_frames, cur_left, cur_right, depth);
          // Keep simple stack as fallback for when recursion is collapsed
          if (!isRecursionExpanded()) {
            set_simple_stack(vis.array, c_stk);
          }
          assignVarToA(vis, 'left', cur_left);
          assignVarToA(vis, 'mid', cur_mid);
          assignVarToA(vis, 'right', cur_right);
          for (let i = cur_left; i <= cur_mid; i++) {
            // unhighlight(vis, i, true);
            highlight(vis, i, runAColor)
          }
          for (let i = cur_mid + 1; i <= cur_right; i++) {
            highlight(vis, i, runBColor);
          }
        }, [A, left, mid, right, real_stack, finished_stack_frames, simple_stack], depth);

        // dummy chunk before recursive call, as above
        chunker.add('preSortR', (vis, a, cur_left, cur_mid, cur_right) => {
          // vis.array.set(a, 'msort_arr_td');
          for (let i = cur_left; i <= cur_mid; i++) {
            unhighlight(vis, i, false);
          }
          assignVarToA(vis, 'left', undefined);
          assignVarToA(vis, 'mid', undefined);
          assignVarToA(vis, 'right', undefined);
          // for (let i = cur_mid + 1; i <= cur_right; i++) {
            // highlight(vis, i, true)
          // }
        }, [A, left, mid, right], depth);

        MergeSort(mid + 1, right, depth + 1);

        // chunk after recursive call
        chunker.add('sortR', (vis, a, cur_left, cur_mid, cur_right,
          cur_real_stack, cur_finished_stack_frames, c_stk) => {
          // vis.array.set(a, 'msort_arr_td');
          // Use improved stack visualization
          refresh_stack(vis, cur_real_stack, cur_finished_stack_frames, cur_left, cur_right, depth);
          // Keep simple stack as fallback for when recursion is collapsed
          if (!isRecursionExpanded()) {
            set_simple_stack(vis.array, c_stk);
          }
          assignVarToA(vis, 'left', cur_left);
          assignVarToA(vis, 'mid', cur_mid);
          assignVarToA(vis, 'right', cur_right);
          for (let i = cur_left; i <= cur_mid; i++) {
            // unhighlight(vis, i, true);
            highlight(vis, i, runAColor)
          }
          for (let i = cur_mid+1; i <= cur_right; i++) {
            // unhighlight(vis, i, true);
            highlight(vis, i, runBColor)
          }
        }, [A, left, mid, right, real_stack, finished_stack_frames, simple_stack], depth);

        // XXX should we shorten psuedocode? eg, (ap1,max1) <- (left,mid)
        let ap1 = left;
        let max1 = mid;
        let ap2 = mid + 1;
        let max2 = right;
        let bp = left;

        chunker.add('ap1', (vis, a, cur_left, cur_mid, cur_right, 
          cur_real_stack, cur_finished_stack_frames) => {
          // Keep stack display during merge if recursion is expanded
          refresh_stack(vis, cur_real_stack, cur_finished_stack_frames, cur_left, cur_right, depth);
          if (isMergeExpanded()) {
            assignVarToA(vis, 'left', undefined);
            assignVarToA(vis, 'ap1', cur_left);
            highlight(vis, cur_left, apColor);
          }
        }, [A, left, mid, right, real_stack, finished_stack_frames], depth);
        chunker.add('max1', (vis, a, cur_left, cur_mid, cur_right) => {
          if (isMergeExpanded()) {
            assignVarToA(vis, 'mid', undefined);
            assignVarToA(vis, 'max1', cur_mid);
          }
        }, [A, left, mid, right], depth);
        chunker.add('ap2', (vis, a, cur_left, cur_mid, cur_right) => {
          if (isMergeExpanded()) {
            assignVarToA(vis, 'ap2', cur_mid + 1);
            highlight(vis, cur_mid + 1, apColor);
          }
        }, [A, left, mid, right], depth);
        chunker.add('max2', (vis, a, cur_left, cur_mid, cur_right) => {
          if (isMergeExpanded()) {
            assignVarToA(vis, 'right', undefined);
            assignVarToA(vis, 'max2', right);
          }
        }, [A, left, mid, right], depth);
        chunker.add('bp', (vis, a, cur_left, cur_mid, cur_right) => {
          if (isMergeExpanded()) {
            assignVarToB(vis, 'bp', left);
          }
        }, [A, left, mid, right], depth);

        // while (ap1 <= max1 && ap2 <= max2) 
        /* eslint-disable no-constant-condition */
        while (true) {
          chunker.add('MergeWhile', (vis, a, b, cur_ap1, cur_ap2,
            cur_bp, cur_max1, cur_max2, cur_stk, cur_left) => {
            renderInMerge(vis, a, b, cur_left, cur_ap1, cur_ap2, cur_bp, cur_max1,
              cur_max2, cur_stk, cur_left);
          }, [A, B, ap1, ap2, bp, max1, max2, simple_stack, left], depth);

          if (!(ap1 <= max1 && ap2 <= max2)) break;

          chunker.add('findSmaller', () => {
             // no animation 
          }, [], depth);
          if (A[ap1] < A[ap2]) {
            B[bp] = A[ap1];
            A[ap1] = undefined;
            chunker.add('copyap1', (vis, a, b, cur_ap1, cur_ap2,
              cur_bp, cur_max1, cur_max2, cur_stk, cur_left) => {
              renderInMerge(vis, a, b, cur_left, cur_ap1, cur_ap2, cur_bp,
                cur_max1, cur_max2, cur_stk, cur_left);
              if (isMergeExpanded()) {
                highlightB(vis, cur_bp, sortColor);
              }
            }, [A, B, ap1, ap2, bp, max1, max2, simple_stack, left], depth);
            ap1 = ap1 + 1;
            chunker.add('ap1++', (vis, a, b, cur_ap1, cur_ap2, cur_bp,
              cur_max1, cur_max2, cur_stk, cur_left) => {
              renderInMerge(vis, a, b, cur_left, cur_ap1, cur_ap2, cur_bp,
                cur_max1, cur_max2, cur_stk, cur_left);
              if (isMergeExpanded()) {
                highlightB(vis, cur_bp, sortColor);
              }
            }, [A, B, ap1, ap2, bp, max1, max2, simple_stack, left], depth);
            bp = bp + 1;
            chunker.add('bp++', (vis, a, b, cur_ap1, cur_ap2, cur_bp,
              cur_max1, cur_max2, cur_stk, cur_left) => {
              renderInMerge(vis, a, b, cur_left, cur_ap1, cur_ap2, cur_bp,
                cur_max1, cur_max2, cur_stk, cur_left);
            }, [A, B, ap1, ap2, bp, max1, max2, simple_stack, left], depth);
          } else {
            B[bp] = A[ap2];
            A[ap2] = undefined;
            chunker.add('copyap2', (vis, a, b, cur_ap1, cur_ap2,
              cur_bp, cur_max1, cur_max2, cur_stk, cur_left) => {
              renderInMerge(vis, a, b, cur_left, cur_ap1, cur_ap2, cur_bp,
                cur_max1, cur_max2, cur_stk, cur_left);
              if (isMergeExpanded()) {
                highlightB(vis, cur_bp, sortColor);
              }
            }, [A, B, ap1, ap2, bp, max1, max2, simple_stack, left], depth);
            ap2 = ap2 + 1;
            chunker.add('ap2++', (vis, a, b, cur_ap1, cur_ap2, cur_bp,
              cur_max1, cur_max2, cur_stk, cur_left) => {
              renderInMerge(vis, a, b, cur_left, cur_ap1, cur_ap2, cur_bp,
                cur_max1, cur_max2, cur_stk, cur_left);
              if (isMergeExpanded()) {
                highlightB(vis, cur_bp, sortColor);
              }
            }, [A, B, ap1, ap2, bp, max1, max2, simple_stack, left], depth);
            bp = bp + 1;
            chunker.add('bp++_2', (vis, a, b, cur_ap1, cur_ap2, cur_bp,
              cur_max1, cur_max2, cur_stk, cur_left) => {
              renderInMerge(vis, a, b, cur_left, cur_ap1, cur_ap2, cur_bp,
                cur_max1, cur_max2, cur_stk, cur_left);
            }, [A, B, ap1, ap2, bp, max1, max2, simple_stack, left], depth);
          }
        }

        for (let i = ap1; i <= max1; i++) {
          B[bp] = A[i];
          A[i] = undefined;
          bp = bp + 1;
        }

        chunker.add('CopyRest1', (vis, a, b, cur_left, cur_ap1,
          cur_ap2, cur_max1, cur_max2, cur_bp, c_stk) => {
          if (isMergeExpanded()) {
            vis.array.set(a, 'msort_arr_td');
            // set_simple_stack(vis.array, c_stk);
            // unhighlight(vis, cur_ap1, true);
            // assignVarToA(vis, 'ap1', undefined);
            // assignVarToA(vis, 'max1', undefined);
            if (cur_ap2 < a.length)
              assignVarToA(vis, 'ap2', cur_ap2);
            assignVarToA(vis, 'max2', cur_max2);
            for (let i = cur_left; i <= cur_max1; i++) {
              highlight(vis, i, runAColor);
            }
            for (let i = cur_max1 + 1; i <= cur_max2; i++) {
              highlight(vis, i, runBColor);
            }
            vis.arrayB.set(b, 'msort_arr_td');
            for (let i = cur_left; i <= cur_bp - 1; i++) {
              highlightB(vis, i, sortColor);
            }
            if (cur_bp < a.length) {
              assignVarToB(vis, 'bp', cur_bp);
            } else {
              assignVarToB(vis, 'bp', undefined);  // XXX anination unclear?
            }
          }
        }, [A, B, left, ap1, ap2, max1, max2, bp, simple_stack], depth);

        for (let i = ap2; i <= max2; i++) {
          B[bp] = A[i];
          A[i] = undefined;
          bp = bp + 1;
        }

        chunker.add('CopyRest2', (vis, a, b, cur_left, cur_right, cur_ap2,
          cur_max2, cur_b, c_stk) => {
          if (isMergeCopyExpanded()) {
            vis.array.set(a, 'msort_arr_td');
            // set_simple_stack(vis.array, c_stk);
            vis.arrayB.set(b, 'msort_arr_td');
            for (let i = cur_left; i <= cur_right; i++) {
              highlightB(vis, i, sortColor);
            }
          }
          if (isMergeExpanded()) {
            if (cur_ap2 < a.length) {
              unhighlight(vis, cur_ap2, true);
              assignVarToA(vis, 'ap2', undefined);
            }
            assignVarToA(vis, 'max2', undefined);
            assignVarToB(vis, 'bp', undefined);
          }
        }, [A, B, left, right, ap2, max2, bp, simple_stack], depth);

        for (let i = left; i <= right; i++) {
          A[i] = B[i];
          B[i] = undefined;
        }
        chunker.add('copyBA', (vis, a, b, cur_left, cur_mid,
          cur_right, c_stk, cur_real_stack, cur_finished_stack_frames) => {
          if (isMergeCopyExpanded()) {
            for (let i = cur_left; i <= cur_right; i++) {
              // unhighlightB(vis, i, false);
            }
            vis.arrayB.set(b, 'msort_arr_td');
          }
          vis.array.set(a, 'msort_arr_td');
          set_simple_stack(vis.array, c_stk);
          for (let i = cur_left; i <= cur_right; i++) {
            highlight(vis, i, sortColor);
          }
          if (isMergeExpanded()) {
            assignVarToA(vis, 'ap1', undefined);
            assignVarToA(vis, 'max1', undefined);
            assignVarToA(vis, 'ap2', undefined);
            assignVarToA(vis, 'max2', undefined);
          }
          // Update stack visualization - the stack frame will be moved to finished at the end of MergeSort function
          refresh_stack(vis, cur_real_stack, cur_finished_stack_frames, cur_left, cur_right, depth);
          // XXX best highlight cur_mid+1..right from previous
          // recursion level?
          // for (let i = cur_mid+1; i <= right; i++) {
          // highlight(vis, i, true)
          // }
        }, [A, B, left, mid, right, simple_stack, real_stack, finished_stack_frames], depth);

        // chunk after recursive call, as above, after adjusting
        // stack frames/depth etc
      }
      // XXX should we delete 'else' and always go to the 'Done' line
      // even for non-trivial array segments? (might need to
      // generalise (un)highlight code below
      else {
        chunker.add('Done', (vis, a, cur_left, cur_right) => {
          if (cur_left === cur_right) {
            unhighlight(vis, cur_left, true);
            highlight(vis, cur_left, sortColor) // XXX check color
          }
          // Move the current stack frame to finished_stack_frames when this recursion level completes
          finished_stack_frames.push(real_stack.pop());
        }, [A, left, right], depth);
      }

      simple_stack.shift();
      
      // Move the current stack frame to finished_stack_frames when this recursion level ends
      // This ensures proper stack visualization as we return from recursion
      if (real_stack.length > 0) {
        finished_stack_frames.push(real_stack.pop());
      }
      
      return A; // Facilitates testing
    }


    // ----------------------------------------------------------------------------------------------------------------------------
    // Perform actual quicksort
    // ----------------------------------------------------------------------------------------------------------------------------
    //chunker.add('Main', (vis, a, b, cur_real_stack, cur_finished_stack_frames) => {
    //vis.array.set(a, 'msort_arr_td');
    // vis.array.setStack([]); // used for QS-like stack visualisation
    //}, [A, B, real_stack, finished_stack_frames], 0);


    // We compute and fix the max value in each array so they don't get re-scaled as we
    // shuffle elements between arrays
    const maxValue = entire_num_array.reduce(
      (acc, curr) => (acc < curr ? curr : acc), 0);

    const msresult = MergeSort(0, entire_num_array.length - 1, 0);
    // const result = QuickSort(entire_num_array, 0, entire_num_array.length - 1, 0);

    // assert(real_stack.length === 0);

    // Fade out final node - fixes up stack
    // chunker.add(
    // QS_BOOKMARKS.SHARED_done_qs,
    // (vis, idx) => {
    // vis.array.setStackDepth(0);
    // vis.array.fadeOut(idx);
    // // fade all elements back in for final sorted state
    // for (let i = 0; i < entire_num_array.length; i += 1) {
    // vis.array.fadeIn(i);
    // }
    // vis.array.clearVariables();
    // vis.array.setStack(derive_stack(real_stack, finished_stack_frames));
    // },
    // [entire_num_array.length - 1],
    // 0);
    chunker.add('Done', (vis) => {
      for (let i = 0; i < entire_num_array.length; i++) {
        highlight(vis, i, doneColor);
      }
      // Clear the stack visualization when algorithm is complete
      if (vis.stack) {
        vis.stack.setStackDepth(0);
        vis.stack.setStack([]);
      } else {
        vis.array.setStackDepth(0);
        vis.array.setStack([]);
      }
    }, [], 0);

    return msresult;
  }
}


