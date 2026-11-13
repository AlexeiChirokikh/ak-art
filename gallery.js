const artworks = [
  { src: 'assets/artwork-01.jpg', title: 'The Offering', alt: 'A figure extending an orange sphere in an expressive, textured composition' },
  { src: 'assets/artwork-02.jpg', title: 'The Last Human Supper', alt: 'A panoramic dining scene with a human figure and robots' },
  { src: 'assets/artwork-03.jpg', title: 'Clockwork Citrus', alt: 'An orange sphere merging with intricate blue mechanical forms' }
];
const viewer = document.querySelector('#viewer');
const viewerImage = document.querySelector('#viewer-img');
let selected = 0;
let opener;
function showArtwork(index) {
  selected = (index + artworks.length) % artworks.length;
  const artwork = artworks[selected];
  viewerImage.src = artwork.src;
  viewerImage.alt = artwork.alt;
  document.querySelector('#viewer-title').textContent = artwork.title;
  document.querySelector('#viewer-count').textContent = `${String(selected + 1).padStart(2, '0')} / 03`;
}
document.querySelectorAll('[data-art]').forEach(button => {
  button.addEventListener('click', () => {
    opener = button;
    showArtwork(Number(button.dataset.art));
    viewer.showModal();
    document.body.classList.add('viewer-open');
    document.querySelector('#close-viewer').focus();
  });
});
document.querySelector('#close-viewer').addEventListener('click', () => viewer.close());
viewer.addEventListener('close', () => {
  document.body.classList.remove('viewer-open');
  opener?.focus();
});
document.querySelector('#previous').addEventListener('click', () => showArtwork(selected - 1));
document.querySelector('#next').addEventListener('click', () => showArtwork(selected + 1));
viewer.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    showArtwork(selected + (event.key === 'ArrowRight' ? 1 : -1));
  }
});
const gridButton = document.querySelector('#grid-view');
const listButton = document.querySelector('#list-view');
function setView(list) {
  document.querySelector('.artworks').classList.toggle('list', list);
  gridButton.classList.toggle('active', !list);
  listButton.classList.toggle('active', list);
  gridButton.setAttribute('aria-pressed', String(!list));
  listButton.setAttribute('aria-pressed', String(list));
}
gridButton.addEventListener('click', () => setView(false));
listButton.addEventListener('click', () => setView(true));
document.querySelector('#year').textContent = new Date().getFullYear();
if (window.lucide) window.lucide.createIcons();
