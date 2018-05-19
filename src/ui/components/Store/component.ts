import Component, { tracked } from "@glimmer/component";
import { setUpdateHandler } from "../../../utils/lib/store";

export default class Settings extends Component {
  didInsertElement() {
    setUpdateHandler(store =>  this.store = { ...store });
  }

  @tracked
  store = {}
}
