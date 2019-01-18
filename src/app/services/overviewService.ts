import {Decimal} from "decimal.js";
import {Container, Inject, Singleton} from "typescript-ioc";
import {Service} from "../platform/decorators/service";
import {Cache} from "../platform/services/cache";
import {Http} from "../platform/services/http";
import {BigMoney} from "../types/bigMoney";
import {EventChartData, HighStockEventsGroup, LineChartItem} from "../types/charts/types";
import {CombinedInfoRequest, Overview, Portfolio} from "../types/types";
import {ChartUtils} from "../utils/chartUtils";
import {IisType, PortfolioAccountType, PortfolioParams, PortfolioParamsResponse} from "./portfolioService";

const PORTFOLIOS_KEY = "PORTFOLIOS";

@Service("OverviewService")
@Singleton
export class OverviewService {

    @Inject
    private http: Http;

    private cacheService = (Container.get(Cache) as Cache);

    private cache: { [key: string]: Portfolio } = {};

    private isInit = false;

    private portfolio: Portfolio = null;

    getPortfolio(): Portfolio {
        if (!this.isInit) {
            this.init();
        }
        return this.portfolio;
    }

    async getById(id: string): Promise<Portfolio> {
        let portfolio = this.cache[id];
        if (!portfolio) {
            console.log("load portfolio: ", id);
            portfolio = await this.loadPortfolio(id);
            this.cache[id] = portfolio;
            return portfolio;
        }
        console.log("return portfolio: ", id);
        return portfolio;
    }

    /**
     * Перезагружает портфель
     * @param id идентификатор портфеля
     */
    async reloadPortfolio(id: string): Promise<Portfolio> {
        const portfolio = await this.loadPortfolio(id);
        this.cache[id] = portfolio;
        return portfolio;
    }

    /**
     * Возвращает данные по комбинированному портфелю
     * @param request
     * @return {Promise<>}
     */
    async getPortfolioOverviewCombined(request: CombinedInfoRequest): Promise<Overview> {
        const overview = await this.http.post<Overview>(`/portfolios/overview-combined`, request);
        // проставляем идентификаторы чтобы работали разворачиваютщиеся блоки в табилицах
        overview.stockPortfolio.rows.forEach((value, index) => value.id = index.toString());
        overview.bondPortfolio.rows.forEach((value, index) => value.id = index.toString());
        return overview;
    }

    async getCostChartCombined(request: CombinedInfoRequest): Promise<any> {
        const data = await this.http.post<LineChartItem[]>(`/portfolios/cost-chart-combined`, request);
        const result: any[] = [];
        data.forEach(value => {
            result.push([new Date(value.date).getTime(), new BigMoney(value.amount).amount.toDP(2, Decimal.ROUND_HALF_UP).toNumber()]);
        });
        return result;
    }

    /**
     * Проставляет флаг combined в портфеле
     * @param {string} id
     * @param {boolean} combined
     * @return {Promise<void>}
     */
    async setCombinedFlag(id: string, combined: boolean): Promise<void> {
        await this.http.post(`/portfolios/${id}/combined`, combined);
    }

    /**
     * Устанавливает выбранный портфель по умолчанию
     * @param {string} id идентификатор портфеля по умолчанию
     * @return {Promise<void>}
     */
    async setDefaultPortfolio(id: string): Promise<void> {
        await this.http.post(`/portfolios/${id}/default`);
    }

    async getCostChart(id: string): Promise<any> {
        const data = await this.http.get<LineChartItem[]>(`/portfolios/${id}/cost-chart`);
        const result: any[] = [];
        data.forEach(value => {
            result.push([new Date(value.date).getTime(), new BigMoney(value.amount).amount.toDP(2, Decimal.ROUND_HALF_UP).toNumber()]);
        });
        return result;
    }

    async getEventsChartDataWithDefaults(id: string): Promise<HighStockEventsGroup[]> {
        return this.getEventsChartData(id);
    }

    async getEventsChartData(id: string): Promise<HighStockEventsGroup[]> {
        const data = await this.http.get<EventChartData[]>(`/portfolios/${id}/events-chart-data`);
        return ChartUtils.processEventsChartData(data);
    }

    async getEventsChartDataCombined(request: CombinedInfoRequest): Promise<HighStockEventsGroup[]> {
        const data = await this.http.post<EventChartData[]>(`/portfolios/events-chart-data-combined`, request);
        return ChartUtils.processEventsChartData(data);
    }

    async getCurrentMoney(portfolioId: string): Promise<string> {
        return await this.http.get<string>(`/portfolios/${portfolioId}/current-money`);
    }

    async saveOrUpdateCurrentMoney(portfolioId: string, currentMoney: string): Promise<void> {
        await this.http.post(`/portfolios/${portfolioId}/current-money`, {currentMoney});
    }

    /**
     * Возвращает данные по портфелю
     * @param {string} id идентификатор портфеля
     * @return {Promise<Portfolio>}
     */
    private async loadPortfolio(id: string): Promise<Portfolio> {
        const portfolioResponse: PortfolioParamsResponse = await this.http.get<PortfolioParamsResponse>(`/portfolios/${id}`);
        const portfolio = {
            ...portfolioResponse,
            accountType: portfolioResponse.accountType ? PortfolioAccountType.valueByName(portfolioResponse.accountType) : null,
            iisType: portfolioResponse.iisType ? IisType.valueByName(portfolioResponse.iisType) : null,
            shareNotes: portfolioResponse.shareNotes ? portfolioResponse.shareNotes : {}
        } as PortfolioParams;
        const overview = await this.http.get<Overview>(`/portfolios/${id}/overview`);
        // проставляем идентификаторы чтобы работали разворачиваютщиеся блоки в табилицах
        overview.stockPortfolio.rows.forEach((value, index) => value.id = index.toString());
        overview.bondPortfolio.rows.forEach((value, index) => value.id = index.toString());
        return {id, portfolioParams: portfolio, overview};
    }

    private init(): void {
        this.cacheService.put(PORTFOLIOS_KEY, this.cache);
        console.log("INIT PORTFOLIO SERVICE");
    }
}