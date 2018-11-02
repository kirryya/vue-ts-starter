import Component from "vue-class-component";
import {UI} from "../../../app/ui";

@Component({
    // language=Vue
    template: `
        <div>
            <p>Вы можете импортировать сделки сами, создав CSV-файл следующей структуры:</p>
            <p>
                Файл должен содержать следующие столбцы, в перечисленном порядке:
                <span style="border: 1px solid #929292; background-color: #e6e6e6; padding: 8px; word-wrap: normal; word-break: keep-all; display: block">
                    TYPE;DATE;TICKER;QUANTITY;PRICE;FEE;NKD;NOMINAL;CURRENCY;NOTE;LINK_ID;
                </span>
            </p>
            Поле <b>TYPE</b> может принимать значения:
            <p style="word-wrap: break-word">
                <b>STOCKBUY / STOCKSELL</b> Покупка/Продажа Акции. Поля: тикер, дата, количество, цена, комиссия, заметка, валюта, [id
                связанной сделки]<br/>
                <b>BONDBUY / BONDSELL</b> Покупка/Продажа Облигации. Поля: secid, дата, количество, цена в %, комиссия, НКД, номинал,
                заметка, валюта, [id связанной сделки]<br/>
                <b>COUPON</b> Выплата купона. Поля: тикер, дата, количество, сумма выплаты, заметка, валюта, [id связанной сделки]<br/>
                <b>AMORTIZATION</b> Выплата амортизации. Поля: тикер, дата, количество, сумма выплаты, заметка, валюта, [id связанной
                сделки]<br/>
                <b>DIVIDEND</b> Выплата Дивиденда. Поля: тикер, дата, количество, сумма выплаты, заметка, валюта, [id связанной сделки]<br/>
                <b>MONEYDEPOSIT</b> зачисление денежных средств на счет. Поля: дата, сумма, заметка, валюта, [id связанной сделки]<br/>
                <b>MONEYWITHDRAW</b> вывод денежных средств со счета. Поля: дата, сумма, заметка, валюта, [id связанной сделки]<br/>
                <b>INCOME</b> произвольный доход. Поля: дата, сумма, заметка, валюта, [id связанной сделки]<br/>
                <b>LOSS</b> произвольный расход. Поля: дата, сумма, заметка, валюта, [id связанной сделки]<br/>
                <br/>
                Опциональный параметр <b>LINK_ID</b> (id связанной сделки), для создания связанных сделок, должен быть уникальным и
                совпадать
                у двух связанных сделок. Например, у сделки по покупке акции указываете 1, и у сделки по деньгам тоже 1.
            </p>

            <ul>
                <li>В заметке, по возможности, не используйте спецсимволы</li>
                <li>Проверьте кодировку файла (csv), она должна быть UTF8</li>
                <li>НКД в отчете должен указываться на одну бумагу</li>
                <li>Количество бумаг должно быть указано в штуках (не в лотах)</li>
            </ul>

            <p><b>Шаблоны отчетов с примерами вы можете скачать по ссылками ниже</b></p>
            <p>
                <a href="/static/example.csv">example.csv</a>
                <br></br>
                <a href="/static/example.xlsx">example.xlsx</a>
            </p>
            Используйте шаблон в формате xlsx для формирования таблицы со своими сделками, и просто сохраните результат
            как файл в формате csv (разделители запятая) чтобы использовать его при импорте.
        </div>
    `
})
export class IntelinvestInstruction extends UI {
}