import Component, { tracked } from "@glimmer/component";
import Flickr from "flickr-sdk/flickr-sdk";
import { take } from "ramda";
import env from "../../../../config/environment";

const { FLICKR_API_KEY } = env;
const flickr = new Flickr(FLICKR_API_KEY);

export default class WallpaperFetcher extends Component {
  // there is no `didReceieveAttrs` or `didReceiveArgs` hook
  // so this hack will track changes to args and be called
  @tracked("args")
  get didReceiveArgs() {
    const { refreshPassback } = this.args;
    refreshPassback(() => this.setWallpaper());
    this.setWallpaper();

    return "";
  }

  setWallpaper() {
    const { searchTerms } = this.args;
    if (searchTerms) {
      this.fetchPhotoUrl(this.args.searchTerms).then(url => (this.bounds.firstNode.style.backgroundImage = `url(${url})`));
    }
  }

  fetchPhotoUrl = async function(searchTerms) {
    const result = await flickr.photos.search({
      safe_search: "1",
      text: searchTerms,
      privacy_filter: "1",
      sort: "interestingness-desc",
      per_page: "100",
      extras: "url_o"
    });

    const photos = result.body.photos.photo || [];

    const photoUrls = result.body.photos.photo
      .filter(({ url_o, url_l }) => url_o || url_l)
      .map(({ url_o, url_l }) => url_o || url_l);

    return take(50, shuffle(photoUrls)).pop();
  }
}

const shuffle = function(list) {
  var idx = -1;
  var len = list.length;
  var position;
  var result = [];
  while (++idx < len) {
    position = Math.floor((idx + 1) * Math.random());
    result[idx] = result[position];
    result[position] = list[idx];
  }
  return result;
}
