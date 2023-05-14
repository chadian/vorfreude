export default async function resizePhoto(blob, maxSize) {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onerror = reject;
    image.onload = () => resolve(image);
    // kicks off `onload`
    image.src = URL.createObjectURL(blob);
  });

  const canvas = document.createElement('canvas');
  const { width, height } = capSize(image.width, image.height, maxSize);
  canvas.width = width;
  canvas.height = height;
  canvas.getContext('2d').drawImage(image, 0, 0, width, height);
  const resizedImageBlob = await canvasToBlob(canvas);
  return resizedImageBlob;
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

function canvasToBlob(canvas, quality = 1) {
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg', quality);
    } catch (e) {
      reject(e);
    }
  });
}
