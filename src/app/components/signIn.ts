import Component from "vue-class-component";
import {namespace} from "vuex-class/lib/bindings";
import {UI} from "../app/ui";
import {StoreType} from "../vuex/storeType";
import {FooterContent} from "./footerContent";

const MainStore = namespace(StoreType.MAIN);

@Component({
    // language=Vue
    template: `
        <v-container fluid class="sing-in-wrap h100pc pa-0">
            <v-layout align-center class="h100pc">
                <v-layout align-center justify-center column>
                    <v-layout class="paired-section" wrap justify-center>
                        <v-layout class="paired-section__left-section" column align-center>
                            <div class="logo-wrap w100pc">
                                <span class="logo-sign-in auto-cursor"></span>
                                <span class="fs18">
                                    Intelinvest
                                </span>
                            </div>
                            <div>
                                <div class="fs36 alignC">
                                    Здравствуйте!
                                </div>
                                <div class="mt-4 maxW275">
                                    <v-text-field
                                        v-model="signInData.username"
                                        type="text"
                                        :placeholder="'Логин'">
                                    </v-text-field>
                                </div>
                                <div class="margT30 maxW275">
                                    <v-text-field
                                        v-model="signInData.password"
                                        type="password"
                                        :placeholder="'Пароль'">
                                    </v-text-field>
                                </div>
                                <div class="margT30 maxW275">
                                    <v-btn class="btn sign-in-btn" @click="signIn">Войти</v-btn>
                                </div>
                                <div class="margT30 mb-4">
                                    <v-checkbox v-model="signInData.rememberMe"
                                                hide-details
                                                label="Запомнить меня"></v-checkbox>
                                </div>
                            </div>
                        </v-layout>
                        <v-layout class="paired-section__right-section" column>
                            <div class="logo-wrap">
                                <a href="https://intelinvest.ru/prices" target="_blank" class="fs14 decorationNone bold mr-5">Тарифы</a>
                                <a href="https://blog.intelinvest.ru/" target="_blank" class="fs14 decorationNone bold mr-5">Блог</a>
                                <a href="https://telegram.me/intelinvestSupportBot" target="_blank" class="fs14 decorationNone bold mr-5">Поддержка</a>
                            </div>
                            <div class="update-service-dialog__content">
                                <div class="bold fs16">Обновления сервиса</div>
                                <div>
                                    <p>
                                        Мы рады сообщить, что сервис учета инвестиций Intelinvest <br>
                                        стал еще удобнее и функциональнее.
                                    </p>
                                    <p>
                                        Вот список обновлений сервиса за последнее время:<br>
                                    </p>

                                    <ul>
                                        <li>
                                            Добавили паджинацию и улучшили навигацию для таблицы Сделки.
                                        </li>
                                        <li>
                                            Вернули отображение даты последней сделки по бумаге в информации по импорту.
                                        </li>
                                        <li>Перенесли календарь событий из старой версии в новую.</li>
                                        <li>Пользовательские события в календаре (отображаются события по бумагам в портфеле).</li>
                                        <li>Добавили поиск по разделу Котировки.</li>
                                        <li>Пользовательский фильтр в разделе Котировки. Отображает бумаги из выбранного портфеля.</li>
                                        <li>
                                            Исправили много недочетов в новой версии, о которых вы сообщали нам.
                                        </li>
                                    </ul>
                                </div>
                                <div class="mt-3 mb-4">
                                    <a href="https://itunes.apple.com/ru/app/intelinvest-%D1%83%D1%87%D0%B5%D1%82-%D0%B8%D0%BD%D0%B2%D0%B5%D1%81%D1%82%D0%B8%D1%86%D0%B8%D0%B9
                                    /id1422478197?mt=8" title="Загрузите приложение в App Store" target="_blank" class="mr-1">
                                        <img src="./img/help/app-store-badge2.svg" alt="pic">
                                    </a>
                                    <a href="https://play.google.com/store/apps/details?id=ru.intelinvest.portfolio" title="Загрузите приложение в Google Play"
                                    target="_blank" class="ml-2">
                                        <img src="./img/help/google-play-badge2.svg" alt="pic">
                                    </a>
                                </div>
                                <div>
                                    Почитать о всех обновлениях сервиса более подробно вы можете в нашем блоге
                                    <a href="http://blog.intelinvest.ru/" target="_blank" class="decorationNone">blog.intelinvest.ru</a>
                                    Оперативно получить поддержку можно в группе <a href="https://vk.com/intelinvest" target="_blank" class="decorationNone">VK</a>
                                    или <a href="https://www.facebook.com/intelinvest.ru/" target="_blank" class="decorationNone">facebook</a>
                                </div>
                            </div>
                        </v-layout>
                    </v-layout>
                    <v-layout wrap justify-space-between align-center class="pre-footer">
                        <div class="fs14 maxW778">
                            OOO "Интелинвест" использует файлы «cookie», с целью улучшения качества продукта. «Cookie» это небольшие файлы,
                            содержащие информацию о предыдущих посещениях веб-сайта. Если вы не хотите использовать файлы «cookie», измените настройки браузера.
                        </div>
                        <div>
                            <a href="https://itunes.apple.com/ru/app/intelinvest-%D1%83%D1%87%D0%B5%D1%82-%D0%B8%D0%BD%D0%B2%D0%B5%D1%81%D1%82%D0%B8%D1%86%D0%B8%D0%B9
                                /id1422478197?mt=8" title="Загрузите приложение в App Store" target="_blank" class="mr-1">
                                <img src="./img/help/app-store-badge2.svg" alt="pic">
                            </a>
                            <a href="https://play.google.com/store/apps/details?id=ru.intelinvest.portfolio" title="Загрузите приложение в Google Play"
                                target="_blank" class="ml-2">
                                <img src="./img/help/google-play-badge2.svg" alt="pic">
                            </a>
                        </div>
                    </v-layout>
                    <v-layout class="footer">
                        <footer-content></footer-content>
                    </v-layout>
                </v-layout>
            </v-layout>
        </v-container>
    `,
    components:{FooterContent}
})
export class SignIn extends UI {

    private signInData: any = {
        username: null,
        password: null,
        rememberMe: true
    };

    async signIn(): Promise<void> {
        this.$emit("login", this.signInData);
    }

}
