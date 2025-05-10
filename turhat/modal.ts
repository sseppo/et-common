// Get the modal
var modal = document.getElementById("myModal");

// Get the image and insert it inside the modal - use its "alt" text as a caption
var img = document.getElementById("myImg");
var modalImg = document.getElementById("img01") as HTMLImageElement;
var captionText = document.getElementById("caption");

export const openModal = function () {
  if (!modal || !modalImg || !captionText) return;
  modal.style.display = "block";
  modalImg.src = (this as HTMLImageElement).src;
  captionText.innerHTML = this.alt;
};
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0] as HTMLSpanElement;

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  if (!modal) return;
  modal.style.display = "none";
};
