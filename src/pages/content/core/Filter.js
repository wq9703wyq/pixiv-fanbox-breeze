/*
 * @Descripttion: 
 * @version: 
 * @Author: 鹿角兔子
 * @Date: 2022-06-04 23:34:35
 * @LastEditors: 鹿角兔子
 * @LastEditTime: 2022-06-04 23:36:46
 */
export default class Filter {
    form = {};
    constructor(form) {
        this.form = { ...form }
    }
    check(item) {
        return this.checkPrice(item) && this.checkFileType(item) && this.checkDate(item);
    }
    checkPrice(item) {
        const { feeRequired } = item;
        const { price } = this.form;
        if (!price) {
            return !feeRequired
        } else {
            let [lowPrice, topPrice] = price;
            lowPrice = lowPrice || 0;
            topPrice = topPrice || Infinity
            return feeRequired >= lowPrice && feeRequired <= topPrice;
        }
    }
    checkFileType(item) {
        // const fileType = {
        //     image: ['jpg', 'jpeg', 'png', 'gif', 'bmp'],
        //     music: ['wav', 'mp3', 'flac'],
        //     video: ['mp4', 'mov', 'avi'],
        //     compressed: ['zip'],
        //     ps: ['psd', 'clip'],
        //     other: ['txt', 'pdf'],
        // }
        const { extension } = item;
        if (!extension) {
            return true
        }
        return this.form.fileTypeCheckList.includes(extension)
    }
    checkDate(item) {
        const { publishedDatetime } = item;
        const nowDate = new Date(publishedDatetime).getTime();
        const [startDate, endDate] = this.form.date;
        return nowDate >= startDate && nowDate <= endDate
    }
}