const listLinkMobile = document.querySelector(".list-link-mobile");
let isClose = true;

document.querySelector("#btnMenu").addEventListener("click", () => {
  if (isClose) {
    listLinkMobile.style.display = "flex";
    isClose = false;
  } else {
    listLinkMobile.style.display = "none";
    isClose = true;
  }
});
