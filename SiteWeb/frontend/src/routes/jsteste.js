export function initSlider(rootElement) {
  if (!rootElement) return () => {};

  const slider = rootElement.querySelector("#slider");
  const rightButton = rootElement.querySelector(".right");
  const leftButton = rootElement.querySelector(".left");

  if (!slider || !rightButton || !leftButton) return () => {};

  const onRightClick = () => {
    slider.scrollLeft += 300;
  };

  const onLeftClick = () => {
    slider.scrollLeft -= 300;
  };

  rightButton.addEventListener("click", onRightClick);
  leftButton.addEventListener("click", onLeftClick);

  return () => {
    rightButton.removeEventListener("click", onRightClick);
    leftButton.removeEventListener("click", onLeftClick);
  };
}
