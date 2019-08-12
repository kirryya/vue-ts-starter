/*
 * STRICTLY CONFIDENTIAL
 * TRADE SECRET
 * PROPRIETARY:
 *       "Intelinvest" Ltd, TIN 1655386205
 *       420107, REPUBLIC OF TATARSTAN, KAZAN CITY, SPARTAKOVSKAYA STREET, HOUSE 2, ROOM 119
 * (c) "Intelinvest" Ltd, 2018
 *
 * СТРОГО КОНФИДЕНЦИАЛЬНО
 * КОММЕРЧЕСКАЯ ТАЙНА
 * СОБСТВЕННИК:
 *       ООО "Интеллектуальные инвестиции", ИНН 1655386205
 *       420107, РЕСПУБЛИКА ТАТАРСТАН, ГОРОД КАЗАНЬ, УЛИЦА СПАРТАКОВСКАЯ, ДОМ 2, ПОМЕЩЕНИЕ 119
 * (c) ООО "Интеллектуальные инвестиции", 2018
 */

import {Inject, Singleton} from "typescript-ioc";
import {Service} from "../platform/decorators/service";
import {Http} from "../platform/services/http";

@Service("AdviceService")
@Singleton
export class AdviceService {

    // tslint:disable
    readonly INTELINVEST_GLOBALRISK: AdviceTable = {
        [AdviceCodeIntelinvest.ONLY_ONE_CURRENCY]: [
            {
                description: "Основным назначением валютной диверсификации является защита инвесторов от возможных курсовых колебаний денежных средств, а также падения курсов одной валюты по отношению к другой. Имеется в виду обесценивание не только национальной, но и важнейшей мировой валюты: евро или доллара.Так, к примеру, инвестиции только в евро при нестабильности и временном падении его курса могут принести инвестору довольно большие убытки, даже при общей прибыльности его проекта в целом. Отсюда следует, что суть валютной диверсификации подразумевает осуществление инвестирования частями с использованием разных валют: часть в евро, часть в швейцарских франках, часть в долларах или золоте и т.д."
            }
        ],
        [AdviceCodeIntelinvest.NO_GOLD_ETF]: [
            {
                description: "Одной из составляющих частей диверсификации по активам, является золото. В текущих условиях мировой экономики золото всегда было и остается основным способом сбережения капитала для инвестора. При финансовых кризисах и девальвации валют золото не падает в цене, а на долгосрочном горизонте показывает стабильно хорошую доходность."
            }
        ],
        [AdviceCodeIntelinvest.NO_BONDS]: [
            {
                description: "Одной из составляющих частей диверсификации по активам, являются облигации. Облигации – это долговой инструмент инвестирования с определенным сроком существования. Облигации выпускаются для того чтобы привлечь денежные средства в какой-нибудь проект, компанию, муниципалитет и т.д. Покупая облигацию, инвестор знает, когда облигация погашается, когда происходят выплаты по ней, на какой доход он может рассчитывать. Все проценты по облигациям выплачиваются на брокерский счет. Как правило, это происходит периодично, раз в полгода или раз в 3 месяца. В отличие от вклада, облигацию нельзя досрочно погасить, однако можно обналичить прибыль по ней."
            }
        ],
        [AdviceCodeIntelinvest.NO_NOTIFICATIONS]: [
            {
                description: "Уведомления о просадке цен на бумаги позволят вам вовремя продать бумагу для закрепления прибыли или приобрести новые акции с целью усреднения цены. Уведомления о превышении ожидаемой вами максимальной цены на акцию может быть сигналом для их продажи, так как компания возможно уже исчерпала свой потенциал роста.Рекомендуем установить диапазон целевых цен для всех ваших активов. Меню Настройки - Уведомления."
            }
        ],
        [AdviceCodeIntelinvest.AVG_YIELD_BELOW_DEPOSIT]: [
            {
                description: "В условиях, когда доходность портфеля ниже ставок по депозитам, вы теряете возможность заработка на более надежных и более доходных активах. Также при такой ситуации есть риск просадки доходности ниже уровня инфляции."
            }
        ],
        [AdviceCodeIntelinvest.SECTOR_ABOVE_20]: [
            {
                description: "Слишком высокая доля инвестиций в одной отрасли резко повышает риск потери денег при ее кризисе. Диверсификация по независящим друг от друга секторам экономики позволяет снизить риск."
            }
        ],
        [AdviceCodeIntelinvest.SECTOR_ABOVE_35]: [
            {
                description: "Слишком высокая доля инвестиций в одной отрасли резко повышает риск потери денег при ее кризисе. Диверсификация по независящим друг от друга секторам экономики позволяет снизить риск."
            }
        ],
        [AdviceCodeIntelinvest.SECTOR_ABOVE_70]: [
            {
                description: "Слишком высокая доля инвестиций в одной отрасли резко повышает риск потери денег при ее кризисе. Диверсификация по независящим друг от друга секторам экономики позволяет снизить риск."
            }
        ],
        [AdviceCodeIntelinvest.SHARE_ABOVE_10]: [
            {
                description: "Диверсификация по компаниям позволяет снизить риск при резком просадке цены акций отдельной компании. При выборе компаний для инвестирования также учитывайте необходимость диверсификации по секторам экономики, в которых данные компании находятся."
            }
        ],
        [AdviceCodeIntelinvest.SHARE_ABOVE_20]: [
            {
                description: "Диверсификация по компаниям позволяет снизить риск при резком просадке цены акций отдельной компании. При выборе компаний для инвестирования также учитывайте необходимость диверсификации по секторам экономики, в которых данные компании находятся."
            }
        ],
        [AdviceCodeIntelinvest.SHARE_ABOVE_40]: [
            {
                description: "Диверсификация по компаниям позволяет снизить риск при резком просадке цены акций отдельной компании. При выборе компаний для инвестирования также учитывайте необходимость диверсификации по секторам экономики, в которых данные компании находятся."
            }
        ],
        [AdviceCodeIntelinvest.AVG_BOND_YIELD_BELOW_DEPOSIT]: [
            {
                description: "В условиях, когда доходность облигаций ниже ставок по депозитам, вы теряете возможность заработка на более доходных, но надежных активах. Также при такой ситуации есть риск просадки доходности ниже уровня инфляции."
            }
        ]
    };

    // tslint:enable

    @Inject
    private http: Http;

    getAdvice(adviceUnicCode: AdviceUnicCode): Advice {
        const problem = this.getProblemIntelinvest(adviceUnicCode);
        let advice: Advice = null;
        return advice = {
            ...this.INTELINVEST_GLOBALRISK[adviceUnicCode.code][0], problem
        };
    }

    getProblemIntelinvest(adviceUnicCode: AdviceUnicCode): string {
        switch (adviceUnicCode.code) {
            case AdviceCodeIntelinvest.ONLY_ONE_CURRENCY:
                return `В вашем портфеле всего лишь одна валюта`;
            case AdviceCodeIntelinvest.NO_GOLD_ETF:
                return `В вашем портфеле всего лишь одна валюта`;
            case AdviceCodeIntelinvest.NO_BONDS:
                return `В вашем портфеле нет облигаций`;
            case AdviceCodeIntelinvest.NO_NOTIFICATIONS:
                return `В вашем аккаунте не настроены уведомления по ценам`;
            case AdviceCodeIntelinvest.AVG_YIELD_BELOW_DEPOSIT:
                return `Ваша среднегодовая доходность ниже ставок по депозитам`;
            case AdviceCodeIntelinvest.SECTOR_ABOVE_20:
                return `В вашем портфеле есть сектор ${adviceUnicCode.param}, занимающий более 20% всех ваших инвестиций`;
            case AdviceCodeIntelinvest.SECTOR_ABOVE_35:
                return `В вашем портфеле есть сектор ${adviceUnicCode.param}, занимающий более 35% всех ваших инвестиций`;
            case AdviceCodeIntelinvest.SECTOR_ABOVE_70:
                return `В вашем портфеле есть сектор ${adviceUnicCode.param}, занимающий более 70% всех ваших инвестиций`;
            case AdviceCodeIntelinvest.SHARE_ABOVE_10:
                return `В вашем портфеле есть акция ${adviceUnicCode.param}, занимающая более 10% всех ваших инвестиций`;
            case AdviceCodeIntelinvest.SHARE_ABOVE_20:
                return `В вашем портфеле есть акция ${adviceUnicCode.param}, занимающая более 20% всех ваших инвестиций`;
            case AdviceCodeIntelinvest.SHARE_ABOVE_40:
                return `В вашем портфеле есть акция ${adviceUnicCode.param}, занимающая более 40% всех ваших инвестиций`;
            case AdviceCodeIntelinvest.AVG_BOND_YIELD_BELOW_DEPOSIT:
                return `Среднегодовая доходность облигаций в вашем портфеле меньше ставки по депозитам`;
        }
        throw new Error(`Неизвестный тип проблемы`);
    }

    /**
     * Устанавливаем уровень риска
     * @param riskLevel уровень риска
     */
    async setRiskLevel(riskLevel: string): Promise<void> {
        return this.http.post(`/user/risk-level`, riskLevel);
    }

    /**
     * Загружаем данные по советам
     * @param portfolioId идентификатор портфеля
     */
    async loadAdvices(portfolioId: string): Promise<AdviceUnicCode[]> {
        return this.http.get(`/advice/${portfolioId}`);
    }
}
export interface AdviceTable {
    [key: string]: Advice[];
}
export interface AdviceUnicCode {
    code: string;
    param: string;
}
export interface Advice {
    problem?: string;
    description: string;
}

export enum AdviceCodeIntelinvest {
    ONLY_ONE_CURRENCY = "ONLY_ONE_CURRENCY",
    NO_GOLD_ETF = "NO_GOLD_ETF",
    NO_BONDS = "NO_BONDS",
    NO_NOTIFICATIONS = "NO_NOTIFICATIONS",
    AVG_YIELD_BELOW_DEPOSIT = "AVG_YIELD_BELOW_DEPOSIT",
    SECTOR_ABOVE_20 = "SECTOR_ABOVE_20",
    SECTOR_ABOVE_35 = "SECTOR_ABOVE_35",
    SECTOR_ABOVE_70 = "SECTOR_ABOVE_70",
    SHARE_ABOVE_10 = "SHARE_ABOVE_10",
    SHARE_ABOVE_20 = "SHARE_ABOVE_20",
    SHARE_ABOVE_40 = "SHARE_ABOVE_40",
    AVG_BOND_YIELD_BELOW_DEPOSIT = "AVG_BOND_YIELD_BELOW_DEPOSIT"
}