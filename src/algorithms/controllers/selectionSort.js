/* eslint-disable no-multi-spaces,indent */
import ArrayTracer from '../../components/DataStructures/Array/Array1DTracer';
import { colors } from '../../components/DataStructures/colors';

const selColor = colors.apple;   // 当前选择
const minColor = colors.sky;     // 当前最小
const sortedColor = colors.stone;

export default {
  initVisualisers() {
    return {
      array: {
        instance: new ArrayTracer('array', null, 'Array view', { arrayItemMagnitudes: true }),
        order: 0,
      },
    };
  },

  /**
   * @param {object} chunker
   * @param {array} nodes 待排序数组
   */
  run(chunker, { nodes }) {
    const A = [...nodes];
    const n = A.length;

    // 初始化展示
    chunker.add(1, (vis, arr) => {
      vis.array.set(arr, 'selectionsort');
    }, [A]);

    // 外层循环
    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;

      // 高亮当前位置 i
      chunker.add(2, (vis, cur) => {
        vis.array.selectColor(cur, selColor);
        vis.array.assignVariable('i', cur);
      }, [i]);

      // 内层循环找最小值
      for (let j = i + 1; j < n; j++) {
        chunker.add(3, (vis, cur) => {
          vis.array.selectColor(cur, minColor);
          vis.array.assignVariable('j', cur);
        }, [j]);

        if (A[j] < A[minIdx]) {
          minIdx = j;
          chunker.add(4, (vis, newMin) => {
            vis.array.assignVariable('min', newMin);
          }, [minIdx]);
        }

        // 去掉 j 的高亮
        chunker.add(5, (vis, cur) => {
          vis.array.depatch(cur);
          vis.array.removeVariable('j');
        }, [j]);
      }

      // 如果 minIdx 不是 i，就交换
      if (minIdx !== i) {
        [A[i], A[minIdx]] = [A[minIdx], A[i]];
        chunker.add(6, (vis, a, b) => {
          vis.array.swapElements(a, b);
        }, [i, minIdx]);
      }

      // 标记已排序部分
      chunker.add(7, (vis, idx) => {
        vis.array.sorted(idx);
        vis.array.removeVariable('i');
        vis.array.removeVariable('min');
      }, [i]);
    }

    // 最后一个元素也算已排序
    chunker.add(8, (vis, idx) => {
      vis.array.sorted(idx);
    }, [n - 1]);

    return A;
  },
};
