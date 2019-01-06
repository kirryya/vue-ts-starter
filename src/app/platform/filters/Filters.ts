import {Decimal} from "decimal.js";
import {BigMoney} from "../../types/bigMoney";
import {DateFormat, DateUtils} from "../../utils/dateUtils";

const DEFAULT_SCALE = 2;
const MAX_SCALE = 3;
const DF = new Intl.NumberFormat("ru", {minimumFractionDigits: DEFAULT_SCALE, maximumFractionDigits: DEFAULT_SCALE});
const DF_NO_SCALE = new Intl.NumberFormat("ru", {maximumFractionDigits: MAX_SCALE});

export class Filters {

    static formatMoneyAmount(value: string, needRound?: boolean, scale?: number): string {
        if (!value) {
            return "0.00";
        }
        const amount = new BigMoney(value);
        if (needRound) {
            return DF.format(amount.amount.toDP(DEFAULT_SCALE, Decimal.ROUND_HALF_UP).toNumber());
        } else {
            return DF_NO_SCALE.format(scale ? amount.amount.toDP(scale, Decimal.ROUND_HALF_UP).toNumber() : amount.amount.toNumber());
        }
    }

    static formatNumber(value: string): string {
        if (!value) {
            return "0.00";
        }
        return DF.format(new Decimal(value).toDP(DEFAULT_SCALE, Decimal.ROUND_HALF_UP).toNumber());

    }

    /**
     * Фильтр форматирования даты возможностью указать произвольный формат
     * @param {string} date        дата
     * @param {string} format      формат отображаемой даты
     * @returns {string} отформатированая дата
     */
    static formatDate(date: string, format: string = DateFormat.DATE): string {
        return DateUtils.parseDate(date).format(format);
    }

    static declension(count: number, one: string, two: string, five: string): string {
        count = Math.abs(count);
        count %= 100;
        if (count >= 5 && count <= 20) {
            return five;
        }
        count %= 10;
        if (count === 1) {
            return one;
        }
        if (count >= 2 && count <= 4) {
            return two;
        }
        return five;
    }
}
