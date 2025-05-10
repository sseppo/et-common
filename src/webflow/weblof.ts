export const refreshPage = () => {
  const event = new Event("refreshWS");
  document.dispatchEvent(event);

  //  window.Webflow && window.Webflow.require("ix2").init();
};

export const modal = (message: string) => {
  // Modal functionality
  //  document.addEventListener("DOMContentLoaded", () => {
  const modal = document.querySelector(".js-modal"),
    openModalBtn = document.querySelector(".js-show-modal"),
    closeModalBtns = document.querySelectorAll(".js-close-modal"),
    body = document.querySelector("body");

  const closeModal = () => {
    modal?.classList.remove("modal--opened");
    body?.classList.remove("overflowHidden");
    document.removeEventListener("keydown", handleEscClose);
  };

  const openModal = () => {
    modal?.classList.add("modal--opened");
    body?.classList.add("overflowHidden");
    document.addEventListener("keydown", handleEscClose);
  };

  const handleEscClose = (e) => {
    if (e.key === "Escape") {
      closeModal();
    }
  };

  if (modal) {
    openModalBtn?.addEventListener("click", openModal);
    closeModalBtns.forEach((btn) => btn.addEventListener("click", closeModal));
  }

  document.addEventListener("click", (event) => {
    if (
      modal?.classList.contains("modal--opened") &&
      !event.target?.closest(".modal__content") &&
      !event.target?.closest(".js-show-modal")
    ) {
      closeModal();
    }
  });
};
