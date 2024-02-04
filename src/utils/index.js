/**
 * 生成guid
 * @returns String
 */
export function guid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

/**
 * 生成颜色
 * @returns String
 */
export function getRandomColor() {
    let color = '#';
    for (let i = 0; i < 6; i++) {
        // 16进制的单个字符从0到f
        const random = Math.floor(Math.random() * 16);
        // 将数字转化为16进制，加到颜色代码字符串上
        color += random.toString(16);
    }
    return color;
}

/**
 * 从数组中随机取一个值
 * @returns String
 */
export function getRandomElementFromArray(array) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

/**
 * 判断数组对象中是否存在某个对象 存在就删除 不存在则添加
 * @returns arr
 */
export function updateArrayObject(arr, obj, compareKey) {

    // findIndex 方法来确定对象是否存在于数组中
    const index = arr.findIndex(item => item[compareKey] === obj[compareKey]);

    if (index > -1) {
        // 如果找到了，存在，那就删除
        arr.splice(index, 1);
    } else {
        // 不存在，则添加
        arr.push(obj);
    }
    return arr
}
