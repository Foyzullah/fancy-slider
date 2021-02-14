const imagesArea = document.querySelector(".images");
const gallery = document.querySelector(".gallery");
const galleryHeader = document.querySelector(".gallery-header");
const searchBtn = document.getElementById("search-btn");
const sliderBtn = document.getElementById("create-slider");
const sliderContainer = document.getElementById("sliders");
// selected image
let sliders = [];

// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = "15674931-a9d714b6e9d654524df198e00&q";

// show images
const showImages = (images) => {
  const imageArrayLength = images.length;
  gallery.innerHTML = "";
  if (0 < imageArrayLength) {
    imagesArea.style.display = "block";
    // show gallery title
    galleryHeader.style.display = "flex";
    images.forEach((image) => {
      let div = document.createElement("div");
      div.className = "col-lg-3 col-md-4 col-xs-6 img-item mb-2";
      div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
      gallery.appendChild(div);
    });
  } else {
    imagesArea.style.display = "block";
    galleryHeader.style.display = "none";
    let errorMsg = document.createElement("h1");
    errorMsg.className = "error-text";
    errorMsg.innerText = `
    Your search item don't found!
    `;
    gallery.appendChild(errorMsg);
  }
  spinnerToggle();
};

const getImages = (query) => {
  gallery.innerHTML = "";
  if ("" != query && isNaN(parseInt(query))) {
    spinnerToggle();
    fetch(
      `https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`
    )
      .then((response) => response.json())
      .then((data) => showImages(data.hits));
  } else {
    imagesArea.style.display = "block";
    galleryHeader.style.display = "none";
    let warningText = document.createElement("h1");
    warningText.className = "warning-text";
    warningText.innerText = `
    Warning! Input value must be a string.
    `;
    gallery.appendChild(warningText);
  }
};

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  element.classList.add("added");

  let item = sliders.indexOf(img);
  if (item === -1) {
    sliders.push(img);
  } else {
    let imagePosition = sliders.indexOf(img);
    sliders.splice(imagePosition, 1);
    element.classList.remove("added");
  }
};

var timer;
const createSlider = () => {
  const duration = document.getElementById("duration").value || 1000;
  if (0 < duration) {
    // check slider image length
    if (sliders.length < 2) {
      alert("Select at least 2 image.");
      return;
    }
    // crate slider previous next area
    sliderContainer.innerHTML = "";
    const prevNext = document.createElement("div");
    prevNext.className =
      "prev-next d-flex w-100 justify-content-between align-items-center";
    prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

    sliderContainer.appendChild(prevNext);
    document.querySelector(".main").style.display = "block";
    // hide image aria
    imagesArea.style.display = "none";
    sliders.forEach((slide) => {
      let item = document.createElement("div");
      item.className = "slider-item";
      item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">
    `;
      sliderContainer.appendChild(item);
    });
    changeSlide(0);
    timer = setInterval(function () {
      slideIndex++;
      changeSlide(slideIndex);
    }, duration);
  } else {
    alert(`The duration can't be negative`);
  }
};

// change slider index
const changeItem = (index) => {
  changeSlide((slideIndex += index));
};

// change slide item
const changeSlide = (index) => {
  const items = document.querySelectorAll(".slider-item");
  if (index < 0) {
    slideIndex = items.length - 1;
    index = slideIndex;
  }

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach((item) => {
    item.style.display = "none";
  });

  items[index].style.display = "block";
};

// searcClickhHandler
const searchClickHandler = (event) => {
  if (13 === event.keyCode || event.buttons) {
    document.querySelector(".main").style.display = "none";
    clearInterval(timer);
    const searchInput = document.getElementById("search").value;
    getImages(searchInput);
    sliders.length = 0;
  }
};

sliderBtn.addEventListener("click", function () {
  createSlider();
});

//spinnerToggle
const spinnerToggle = () => {
  const spinner = document.getElementById("load-spinner");
  spinner.classList.toggle("display-none");
  gallery.classList.toggle("display-none");
};
