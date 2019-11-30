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
import {Inject} from "typescript-ioc";
import {Component, namespace, Prop, UI, Watch} from "../../app/ui";
import {ShowProgress} from "../../platform/decorators/showProgress";
import {BtnReturn} from "../../platform/dialogs/customDialog";
import {Storage} from "../../platform/services/storage";
import {AssetCategory} from "../../services/assetService";
import {ClientInfo} from "../../services/clientService";
import {PortfolioService} from "../../services/portfolioService";
import {TableHeadersState, TABLES_NAME, TablesService} from "../../services/tablesService";
import {TradeService} from "../../services/tradeService";
import {AssetType} from "../../types/assetType";
import {BigMoney} from "../../types/bigMoney";
import {Operation} from "../../types/operation";
import {Asset, AssetPortfolioRow, Pagination, Share, ShareType, StockPortfolioRow, TableHeader} from "../../types/types";
import {CommonUtils} from "../../utils/commonUtils";
import {SortUtils} from "../../utils/sortUtils";
import {TradeUtils} from "../../utils/tradeUtils";
import {MutationType} from "../../vuex/mutationType";
import {StoreType} from "../../vuex/storeType";
import {AddTradeDialog} from "../dialogs/addTradeDialog";
import {AssetEditDialog} from "../dialogs/assetEditDialog";
import {ConfirmDialog} from "../dialogs/confirmDialog";
import {EditShareNoteDialog, EditShareNoteDialogData} from "../dialogs/editShareNoteDialog";
import {ShareTradesDialog} from "../dialogs/shareTradesDialog";
import {PortfolioRowFilter} from "../portfolioRowsTableFilter";

const MainStore = namespace(StoreType.MAIN);

@Component({
    // language=Vue
    template: `
        <v-data-table class="data-table" :headers="headers" :items="filteredRows" item-key="share.id"
                      :search="search" :custom-sort="customSort" :custom-filter="customFilter" :pagination.sync="pagination" expand hide-actions must-sort>
            <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
            <template #headerCell="props">
                <v-tooltip v-if="props.header.tooltip" content-class="custom-tooltip-wrap" bottom>
                    <template #activator="{ on }">
                        <span class="data-table__header-with-tooltip" v-on="on">
                            {{ getHeaderText(props.header) }}
                        </span>
                    </template>
                    <span>
                      {{ props.header.tooltip }}
                    </span>
                </v-tooltip>
                <span v-else>
                    {{ getHeaderText(props.header) }}
                </span>
            </template>
            <template #items="props">
                <tr :class="['selectable', {'bold-row': !props.item.share}]" @dblclick="expandRow(props)" @click.stop>
                    <td>
                        <span v-if="props.item.share" @click="props.expanded = !props.expanded"
                              :class="{'data-table-cell-open': props.expanded, 'path': true, 'data-table-cell': true}"></span>
                    </td>
                    <td v-if="tableHeadersState.company" class="text-xs-left">
                        <span v-if="props.item.share" :class="props.item.quantity !== 0 ? '' : 'line-through'">{{ props.item.share.shortname }}</span>&nbsp;
                        <span v-if="props.item.share && props.item.quantity !== 0"
                              :class="markupClasses(Number(props.item.share.change))">{{ props.item.share.change }}&nbsp;%</span>
                    </td>
                    <td v-if="tableHeadersState.ticker" class="text-xs-left">
                        <stock-link v-if="props.item.share && props.item.assetType === 'STOCK'" :ticker="props.item.share.ticker"></stock-link>
                        <asset-link v-if="props.item.share && props.item.assetType === 'ASSET'" :ticker="String(props.item.share.id)">{{ props.item.share.ticker }}</asset-link>
                    </td>
                    <td v-if="tableHeadersState.quantity" class="text-xs-right ii-number-cell">{{props.item.quantity | quantity(!!props.item.share) }}</td>
                    <td v-if="tableHeadersState.avgBuy" class="text-xs-right ii-number-cell">
                        <v-tooltip content-class="custom-tooltip-wrap" bottom>
                            <template #activator="{ on }">
                                <span class="data-table__header-with-tooltip" v-on="on">
                                    {{ props.item.avgBuy | amount(false, null, false, false) }}
                                </span>
                            </template>
                            <span>
                                Комиссии суммарные {{ props.item.summFee | amount(true) }} <br>
                                Средняя без учета комиссий {{ props.item.avgBuyClean | amount(false, null, false, false) }}
                            </span>
                        </v-tooltip>
                    </td>
                    <td v-if="tableHeadersState.currPrice" class="text-xs-right ii-number-cell">
                        <v-tooltip content-class="custom-tooltip-wrap" bottom>
                            <template #activator="{ on }">
                                <span class="data-table__header-with-tooltip" v-on="on">
                                    <template>{{ props.item.currPrice | amount(false, null, false, false) }}</template>
                                </span>
                            </template>
                            <span v-if="props.item.share">
                                Дата последнего обновления {{ props.item.share.lastUpdateTime | date("DD.MM.YYYY HH:mm:ss") }}
                            </span>
                        </v-tooltip>
                    </td>
                    <td v-if="tableHeadersState.bcost" class="text-xs-right ii-number-cell" v-tariff-expired-hint>{{ props.item.bcost | amount(true) }}</td>
                    <td v-if="tableHeadersState.scost" class="text-xs-right ii-number-cell">{{ props.item.scost | amount(true) }}</td>
                    <td v-if="tableHeadersState.currCost" class="text-xs-right ii-number-cell" v-tariff-expired-hint>{{ props.item.currCost | amount(true) }}</td>
                    <td v-if="tableHeadersState.profitFromDividends" :class="markupClasses(amount(props.item.profitFromDividends))" v-tariff-expired-hint>
                        {{ props.item.profitFromDividends | amount(true) }}
                    </td>
                    <td v-if="tableHeadersState.profitFromDividendsPercent" :class="markupClasses(Number(props.item.profitFromDividendsPercent))" v-tariff-expired-hint>
                        {{ props.item.profitFromDividendsPercent }}
                    </td>
                    <td v-if="tableHeadersState.rateProfit" :class="markupClasses(amount(props.item.rateProfit))"
                        v-tariff-expired-hint>{{ props.item.rateProfit | amount(true) }}
                    </td>
                    <td v-if="tableHeadersState.rateProfitPercent" :class="markupClasses(Number(props.item.rateProfitPercent))"
                        v-tariff-expired-hint>{{ props.item.rateProfitPercent }}
                    </td>
                    <td v-if="tableHeadersState.exchangeProfit" :class="markupClasses(amount(props.item.exchangeProfit))"
                        v-tariff-expired-hint>{{ props.item.exchangeProfit | amount(true) }}
                    </td>
                    <td v-if="tableHeadersState.exchangeProfitPercent" :class="markupClasses(Number(props.item.exchangeProfitPercent))"
                        v-tariff-expired-hint>{{ props.item.exchangeProfitPercent }}
                    </td>
                    <td v-if="tableHeadersState.profit" :class="markupClasses(amount(props.item.profit))" v-tariff-expired-hint>{{ props.item.profit| amount(true) }}</td>
                    <td v-if="tableHeadersState.percProfit" :class="markupClasses(Number(props.item.percProfit))" v-tariff-expired-hint>{{ props.item.percProfit | number }}</td>
                    <td v-if="tableHeadersState.yearYield" :class="markupClasses(Number(props.item.yearYield))" v-tariff-expired-hint>{{ props.item.yearYield }}</td>
                    <td v-if="tableHeadersState.dailyPl" :class="markupClasses(amount(props.item.dailyPl))" v-tariff-expired-hint>{{ props.item.dailyPl | amount(true) }}</td>
                    <td v-if="tableHeadersState.dailyPlPercent" :class="markupClasses(Number(props.item.dailyPlPercent))" v-tariff-expired-hint>{{ props.item.dailyPlPercent }}</td>
                    <td v-if="tableHeadersState.summFee" class="text-xs-right ii-number-cell">{{ props.item.summFee | amount(true) }}</td>
                    <td v-if="tableHeadersState.percCurrShare" class="text-xs-right ii-number-cell">{{ props.item.percCurrShare | number }}</td>
                    <td class="justify-center layout px-0" @click.stop>
                        <v-menu v-if="props.item.share" transition="slide-y-transition" bottom left>
                            <v-btn slot="activator" flat icon dark>
                                <span class="menuDots"></span>
                            </v-btn>
                            <v-list dense>
                                <v-list-tile v-if="assetEditAllowed(props.item.share)" @click="openAssetEditDialog(props.item.share)">
                                    <v-list-tile-title>
                                        Настроить актив
                                    </v-list-tile-title>
                                </v-list-tile>
                                <v-divider v-if="assetEditAllowed(props.item.share)"></v-divider>
                                <v-list-tile @click="openShareTradesDialog(props.item.share)">
                                    <v-list-tile-title>
                                        Все сделки
                                    </v-list-tile-title>
                                </v-list-tile>
                                <v-list-tile v-if="shareNotes" @click="openEditShareNoteDialog(props.item.share)">
                                    <v-list-tile-title>
                                        Заметка
                                    </v-list-tile-title>
                                </v-list-tile>
                                <v-divider></v-divider>
                                <v-list-tile @click="openTradeDialog(props.item, operation.BUY)">
                                    <v-list-tile-title>
                                        Купить
                                    </v-list-tile-title>
                                </v-list-tile>
                                <v-list-tile @click="openTradeDialog(props.item, operation.SELL)">
                                    <v-list-tile-title>
                                        Продать
                                    </v-list-tile-title>
                                </v-list-tile>
                                <v-list-tile v-if="dividendApplicable(props.item)" @click="openTradeDialog(props.item, operation.DIVIDEND)">
                                    <v-list-tile-title>
                                        Дивиденд
                                    </v-list-tile-title>
                                </v-list-tile>
                                <v-divider></v-divider>
                                <v-list-tile @click="deleteAllTrades(props.item)">
                                    <v-list-tile-title class="delete-btn">
                                        Удалить
                                    </v-list-tile-title>
                                </v-list-tile>
                            </v-list>
                        </v-menu>
                    </td>
                </tr>
            </template>

            <template #expand="props">
                <table class="ext-info" @click.stop v-tariff-expired-hint>
                    <tr>
                        <td>
                            <div class="ext-info__item">
                                Тикер
                                <span class="ext-info__ticker">
                                    <stock-link v-if="props.item.assetType === 'STOCK'" :ticker="props.item.share.ticker"></stock-link>
                                    <asset-link v-if="props.item.assetType === 'ASSET'" :ticker="String(props.item.share.id)">{{ props.item.share.ticker }}</asset-link>
                                </span><br>
                                В портфеле {{ props.item.ownedDays }} {{ props.item.ownedDays | declension("день", "дня", "дней") }}, c {{ props.item.firstBuy | date }}<br>
                                Всего {{ props.item.quantity | quantity(true) }} <span>шт.</span>
                            </div>
                        </td>
                        <td>
                            <div class="ext-info__item">
                                Прибыль по сделкам {{ props.item.exchangeProfit | amount }} <span>{{ portfolioCurrency }}</span><br>
                                Прибыль по сделкам {{ props.item.exchangeProfitPercent | number }} <span>%</span><br>
                                Доходность {{ props.item.yearYield | number }} <span>%</span>
                            </div>
                        </td>
                        <td>
                            <div class="ext-info__item">
                                Стоимость покупок {{ props.item.bcost | amount }} <span>{{ portfolioCurrency }}</span><br>
                                Стоимость продаж {{ props.item.scost | amount }} <span>{{ portfolioCurrency }}</span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="ext-info__item">
                                Курсовая прибыль {{ props.item.rateProfit | amount }} <span>{{ portfolioCurrency }}</span><br>
                                Курсовая прибыль {{ props.item.rateProfitPercent | number }} <span>%</span><br>
                                <template v-if="shareNotes&& shareNotes[props.item.share.ticker]">Заметка {{ shareNotes[props.item.share.ticker] }}</template>
                            </div>
                        </td>
                        <td>
                            <div class="ext-info__item">
                                P/L за день {{ props.item.dailyPl | amount }} <span>{{ portfolioCurrency }}</span><br>
                                P/L за день {{ props.item.dailyPlPercent | number }} <span>%</span><br>
                                Комиссия {{ props.item.summFee | amount }} <span>{{ portfolioCurrency }}</span>
                            </div>
                        </td>
                        <td>
                            <div class="ext-info__item">
                                Дивиденды {{ props.item.profitFromDividends | amount }} <span>{{ portfolioCurrency }}</span><br>
                                Прибыль по дивидендам {{ props.item.profitFromDividendsPercent | number }} <span>%</span>
                            </div>
                        </td>
                    </tr>
                </table>
            </template>
        </v-data-table>
    `
})
export class AssetTable extends UI {

    @Inject
    private localStorage: Storage;
    @Inject
    private tradeService: TradeService;
    @Inject
    private tablesService: TablesService;
    @Inject
    private portfolioService: PortfolioService;
    @MainStore.Action(MutationType.RELOAD_PORTFOLIO)
    private reloadPortfolio: (id: number) => Promise<void>;
    @MainStore.Getter
    private clientInfo: ClientInfo;
    /** Идентификатор портфеля */
    @Prop({default: null, type: String, required: true})
    private portfolioId: string;
    /** Айди портфелей для комбинирования */
    @Prop({default: [], required: false})
    private ids: number[];
    /** Валюта просмотра информации */
    @Prop({required: true, type: String})
    private viewCurrency: string;
    /** Заметки по бумагам портфеля */
    @Prop({default: null, type: Object, required: false})
    private shareNotes: { [key: string]: string };
    /** Список заголовков таблицы */
    @Prop()
    private headers: TableHeader[];
    /** Список отображаемых строк */
    @Prop({default: [], required: true})
    private rows: AssetPortfolioRow[];
    /** Поисковая строка */
    @Prop({required: false, type: String, default: ""})
    private search: string;
    /** Фильтр строк */
    @Prop({
        required: false, type: Object, default: (): PortfolioRowFilter => {
            return {};
        }
    })
    private filter: PortfolioRowFilter;
    /** Список отображаемых строк */
    private filteredRows: AssetPortfolioRow[] = [];
    /** Состояние столбцов таблицы */
    private tableHeadersState: TableHeadersState;
    /** Текущая операция */
    private operation = Operation;
    /** Перечисление типов таблиц */
    private TABLES_NAME = TABLES_NAME;
    /** Типы активов */
    private AssetType = AssetType;
    /** Паджинация для задания дефолтной сортировки */
    private pagination: Pagination = this.localStorage.get("assetPagination", {
        descending: false,
        sortBy: "percCurrShare",
        rowsPerPage: -1
    });

    /**
     * Инициализация данных
     * @inheritDoc
     */
    created(): void {
        /** Установка состояния заголовков таблицы */
        this.setHeadersState();
        this.setFilteredRows();
    }

    @Watch("headers")
    onHeadersChange(): void {
        this.setHeadersState();
    }

    @Watch("rows")
    onRowsChange(): void {
        this.setFilteredRows();
    }

    @Watch("filter", {deep: true})
    async onFilterChange(): Promise<void> {
        this.setFilteredRows();
    }

    setFilteredRows(): void {
        if (this.filter.hideSoldRows) {
            this.filteredRows = [...this.rows.filter(row => !CommonUtils.exists(row.share) || Number(row.quantity) !== 0)];
        } else {
            this.filteredRows = [...this.rows];
        }
    }

    setHeadersState(): void {
        this.tableHeadersState = this.tablesService.getHeadersState(this.headers);
    }

    private async openShareTradesDialog(share: Share): Promise<void> {
        let trades = [];
        if (this.portfolioId) {
            trades = await this.tradeService.getAssetShareTrades(this.portfolioId, share.id);
        } else {
            trades = await this.tradeService.getTradesCombinedPortfolio(share.ticker, this.viewCurrency, this.ids);
        }
        await new ShareTradesDialog().show({trades, ticker: share.ticker, shareType: ShareType.ASSET});
    }

    private assetEditAllowed(share: Share): boolean {
        const asset = share as Asset;
        return asset.userId === this.clientInfo.user.id;
    }

    private async openAssetEditDialog(share: Share): Promise<void> {
        const asset = share as Asset;
        const result = await new AssetEditDialog().show({
            asset: {
                id: asset.id,
                ticker: asset.ticker,
                category: AssetCategory.valueByName(asset.category),
                currency: asset.currency,
                name: asset.name,
                price: asset.price,
                source: asset.source,
                regex: asset.regex,
                tags: asset.tags,
                note: asset.note,
            }, router: this.$router
        });
        if (result) {
            if (result.needUpdate) {
                await this.reloadPortfolio(Number(this.portfolioId));
            }
            share.ticker = result.asset.ticker;
            share.shortname = result.asset.name;
        }
    }

    /**
     * Обновляет заметки по бумага в портфеле
     * @param share
     */
    private async openEditShareNoteDialog(share: Share): Promise<void> {
        const key = `${share.id}${share.ticker}`;
        const data = await new EditShareNoteDialog().show({ticker: share.ticker, note: this.shareNotes[key], shareType: ShareType.ASSET});
        if (data) {
            data.ticker = key;
            await this.editShareNote(data, share.ticker);
        }
    }

    @ShowProgress
    private async editShareNote(data: EditShareNoteDialogData, ticker: string): Promise<void> {
        await this.portfolioService.updateShareNotes(this.portfolioId, this.shareNotes, data);
        this.$snotify.info(`Заметка по активу ${ticker} была успешно сохранена`);
    }

    private async openTradeDialog(stockRow: StockPortfolioRow, operation: Operation): Promise<void> {
        const result = await new AddTradeDialog().show({
            store: this.$store.state[StoreType.MAIN],
            router: this.$router,
            shareId: String(stockRow.share.id),
            quantity: Math.abs(Number(stockRow.quantity)),
            operation,
            assetType: AssetType.ASSET
        });
        if (result) {
            await this.reloadPortfolio(Number(this.portfolioId));
        }
    }

    private async deleteAllTrades(stockRow: StockPortfolioRow): Promise<void> {
        const result = await new ConfirmDialog().show(`Вы уверены, что хотите удалить все сделки по активу "${stockRow.share.shortname}" (${stockRow.quantity} шт.)?`);
        if (result === BtnReturn.YES) {
            await this.deleteAllTradesAndReloadData(stockRow);
        }
    }

    @ShowProgress
    private async deleteAllTradesAndReloadData(stockRow: StockPortfolioRow): Promise<void> {
        await this.tradeService.deleteAllAssetTrades({
            assetId: stockRow.share.id,
            portfolioId: Number(this.portfolioId)
        });
        await this.reloadPortfolio(Number(this.portfolioId));
    }

    private amount(value: string): number {
        if (!value) {
            return 0.00;
        }
        const amount = new BigMoney(value);
        return amount.amount.toNumber();
    }

    @Watch("pagination")
    private paginationChange(): void {
        this.localStorage.set("assetPagination", this.pagination);
    }

    private customSort(items: StockPortfolioRow[], sortby: string, isDesc: boolean): StockPortfolioRow[] {
        return SortUtils.stockSort(items, sortby, isDesc);
    }

    private customFilter(items: StockPortfolioRow[], searchString: string): StockPortfolioRow[] {
        let search = searchString;
        if (CommonUtils.isBlank(search)) {
            return items;
        }
        search = search.toLowerCase();
        return items.filter(row => {
            return row.share && (row.share.shortname.toLowerCase().includes(search) ||
                row.share.ticker.toLowerCase().includes(search) ||
                row.share.price.includes(search) ||
                row.yearYield.includes(search));
        });
    }

    private expandRow(props: any): void {
        if (props.item.share) {
            props.expanded = !props.expanded;
        }
    }

    private getHeaderText(header: TableHeader): string {
        return header.currency ? `${header.text} ${TradeUtils.getCurrencySymbol(this.portfolioCurrency)}` : header.text;
    }

    private markupClasses(amount: number): string[] {
        return TradeUtils.markupClasses(amount);
    }

    private dividendApplicable(stockRow: StockPortfolioRow): boolean {
        const asset = stockRow.share as Asset;
        return asset.shareType === ShareType.STOCK || (["STOCK", "BOND", "ETF"].includes(asset.category) &&
            !(asset.source || "").includes("investfunds.ru"));
    }

    private get portfolioCurrency(): string {
        return TradeUtils.getCurrencySymbol(this.viewCurrency);
    }
}