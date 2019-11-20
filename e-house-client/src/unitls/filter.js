import Vue from "vue";
import format from "date-fns/format";

// console.log(format(new Date(), "yyyy-MM-dd HH:mm:ss"));

Vue.filter("date-format", function (value, formatStr = "YYYY-MM-DD HH:mm:ss") {
    return format(value, formatStr);
});
