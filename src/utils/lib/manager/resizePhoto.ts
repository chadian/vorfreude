export default async function resizePhoto(blob, maxSize) {
  return new Promise((resolve, reject) => {
    let image = new Image();
    image.onerror = reject;

    image.onload = () => {
      let canvas = document.createElement('canvas');
      let { width, height } = capSize(image.width, image.height, maxSize);
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(image, 0, 0, width, height);
      resolve(canvasToBlob(canvas));
    };

    // kicks off `onload`
    image.src = URL.createObjectURL(blob);
  });
}

function capSize(width, height, max) {
  let resizedDimensions = { width, height };

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
    canvas.toBlob((blob) => resolve(blob), 'image/jpeg', quality);
  });
}
