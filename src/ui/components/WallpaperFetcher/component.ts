import Component, { tracked } from "@glimmer/component";
import Flickr from "flickr-sdk/flickr-sdk";
import env from "../../../../config/environment";

const { FLICKR_API_KEY } = env;
const flickr = new Flickr(FLICKR_API_KEY);

export default class WallpaperFetcher extends Component {
  // there is no `didReceieveAttrs` or `didReceiveArgs` hook
  // so this hack will track changes to args and be called
  @tracked("args")
  get didReceiveArgs() {
    const { searchTerms } = this.args;

    if (searchTerms) {
      this.fetchPhotoUrl(this.args.searchTerms)
        .then(url => this.bounds.firstNode.style.backgroundImage = `url(${url})`);
    }

    return "";
  }

  fetchPhotoUrl = async function(searchTerms) {
    const result = await flickr.photos.search({
      safe_search: "1",
      text: searchTerms,
      privacy_filter: "1",
      sort: "interestingness-desc",
      per_page: "500",
      extras: "original_format"
    });

    const photos = result.body.photos.photo || [];

    return result.body.photos.photo
      .map(photo => {
        const { farm, server, id, secret } = photo;
        return `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}_b.jpg`;
      })
      .pop();
  }
}
