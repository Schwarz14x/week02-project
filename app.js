let thumbContainer = document.getElementById("thumb-container");
let currentImageIndex = 0;
const displayElem = document.getElementById("display");
let images;

function init() {
  fetchImages();
}

async function fetchImages(query = "Night city") {
  let response = await fetch(
    `https://api.unsplash.com/search/photos?page=1&query=${query}&client_id=OmG0FZqCP8A7GhQjYOIs8mqplMHO4OD0xWwoopV1CaA`
  );
  let data = await response.json();
  images = data.results;
  updateDisplayImage(images[currentImageIndex]);
  createThumbnails();
}

function createThumbnails() {
  thumbContainer.innerHTML = "";
  images.forEach((image, index) => {
    let thumbImg = document.createElement("img");

    thumbImg.setAttribute("src", image.urls.thumb);
    thumbImg.setAttribute("alt", image.alt_description);
    thumbImg.setAttribute("tabindex", "0");
    thumbImg.classList.add("thumb-image");
    thumbContainer.appendChild(thumbImg);
    thumbImg.addEventListener("click", function () {
      currentImageIndex = index;
      updateDisplayImage(image);
      document.getElementById("announcer").textContent = image.alt_description;
    });
    thumbImg.addEventListener("keydown", function (event) {
      document.getElementById("announcer").textContent = image.alt_description;
      if (event.key === "Enter") {
        currentImageIndex = index;
        updateDisplayImage(image);
      }
    });
  });
}

function updateScrollBar() {
  let thumbnails = thumbContainer.querySelectorAll(".thumb-image");
  let activeThumbnail = thumbnails[currentImageIndex];
  console.log(activeThumbnail);

  if (activeThumbnail) {
    const thumbRect = activeThumbnail.getBoundingClientRect();
    const containerRect = thumbContainer.getBoundingClientRect();

    let scrollLeftPos =
      thumbContainer.scrollLeft +
      thumbRect.left -
      containerRect.left -
      (containerRect.width / 2 - thumbRect.width / 2);

    thumbContainer.scrollTo({
      left: scrollLeftPos,
      behavior: "smooth",
    });
  }
}

function updateDisplayImage(image) {
  let newDisplayImage = document.createElement("img");
  newDisplayImage.setAttribute("src", image.urls.full);
  newDisplayImage.setAttribute("alt", image.alt_description);
  newDisplayImage.style.animation = "slideIn 0.7s forwards";
  newDisplayImage.style.position = "absolute";

  let currentDisplayImage = displayElem.firstChild;
  if (currentDisplayImage) {
    currentDisplayImage.style.animation = "slideOut 0.7s backwards";
    newDisplayImage.addEventListener("animationend", function () {
      if (
        currentDisplayImage &&
        currentDisplayImage.parentNode === displayElem
      ) {
        displayElem.removeChild(currentDisplayImage);
      }
    });
  }
  setTimeout(() => {
    updateScrollBar();
  }, 50);
  displayElem.appendChild(newDisplayImage);
  document.getElementById("announcer").textContent = image.alt_description;
}

next.addEventListener("click", function () {
  selectNextImage(1);
});
prev.addEventListener("click", function () {
  selectNextImage(-1);
});

thumbContainerHideButton.addEventListener("click", function () {
  thumbContainer.classList.toggle("hidden");
  if (thumbContainer.classList.contains("hidden")) {
    thumbContainerHideButton.classList.add(
      "thumbContainerHideButton-thumbnailsHidden"
    );
  } else {
    thumbContainerHideButton.classList.remove(
      "thumbContainerHideButton-thumbnailsHidden"
    );
  }
});

function selectNextImage(index) {
  currentImageIndex += index;

  if (currentImageIndex >= images.length) currentImageIndex = 0;
  if (currentImageIndex < 0) currentImageIndex = images.length - 1;
  console.log(currentImageIndex);
  updateDisplayImage(images[currentImageIndex]);
}

window.onload = init;

let touchstartX = 0;
let touchendX = 0;
function handleGesture() {
  let threshold = 50;
  if (touchendX < touchstartX - threshold) {
    console.log("swipedright");
    selectNextImage(1);
  }

  if (touchendX > touchstartX + threshold) {
    console.log("swiped left");
    selectNextImage(-1);
  }
}

displayElem.addEventListener("touchstart", (e) => {
  touchstartX = e.changedTouches[0].screenX;
});

displayElem.addEventListener("touchend", (e) => {
  touchendX = e.changedTouches[0].screenX;
  handleGesture();
});

window.addEventListener("keydown", handleArrowKeyPress);

function handleArrowKeyPress(event) {
  if (event.key === "ArrowRight") {
    selectNextImage(1);
  } else if (event.key === "ArrowLeft") {
    selectNextImage(-1);
  }
}
