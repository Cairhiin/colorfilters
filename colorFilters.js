function loadImageURL(canvas, url) {
  let image = document.createElement('img');
  let cx = canvas.getContext('2d');
  canvas.style.display = 'block';
  image.addEventListener('load', function() {
    cx.canvas.width = image.width;
    cx.canvas.height = image.height;
    cx.clearRect(0, 0, canvas.width, canvas.height);
    cx.drawImage(image, 0, 0);
  });
  image.src = url;
}

function sepia(canvas, imgData, amount) {
  let fraction = amount === undefined ? 1 : amount;
  let cx = canvas.getContext('2d');
  let colorRed;
  let colorGreen;
  let colorBlue;
  for (let i = 0; i < imgData.data.length; i += 4) {
    colorRed = imgData.data[i];
    colorGreen = imgData.data[i + 1];
    colorBlue = imgData.data[i + 2];
    imgData.data[i] = (colorRed * (1 - fraction)) + ((Math.min((colorRed * 0.393) +
                        (colorGreen * 0.769) + (colorBlue * 0.189), 255)) * fraction);
    imgData.data[i + 1] = (colorGreen * (1 - fraction)) + ((Math.min((colorRed * 0.349) +
                        (colorGreen * 0.686) + (colorBlue * 0.168), 255)) * fraction);
    imgData.data[i + 2] = (colorBlue * (1 - fraction)) + ((Math.min((colorRed * 0.272) +
                        (colorGreen * 0.534) + (colorBlue * 0.131), 255)) * fraction);
  }
  cx.putImageData(imgData, 0, 0);
  return canvas.toDataURL();
}

function grayScale(canvas, imgData, amount) {
  let fraction = amount === undefined ? 1 : amount;
  let cx = canvas.getContext('2d');
  let avg;
  for (let i = 0; i < imgData.data.length; i += 4) {
    avg = (imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 2]) / 3;
    imgData.data[i] = (fraction * avg) + ((imgData.data[i]) * (1 - fraction));
    imgData.data[i + 1] = (fraction * avg) + ((imgData.data[i + 1]) * (1 - fraction));
    imgData.data[i + 2] = (fraction * avg) + ((imgData.data[i + 2]) * (1 - fraction));
  }
  cx.putImageData(imgData, 0, 0);
  return canvas.toDataURL();
}

let canvas = document.querySelector('canvas');
let cx = canvas.getContext('2d');
let button = document.querySelectorAll('input')[2];
let percentage = document.querySelectorAll('input')[1];
let input = document.querySelectorAll('input')[0];


input.addEventListener('change', function() {
  if (input.files.length === 0) return;
  let image = document.querySelector('#wrapper img');
  image.src = '';
  let reader = new FileReader();
  reader.addEventListener('load', function() {
    loadImageURL(canvas, reader.result);
  });
  reader.readAsDataURL(input.files[0]);
});

button.addEventListener('click', function() {
  let data = cx.getImageData(0, 0, cx.canvas.width, cx.canvas.height);
  let image = document.querySelector('img');
  image.src = '';
  canvas.style.display = 'none';
  percentage = (percentage.value || 100) / 100;
  image.src = sepia(canvas, data, percentage);
});
