// Botão "Voltar ao topo"
document.getElementById("voltarTopo").addEventListener("click", function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// guarda o slide atual de cada slideshow
let slideIndexes = {};

function mostrarSlide(slideshowId, n) {
  const container = document.querySelector(
    `.slideshow-container[data-slideshow="${slideshowId}"]`
  );
  const slides = container.querySelectorAll(".slide");

  if (slideIndexes[slideshowId] === undefined) {
    slideIndexes[slideshowId] = 0;
  }

  if (n >= slides.length) slideIndexes[slideshowId] = 0;
  if (n < 0) slideIndexes[slideshowId] = slides.length - 1;

  slides.forEach((s) => (s.style.display = "none"));

  slides[slideIndexes[slideshowId]].style.display = "block";
}

function mudarSlide(slideshowId, n) {
  slideIndexes[slideshowId] += n;
  mostrarSlide(slideshowId, slideIndexes[slideshowId]);
}

// inicializar todos os slideshows quando a página carregar
window.onload = () => {
  document.querySelectorAll(".slideshow-container").forEach((container) => {
    const id = container.getAttribute("data-slideshow");
    slideIndexes[id] = 0;
    mostrarSlide(id, 0);
  });
};
