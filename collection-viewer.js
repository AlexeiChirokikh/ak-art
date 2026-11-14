const viewer = document.querySelector('#viewer');
const image = document.querySelector('#viewer-img');
const download = document.querySelector('#viewer-download');
const close = document.querySelector('#close-viewer');
const items = [...document.querySelectorAll('.collection-work')];
let selected = 0;
let opener;

function show(index) {
  selected = (index + items.length) % items.length;
  const item = items[selected];
  const preview = item.querySelector('[data-preview]');
  const original = item.querySelector('a[download]');
  image.src = preview.dataset.preview;
  image.alt = preview.querySelector('img').alt;
  download.href = original.href;
  download.download = original.download;
  document.querySelector('#viewer-title').textContent = preview.dataset.workLabel;
  document.querySelector('#viewer-count').textContent = (selected + 1) + ' / ' + items.length;
}

items.forEach((item, index) => {
  item.querySelector('[data-preview]').addEventListener('click', event => {
    event.preventDefault();
    opener = event.currentTarget;
    show(index);
    viewer.showModal();
    document.body.classList.add('viewer-open');
    close.focus();
  });
});
close.addEventListener('click', () => viewer.close());
viewer.addEventListener('close', () => {
  document.body.classList.remove('viewer-open');
  opener?.focus();
});
document.querySelector('#previous').addEventListener('click', () => show(selected - 1));
document.querySelector('#next').addEventListener('click', () => show(selected + 1));
viewer.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    show(selected + (event.key === 'ArrowRight' ? 1 : -1));
  }
});
