/*
 * STRICTLY CONFIDENTIAL
 * TRADE SECRET
 * PROPRIETARY:
 *       "Intelinvest" Ltd, TIN 1655386205
 *       420107, REPUBLIC OF TATARSTAN, KAZAN CITY, SPARTAKOVSKAYA STREET, HOUSE 2, ROOM 119
 * (c) "Intelinvest" Ltd, 2019
 *
 * СТРОГО КОНФИДЕНЦИАЛЬНО
 * КОММЕРЧЕСКАЯ ТАЙНА
 * СОБСТВЕННИК:
 *       ООО "Интеллектуальные инвестиции", ИНН 1655386205
 *       420107, РЕСПУБЛИКА ТАТАРСТАН, ГОРОД КАЗАНЬ, УЛИЦА СПАРТАКОВСКАЯ, ДОМ 2, ПОМЕЩЕНИЕ 119
 * (c) ООО "Интеллектуальные инвестиции", 2019
 */
import {Inject} from "typescript-ioc";
import {Storage} from "../platform/services/storage";
import {StoreKeys} from "../types/storeKeys";
import {LogoutService} from "./logoutService";

/**
 * Монитор простоя приложения
 */
export class InactivityMonitor {

    /** Экземпляр монитора */
    private static instance: InactivityMonitor = new InactivityMonitor();
    /** Сервис для работы с браузерным хранилищем */
    @Inject
    private storage: Storage;
    /** Сервис выхода из приложения */
    @Inject
    private logoutService: LogoutService;
    /** Лимит времени простоя в минутах */
    private timeoutInterval: number;

    /**
     * Приватный конструктор
     */
    private constructor() {
    }

    /**
     * Возвращает экземпляр монитора
     * @return {InactivityMonitor}
     */
    static getInstance(): InactivityMonitor {
        return InactivityMonitor.instance;
    }

    /** Инициализация сервиса */
    start(): void {
        this.timeoutInterval = 30;
        this.updateActionTime();
        this.checkInactivity();
        window.addEventListener("keypress", () => this.updateActionTime());
        window.addEventListener("click", () => this.updateActionTime());
    }

    /**
     * Обновить время последнего действия пользователя
     */
    private updateActionTime(): void {
        this.storage.set(StoreKeys.LAST_ACTION_TIME, Date.now());
    }

    /**
     * Проверить простой приложения
     */
    private checkInactivity(): void {
        setTimeout(() => {
            const lastActionTime = this.storage.get(StoreKeys.LAST_ACTION_TIME, Date.now());
            const thresholdActionTime = new Date().setMinutes(new Date().getMinutes() - this.timeoutInterval);
            if (lastActionTime < thresholdActionTime) {
                this.logoutService.logout();
            } else {
                this.checkInactivity();
            }
        }, 10000);
    }
}
