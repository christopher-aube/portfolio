import nums from '../ults/numbers.js';

export default {
    setBackground: function (elem, list) {
        var randImg = nums.random((list.length - 1));

        elem.classList.add(list[randImg]);
    }
};