export type Photo = {
  id: string;
  url_o: string;
  isBlocked: boolean;
};

export type WithSearchTerms = {
  searchTerms: string;
}

export type WithOptionalBlob = {
  blob: Blob | undefined;
}

export type WithSeenCount = {
  seenCount?: number;
};