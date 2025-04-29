/* Intègre les fonctionalité JS pour ouvrir un menu déroulant ou des liens cliquables */
          
function openMenu(id) {
  document.getElementById(id).classList.add("active");
}
function closeMenu(id) {
  document.getElementById(id).classList.remove("active");
}
function goTo(url) {
  window.location.href = url;
}
          
          
          
/* Fonctions permettant l'infobulle*/
      
document.addEventListener("DOMContentLoaded", function () {
  const tooltips = document.querySelectorAll(".tooltip-container");

tooltips.forEach((tooltip) => {
  tooltip.addEventListener("click", function (e) {
    e.stopPropagation();
    tooltip.classList.toggle("active");

    // Fermer tous les autres
    tooltips.forEach((other) => {
      if (other !== tooltip) {
        other.classList.remove("active");
     }
    });
  });
});

document.addEventListener("click", function () {
  tooltips.forEach((tooltip) => tooltip.classList.remove("active"));
  });
});
          
          
          
          
/* Fonction permettant de ne pas afficher une bulle déjà vue */
          
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
  const goingUp = window.scrollY < lastScrollY;
  lastScrollY = window.scrollY;

  document.querySelectorAll('.narrative').forEach(bubble => {
    const rect = bubble.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

    if (!bubble.classList.contains('already-seen') && isVisible) {
      bubble.classList.add('already-seen');
    }

    if (goingUp && bubble.classList.contains('already-seen') && bubble.classList.contains('non-reversible')) {
      bubble.style.display = 'none';
    }
  });
});
