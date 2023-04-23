export type Photo = {
  id: string;
  url_o: string;
  isBlocked: boolean;
};

export type WithSearchTerms = {
  searchTerms: string;
}

export type WithBlob = {
  blob: Blob;
}

export type WithSeenCount = {
  seenCount?: number;
};