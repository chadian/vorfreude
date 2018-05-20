import Component, { tracked } from "@glimmer/component";
import Flickr from "flickr-sdk/flickr-sdk";
import { take } from "ramda";
import env from "../../../../config/environment";

const { FLICKR_API_KEY } = env;
const flickr = new Flickr(FLICKR_API_KEY);

export default class WallpaperFetcher extends Component {
  didInsertElement() {
    this.setWallpaper();
  }

  didUpdate() {
    const { refreshPassback } = this.args;
    refreshPassback(() => this.setWallpaper());
    this.setWallpaper();
  }

  setWallpaper() {
    const {
      searchTerms,
      shouldBlur
    } = this.args;

    const wallpaperElement = this.bounds.firstNode;

    if (searchTerms) {
      this.fetchPhotoUrl(this.args.searchTerms)
        .then(url => requestAnimationFrame(() =>
          wallpaperElement.style.backgroundImage = `url(${url})`
        ));
    }

    requestAnimationFrame(() => {
      if (shouldBlur === true) {
        wallpaperElement.classList.add("WallpaperFetcher__blurred");
      } else {
        wallpaperElement.classList.remove("WallpaperFetcher__blurred");
      }
    });
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
