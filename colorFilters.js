const ImageFilters = Object.create(null);

function truncateValue(value) {
  let returnValue = value;
  if (value < 0) {
    returnValue = 0;
  } else if (value > 255) {
    returnValue = 255;
  }
  return returnValue;
}

ImageFilters.pixelateImage = function pixelateImage(canvas) {
  this.canvas = canvas;
  this.cx = this.canvas.getContext('2d');
  this.imgData = this.cx.getImageData(0, 0, this.cx.canvas.width, this.cx.canvas.height);
};

ImageFilters.applyFilter = function applyFilter(filter, amount) {
  this.mutator = Number(amount) === undefined ? 100 : Number(amount);
  return filter.call(this);
};

ImageFilters.sepia = function sepia() {
  let colorRed;
  let colorGreen;
  let colorBlue;
  this.mutator /= 100;
  for (let i = 0; i < this.imgData.data.length; i += 4) {
    colorRed = this.imgData.data[i];
    colorGreen = this.imgData.data[i + 1];
    colorBlue = this.imgData.data[i + 2];
    this.imgData.data[i] = (colorRed * (1 - this.mutator)) + ((Math.min((colorRed * 0.393) +
                        (colorGreen * 0.769) + (colorBlue * 0.189), 255)) * this.mutator);
    this.imgData.data[i + 1] = (colorGreen * (1 - this.mutator)) + ((Math.min((colorRed * 0.349) +
                        (colorGreen * 0.686) + (colorBlue * 0.168), 255)) * this.mutator);
    this.imgData.data[i + 2] = (colorBlue * (1 - this.mutator)) + ((Math.min((colorRed * 0.272) +
                        (colorGreen * 0.534) + (colorBlue * 0.131), 255)) * this.mutator);
  }
  this.cx.putImageData(this.imgData, 0, 0);
  return this.canvas.toDataURL();
};

ImageFilters.grayScale = function grayScale() {
  let avg;
  this.mutator /= 100;
  for (let i = 0; i < this.imgData.data.length; i += 4) {
    avg = (this.imgData.data[i] + this.imgData.data[i + 1] + this.imgData.data[i + 2]) / 3;
    this.imgData.data[i] = (this.mutator * avg) +
          ((this.imgData.data[i]) * (1 - this.mutator));
    this.imgData.data[i + 1] = (this.mutator * avg) +
          ((this.imgData.data[i + 1]) * (1 - this.mutator));
    this.imgData.data[i + 2] = (this.mutator * avg) +
          ((this.imgData.data[i + 2]) * (1 - this.mutator));
  }
  this.cx.putImageData(this.imgData, 0, 0);
  return this.canvas.toDataURL();
};

ImageFilters.inverse = function inverse() {
  for (let i = 0; i < this.imgData.data.length; i += 4) {
    this.imgData.data[i] = 255 - this.imgData.data[i];
    this.imgData.data[i + 1] = 255 - this.imgData.data[i + 1];
    this.imgData.data[i + 2] = 255 - this.imgData.data[i + 2];
  }
  this.cx.putImageData(this.imgData, 0, 0);
  return this.canvas.toDataURL();
};

ImageFilters.lightBalance = function lightBalance() {
  for (let i = 0; i < this.imgData.data.length; i += 4) {
    this.imgData.data[i] = truncateValue(this.imgData.data[i] + this.mutator);
    this.imgData.data[i + 1] = truncateValue(this.imgData.data[i + 1] + this.mutator);
    this.imgData.data[i + 2] = truncateValue(this.imgData.data[i + 2] + this.mutator);
  }
  this.cx.putImageData(this.imgData, 0, 0);
  return this.canvas.toDataURL();
};

ImageFilters.saturation = function saturation() {
  const contrastFactor = (259 * (this.mutator + 255)) / (255 * (259 - this.mutator));
  for (let i = 0; i < this.imgData.data.length; i += 4) {
    this.imgData.data[i] =
          truncateValue((contrastFactor * (this.imgData.data[i] - 128)) + 128);
    this.imgData.data[i + 1] =
          truncateValue((contrastFactor * (this.imgData.data[i + 1] - 128)) + 128);
    this.imgData.data[i + 2] =
          truncateValue((contrastFactor * (this.imgData.data[i + 2] - 128)) + 128);
  }
  this.cx.putImageData(this.imgData, 0, 0);
  return this.canvas.toDataURL();
};

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
  let incrementer = document.querySelectorAll('input')[1];

  incrementer = (incrementer.value || 100);
  image.src = '';
  ImageFilters.pixelateImage(canvas);
  image.src = ImageFilters.applyFilter(ImageFilters.lightBalance, incrementer);
  canvas.style.display = 'none';
});
