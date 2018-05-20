import Component, { tracked } from "@glimmer/component";
import { initStore } from "../../../utils/lib/store";

export default class Settings extends Component {
  didInsertElement() {
    initStore(store => this.store = store);
  }

  @tracked
  store = {}
}
