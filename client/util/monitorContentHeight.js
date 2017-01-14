
export default function monitorContentHeight(callback) {
  let previous = 0;
  setInterval(() => {
    const current = document.body.offsetHeight + 100;
    if (current !== previous) {
      previous = current;
      callback(current);
    }
  }, 1000);
}
