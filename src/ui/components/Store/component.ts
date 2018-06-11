import Component, { tracked } from "@glimmer/component";
import { addStoreUpdateHandler } from "../../../utils/lib/store";

export default class Settings extends Component {
  didInsertElement() {
    addStoreUpdateHandler(store => (this.store = store));
  }

  @tracked
  store = {}
}
