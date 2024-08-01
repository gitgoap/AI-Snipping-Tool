let scale = 1;
let rotation = 0;
const img = document.getElementById('preview-image');

function updateTransform() {
    img.style.transform = `scale(${scale}) rotate(${rotation}deg)`;
}

document.getElementById('zoom-in').addEventListener('click', () => {
    scale *= 1.2;
    updateTransform();
});

document.getElementById('zoom-out').addEventListener('click', () => {
    scale /= 1.2;
    updateTransform();
});

document.getElementById('rotate-left').addEventListener('click', () => {
    rotation -= 90;
    updateTransform();
});

document.getElementById('rotate-right').addEventListener('click', () => {
    rotation += 90;
    updateTransform();
});