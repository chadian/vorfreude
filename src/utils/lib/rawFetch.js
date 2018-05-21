import Flickr from "flickr-sdk/flickr-sdk";
import env from "../../../config/environment";
import { take } from "ramda";

const flickr = new Flickr(env.FLICKR_API_KEY);

export default async function(searchTerms) {
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
};

function shuffle(list) {
  let idx = -1;
  let len = list.length;
  let position;
  let result = [];
  while (++idx < len) {
    position = Math.floor((idx + 1) * Math.random());
    result[idx] = result[position];
    result[position] = list[idx];
  }
  return result;
}
