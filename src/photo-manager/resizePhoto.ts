export default async function resizePhoto(blob, maxSize) {
  const image = await createImageBitmap(blob);
  const { width, height } = capSize(image.width, image.height, maxSize);
  const resized = await createImageBitmap(blob, { resizeQuality: 'high', resizeWidth: width, resizeHeight: height });

  const canvas = new OffscreenCanvas(width, height);
  canvas.getContext('2d').drawImage(resized, 0, 0, width, height);

  image.close();
  resized.close();

  return canvas.convertToBlob({ quality: 100 , type: 'image/jpeg' });
}

function capSize(width, height, max) {
  const resizedDimensions = { width, height };

  if (height > width) {
    resizedDimensions.height = max;
    resizedDimensions.width = width * (max / height);
  } else {
    resizedDimensions.width = max;
    resizedDimensions.height = height * (max / width);
  }

  return resizedDimensions;
}
