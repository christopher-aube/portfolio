export default {
    random: function (max, min) {
        min = min || 0;
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
};