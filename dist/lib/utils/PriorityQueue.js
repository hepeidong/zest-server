/**优先队列结点数据结构 */
class HeapNode {
    constructor(val) {
        this._value = val;
    }
    set value(val) { this._value = val; }
    get value() { return this._value; }
    static ParentIndex(index) { return Math.floor((index - 1) / 2); }
    static LeftIndex(index) { return index * 2 + 1; }
    static RightIndex(index) { return index * 2 + 2; }
}
/**优先队列
 * 优先队列采用二叉堆存储结构（数组存储结构的二叉树），优先从左节点存储数据，第一个根节点默认也存储数据（这个可以改成第一个结点不存储数据都没问题）
 *
 * 优先级规则可以自由的设定，通过new PriorityQueue<T>((a, b) => { return a > b; })这种模式，传入优先级规则
 *
 * 若传入的规则中a > b，则是从大到小排列，反之，从小到大排列
 */
export class PriorityQueue {
    constructor(compareFn) {
        this._length = 0;
        this._compareFn = compareFn;
    }
    get Front() { return this[0].value; }
    get length() { return this._length; }
    [Symbol.iterator]() {
        let index = 0;
        let that = this;
        return {
            next: function () {
                if (index < that.length) {
                    let value = that[index].value;
                    index++;
                    return { value: value, done: false };
                }
                else {
                    return { done: true };
                }
            }
        };
    }
    /**
     * 压入元素，从左子树开始，左子树在数组中的下标为2*i+1，因此相应的父节点下标为(i-1)/2，右子树的下标为2*i+2，相应的父节点下标为(i-2)/2
     * @param e 压入的元素
     */
    push(e) {
        let node = new HeapNode(e);
        this[this._length++] = node;
        this.buildMaxHeap();
    }
    /**构建最大堆结点，把最大堆结点上浮到队头 */
    buildMaxHeap() {
        let index = this.length - 1;
        if (index <= 0)
            return;
        let parentIndex = HeapNode.ParentIndex(index);
        while (parentIndex >= 0 && this._compareFn && this._compareFn(this[index].value, this[parentIndex].value)) {
            this.swap(index, parentIndex);
            index = parentIndex;
            parentIndex = HeapNode.ParentIndex(index);
        }
    }
    /**
     * 出队列，把队列的根节点删除，并返回删除的元素，删除的过程是把根节点不断的下沉到最后的位置，然后删除最后一个元素
     */
    pop() {
        this.searchHeap(0);
        const node = this[--this._length];
        delete this[this.length];
        return node ? node.value : null;
    }
    /**
     * 遍历优先队列
     * @param callback 如果返回false结束遍历；如果返回true或者没有返回值，则继续遍历，直到队列被遍历完
     */
    forEach(callback) {
        for (let i = 0; i < this.length; ++i) {
            const node = this[i];
            const flag = callback(node.value, i, this);
            if (typeof flag === "boolean") {
                if (!flag)
                    return;
            }
        }
    }
    /**
     * 获取索引指向的元素，并不会删除该元素
     * @param index
     * @returns
     */
    back(index) {
        if (index < 0 || index >= this.length) {
            return undefined;
        }
        const node = this[index];
        if (node) {
            return node.value;
        }
        return undefined;
    }
    /**
     * 删除索引指向的元素
     * @param index
     * @returns
     */
    delete(index) {
        if (index < 0 || index >= this.length) {
            return undefined;
        }
        let ele = this[index].value;
        if (index === this.length - 1) {
            delete this[this._length--];
            return ele;
        }
        for (let i = index; i < this.length - 1; ++i) {
            this[i] = this[i + 1];
        }
        delete this[--this._length];
        return ele;
    }
    /**
     * 移除特定的元素
     * @param e
     * @returns
     */
    remove(e) {
        for (let i = 0; i < this.length; ++i) {
            const node = this[i];
            if (node.value === e) {
                this.delete(i);
                return true;
            }
        }
        return false;
    }
    /**清空队列 */
    clear() {
        for (let i = 0; i < this.length; ++i) {
            delete this[i];
        }
        this._length = 0;
    }
    /**互换结点 */
    swap(a, b) {
        let temp = this[a];
        this[a] = this[b];
        this[b] = temp;
    }
    /**搜寻和维护堆结点，把堆结点下沉到最后的叶节点 */
    searchHeap(index) {
        let lIndex = HeapNode.LeftIndex(index);
        let rIndex = HeapNode.RightIndex(index);
        let endIndex = this.length - 1;
        while (1) {
            if (rIndex <= endIndex) {
                if (this._compareFn && this._compareFn(this[lIndex].value, this[rIndex].value)) {
                    this.swap(index, lIndex);
                    index = lIndex;
                }
                else {
                    this.swap(index, rIndex);
                    index = rIndex;
                }
            }
            else if (lIndex <= endIndex) {
                this.swap(index, lIndex);
                index = lIndex;
            }
            else {
                break;
            }
            lIndex = HeapNode.LeftIndex(index);
            rIndex = HeapNode.RightIndex(index);
        }
        if (index != endIndex) {
            this.swap(index, endIndex);
        }
    }
}
