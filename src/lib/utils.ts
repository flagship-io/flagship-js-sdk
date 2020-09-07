export type DepCompareArgs = { [key: string]: any };

const utilsHelper = {
    deepCompare: (json1: DepCompareArgs, json2: DepCompareArgs): boolean => {
        if (Object.prototype.toString.call(json1) === Object.prototype.toString.call(json2)) {
            if (Object.prototype.toString.call(json1) === '[object Object]' || Object.prototype.toString.call(json1) === '[object Array]') {
                if (Object.keys(json1).length !== Object.keys(json2).length) {
                    return false;
                }
                return Object.keys(json1).every(function (key) {
                    return utilsHelper.deepCompare(json1[key], json2[key]);
                });
            }
            return json1 === json2;
        }
        return false;
    }
};

export default utilsHelper;
