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

let ImageFilters = Object.create(null);

ImageFilters.pixelateImage = function pixelateImage(canvas) {
  this.canvas = canvas;
  this.cx = this.canvas.getContext('2d');
  this.imgData = this.cx.getImageData(0, 0, this.cx.canvas.width, this.cx.canvas.height);
};

ImageFilters.applyFilter = function applyFilter(filter, amount) {
  this.fraction = amount === undefined ? 1 : amount;
  return filter.call(this);
};

ImageFilters.sepia = function sepia() {
  let colorRed;
  let colorGreen;
  let colorBlue;
  for (let i = 0; i < this.imgData.data.length; i += 4) {
    colorRed = this.imgData.data[i];
    colorGreen = this.imgData.data[i + 1];
    colorBlue = this.imgData.data[i + 2];
    this.imgData.data[i] = (colorRed * (1 - this.fraction)) + ((Math.min((colorRed * 0.393) +
                        (colorGreen * 0.769) + (colorBlue * 0.189), 255)) * this.fraction);
    this.imgData.data[i + 1] = (colorGreen * (1 - this.fraction)) + ((Math.min((colorRed * 0.349) +
                        (colorGreen * 0.686) + (colorBlue * 0.168), 255)) * this.fraction);
    this.imgData.data[i + 2] = (colorBlue * (1 - this.fraction)) + ((Math.min((colorRed * 0.272) +
                        (colorGreen * 0.534) + (colorBlue * 0.131), 255)) * this.fraction);
  }
  this.cx.putImageData(this.imgData, 0, 0);
  return this.canvas.toDataURL();
};

ImageFilters.grayScale = function grayScale() {
  let avg;
  for (let i = 0; i < this.imgData.data.length; i += 4) {
    avg = (this.imgData.data[i] + this.imgData.data[i + 1] + this.imgData.data[i + 2]) / 3;
    this.imgData.data[i] = (this.fraction * avg) +
          ((this.imgData.data[i]) * (1 - this.fraction));
    this.imgData.data[i + 1] = (this.fraction * avg) +
          ((this.imgData.data[i + 1]) * (1 - this.fraction));
    this.imgData.data[i + 2] = (this.fraction * avg) +
          ((this.imgData.data[i + 2]) * (1 - this.fraction));
  }
  this.cx.putImageData(this.imgData, 0, 0);
  return this.canvas.toDataURL();
};

// Test code
let canvas = document.querySelector('canvas');
let cx = canvas.getContext('2d');
let button = document.querySelectorAll('input')[2];
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
  let image = document.querySelector('img');
  let percentage = document.querySelectorAll('input')[1];
  percentage = percentage.value / 100;
  image.src = '';
  ImageFilters.pixelateImage(canvas);
  image.src = ImageFilters.applyFilter(ImageFilters.grayScale, percentage);
  canvas.style.display = 'none';
  percentage = (percentage.value || 100) / 100;
});
