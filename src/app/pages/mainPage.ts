import axios from "axios";
import {Component, UI} from "../app/ui";

@Component({
    template: `
      <v-container fluid >
      main page
      events size: {{ events.length }}
      <v-simple-table>
        <template>
          <thead>
          <tr>
            <th class="text-left">
              Дата
            </th>
            <th class="text-left">
              Сумма
            </th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="item in events"
              :key="item.date"
          >
            <td>{{ events.date }}</td>
            <td>{{ events.totalAmount }}</td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
      <!-- todo вывести таблицу с событиями, колонки: Дата (date), Сумма (totalAmount), Количество (quantity), Название (label), Комментарий (comment), Период (period) -->
      </v-container>
    `
})
export class MainPage extends UI {

    private events: any = [];

    async created(): Promise<void> {
        this.events = (await axios.get("http://localhost:3004/events")).data;
    }
}
