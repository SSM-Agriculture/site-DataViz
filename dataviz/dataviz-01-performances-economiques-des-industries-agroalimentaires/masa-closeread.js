  // ================= //
 // masa-closeread.js //
// ================= //

// Ce fichier répertorie l'ensemble des fonctionnalité disponibles pour rédigez les dataviz pour de MASA

/* ==========================
   📄 DOCUMENTATION DU SCRIPT
   ==========================

   Ce fichier regroupe les éléments et fonctions utilisés
   dans le script JavaScript du projet Quarto + CloseRead
   avec cartes Leaflet dans des iframes.

   ======================
   // ELEMENTS IMPORTANTS
   ======================

   // document //

   L'objet global qui représente toute la page HTML.
   Permet d'accéder à l'ensemble du DOM, ajouter des événements,
   ou manipuler les éléments de la page.

   Exemple :
   document.getElementById("monElement");

   // iframe //

   Élément HTML <iframe> permettant d’intégrer une autre page HTML dans l’actuelle.
   Dans notre cas, chaque carte Leaflet est incluse dans une iframe.

   Pour accéder au contenu de l’iframe :
   - iframe.contentWindow : fenêtre JavaScript interne (utile pour accéder à `map`)
   - iframe.contentDocument : DOM de l’iframe (utile pour chercher un script, une div…)

   Exemple :
   const map = iframe.contentWindow.map;

   // .narrative //

   Élément contenant une bulle de texte dans le storytelling CloseRead.
   Plusieurs éléments `.narrative` défilent en superposition d’un fond sticky.

   // .trigger //

   Élément utilisé pour détecter les entrées/sorties dans le viewport via Scrollama.
   Chaque `.narrative` est englobé dans un unique `.trigger`.
   un Index Scrollama est associé à chaque `.trigger` (respectant la synthaxe de CloseRead)

   // dataset //

   Objet permettant d’accéder aux attributs `data-*` d’un élément HTML.
   Exemple :
   <div data-scrollama-index="3"></div>

   JavaScript :
   element.dataset.scrollamaIndex // Renvoie "3" (string)

   ============================
   // FONCTIONS JS IMPORTANTES
   ============================

   // getElementById(id) //

   Permet de récupérer un élément HTML par son ID.

   Syntaxe :
   document.getElementById("map");

   Retourne :
   L'élément HTML correspondant ou null s’il n’existe pas.

   Exemple :
   const centroidsScript = document.getElementById("centroids");

   // getBoundingClientRect() //

   Permet de récupérer la taille et la position d’un élément
   relativement à la fenêtre du navigateur (viewport).

   Syntaxe :
   const rect = element.getBoundingClientRect();

   Retourne un objet contenant :
   - top : distance entre le haut de la fenêtre et le haut de l’élément
   - bottom : distance entre le haut de la fenêtre et le bas de l’élément
   - left : distance entre la gauche de la fenêtre et la gauche de l’élément
   - right : distance entre la gauche de la fenêtre et la droite de l’élément
   - x : équivalent à left
   - y : équivalent à top
   - width : largeur de l’élément (en px)
   - height : hauteur de l’élément (en px)

   Exemple :
   if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
     // L'élément est complètement visible à l'écran
   }

   // querySelector(selector) //

   Sélectionne le premier élément correspondant à un sélecteur CSS.

   Syntaxe :
   document.querySelector(".classe");

   Retourne :
   L'élément trouvé ou null.

   // querySelectorAll(selector) //

   Sélectionne tous les éléments correspondant à un sélecteur CSS.

   Syntaxe :
   const elements = document.querySelectorAll(".narrative");

   Retourne :
   Une NodeList (liste statique d’éléments DOM).

   // JSON.parse(json) //

   Transforme une chaîne JSON en objet JavaScript.

   Syntaxe :
   const obj = JSON.parse('{ "nom": "France" }');

   Retour :
   Un objet JavaScript utilisable directement.

   // Array.from(iterable) //

   Convertit une NodeList ou tout autre objet itérable en tableau.

   Exemple :
   const bullesArray = Array.from(document.querySelectorAll(".narrative"));

   // find(callback) //

   Méthode de tableau. Retourne le premier élément qui passe le test.

   Exemple :
   const item = items.find(el => el.id === "paris");

   // forEach(callback) //

   Exécute une fonction pour chaque élément du tableau.

   Exemple :
   bulles.forEach((bulle, index) => {
     console.log(index, bulle.textContent);
   });

   // setTimeout(callback, délai) //

   Exécute une fonction après un certain temps (en millisecondes).

   Exemple :
   setTimeout(() => {
     console.log("1 seconde plus tard");
   }, 1000);

   // addEventListener(type, callback) //

   Attache un gestionnaire d’événement à un élément.

   Exemple :
   window.addEventListener("scroll", () => {
     console.log("Scroll détecté");
   });

   // parseInt(string, base) //

   Convertit une chaîne de caractères en entier.

   Exemple :
   const index = parseInt("42", 10); // → 42

   // console.log(), console.warn(), console.error() //

   Affiche des messages dans la console (debug).
   - console.log("Message");
   - console.warn("Avertissement");
   - console.error("Erreur");

   =====================
   // FONCTIONS LEAFLET
   =====================

   // map.setView([lat, lng], zoom, options) //

   Centre la carte Leaflet sur un point donné avec un niveau de zoom.

   Exemple :
   map.setView([46.5, 2.5], 6, { animate: true });

   // L.popup() //

   Crée une popup Leaflet.

   Exemple :
   const popup = L.popup()
     .setLatLng([48.85, 2.35])
     .setContent("Paris")
   map.openPopup(popup);
*/


  // =============== //
 // menus déroulant //
// =============== //

/* Intègre les fonctionnalités JS pour ouvrir un menu déroulant ou des liens cliquables */
function goTo(url) {
  window.location.href = url;
}

// Filtre les options du menu territoires
function filterMenu() {
  const filter = document.getElementById('searchInput-territoire').value.toLowerCase();
  const options = document.querySelectorAll('#menuOptions-territoire .menu-option-territoire');
  options.forEach(opt => {
    const text = opt.textContent.toLowerCase();
    opt.style.display = text.includes(filter) ? '' : 'none';
  });
}

window.openMenu = function(id) {
  document.getElementById(id).classList.add('active');
};

window.closeMenu = function(id) {
  document.getElementById(id).classList.remove('active');
};

function menuParamStatus(id, callback) {
  const target = document.getElementById(id);
  if (!target) {
    console.warn(`Élément avec id="${id}" non trouvé.`);
    return;
  }

  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.attributeName === 'class') {
        const hasActive = target.classList.contains('active');
        callback(hasActive);
      }
    });
  });

  observer.observe(target, { attributes: true });
}

function isInViewport(el) {
  if (!el) return false;
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

document.addEventListener('click', function(event) {
  const menu = document.getElementById('menu-overlay-params');
  if (!menu) return;

  const isActive = menu.classList.contains('active');
  if (!isActive) return;
  
  const btns = menu.querySelectorAll('.btn-option-params');

  if (btns.length === 0) {
    console.log('Aucun bouton trouvé dans le menu "params"');
    return;
  }

  const btnClose = menu.querySelector('.btn-close-params');
  
  const btnCloseRect = btnClose.getBoundingClientRect();

  let nextBtnTopPosition = btnCloseRect.top;
  const gap = 0.01 * window.innerHeight; // 2vh

  btns.forEach(btn => {
    nextBtnTopPosition -= gap;
    nextBtnTopPosition -= btn.clientHeight;
    
    btn.style.position = 'fixed'; // important !
    btn.style.right = (1/100) * window.innerWidth + 'px';
    btn.style.top = nextBtnTopPosition + 'px';
  });
});

document.addEventListener('click', (event) => {
  const target = event.target;
  
  const btnShare = document.getElementById('btn-share');
  const shareOptions = document.getElementById('btn-share-options');
  
  if (btnShare.contains(target)) {
    // Récupérer largeur/hauteur du bouton
    const btnShareRect = btnShare.getBoundingClientRect();
    
    // Appliquer les dimensions au menu d'options
    shareOptions.style.height = btnShareRect.height + 'px';

    // Afficher menu, cacher bouton
    shareOptions.style.display = 'inline-flex';
    btnShare.style.display = 'none';
  } else if (!shareOptions.contains(target)) {
    // Clic en dehors → reset dimensions et bascule affichage
    shareOptions.style.display = 'none';
    shareOptions.style.width = '';
    shareOptions.style.height = '';
    btnShare.style.display = 'block';
  }
});

  
  // ====================== //
 // Gestion des infobulles //
// ====================== //

 // Objectif : Ouvrir une bulle avec du texte à l'intérieur lorsque l'utilisateur click sur un certain élément de la Viz //
// ==================================================================================================================== //


   // Précision sur les éléments utilisés : ---------------------------------------- //
  // tooltip-container (appelé container) = Cercle jaune présent en dessous du "?"  //
 // tooltip-question (appelé question) = "?"                                       //
// tooltip-content (appelé content) = Bloc ouvert lorsque l'on clique sur le "?"  //


// Charger le contenu de la page
document.addEventListener("DOMContentLoaded", function () {
  // Collecter l'ensemble des infobulles du document
  const tooltips = document.querySelectorAll(".tooltip-container");

  // Pour chaque infobulle du document, ouvrir un bloc avec du texte dedans lorsque l'on clique dessus
  tooltips.forEach((container) => {
  // Réagir au clic
  container.addEventListener("click", function (e) {
    // Empêcher qu'une autre infobulle ne soit ouverte en même temps
    e.stopPropagation();
    // Assigner la classe active à l'infobulle
    container.classList.toggle("active");

    // Fermer toutes les autres
    tooltips.forEach((other) => {
      if (other !== container) {
        other.classList.remove("active");
     }
    });
  });
});

// Réagir au clic sur la page html
document.addEventListener("click", function () {
  // Lorsque l'on re-clic sur la page (peut importe où), cela ferme l'infobulle ouverte
  tooltips.forEach((container) => container.classList.remove("active"));
  });
});


  //////////////////////////////////
 // Fonction : observeTooltips() //
//////////////////////////////////

 // Objectif : Ajuster la position des infobulles pour qu'elles soient toujours entièrement visibles //
// ================================================================================================ //

function observeTooltips() {
  // Collecter la liste de tous les container
  const tooltips = document.querySelectorAll('.tooltip-container');

  // Recentrer le content en dessous du container (ou alors éviter qu'il soit hors de la page)
  tooltips.forEach(container => {

    // Récupérer la question associé au container actuel
    const question = container.querySelector('.tooltip-question');
    // Récupérer le content associé au container actuel
    const content = container.querySelector('.tooltip-content');
    // Initialiser le déplacement du content
    let delta = 0;

    // Réagir à chaque changement observé sur la page
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        // Tester si la mutation provient d'un changement de classe et d'attribu
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {

          // Définir si le container actuel est ouvert (= contient la classe "active")
          const isActive = container.classList.contains("active");

          if (isActive && content) {

            // Collecter les informations de positionnement de content et de question
            const contentRect = content.getBoundingClientRect();
            const questionRect = question.getBoundingClientRect();

            // Calculer les centres de content et de question
            const centerContentX = (contentRect.right + contentRect.left)/2;
            const centerQuestionX = (questionRect.right + questionRect.left)/2;

            // Calculer la distance entre le centre de content et de question (car dans certains cas ils ne sont pas affiché à côté)
            // Horizontalement
            const deltaX = centerContentX - centerQuestionX;
            // Verticalement
            const deltaY = (0.5/100)*window.innerHeight;

            // Initialiser la correction à appliquer
            let correctionX = 0;
            let correctionY = 0;

            // Initialiser un seuil de tolérance d'espacement des deux centres
            const threshold = 10;

            // Récupérer la largeur du viewport
            const viewportWidth = window.innerWidth;
            
            // Tester si la distance (en absolu) entre les deux centres est supérieur au seuil
            if (Math.abs(deltaX) > threshold) {
              // Si oui, appliquer une première correction
              correctionX = deltaX;
              correctionY = deltaY + (questionRect.bottom - contentRect.top);
            }
            
            // Recalculer le positionnement des éléments avec la première correction
            // Distance corrigée entre le bord gauche du viewport et la droite de content
            const adjustedContentRight = contentRect.right - correctionX;
            // Distance corrigée entre le bord gauche du viewport et la gauche de content
            const adjustedContentLeft = contentRect.left - correctionX;
            // Distance corrigée entre le haut du viewport et le haut de content
            const adjustedContentTop = question.bottom - contentRect.top + correctionY;
            
            // Récupérer les coordonnées de la balise <p> dans laquelle est l'infobulle
            const p = container.closest("p");
            const pRect = p.getBoundingClientRect();

            // Tester si la bulle dépasse sur la gauche, et si oui, la décaler vers la droite
            if (adjustedContentLeft < pRect.left) {
              // Dans le cas où la bulle dépasse de la gauche du viewport
              if (adjustedContentLeft < 0) {
                // Calculer la correction horizontale finale à appliquer sur content
                const delta = - correctionX - adjustedContentLeft + (1/100)*viewportWidth - (50/100)*contentRect.width;
                // Appliquer les corrections horizontales et verticales sur content
                content.style.transform = `translate(${delta}px, ${correctionY}px)`;
              
              // Dans le cas ou la bulle est dans le viewport mais mal placée sur la gauche
              } else {
                
                // Calcul du gap entre le bord gauche du viewport et la gauche de la balise <p>
                let adjustGap = 0;
                // Dans le cas où la bulle (centrée sous le "?") dépasse sur la gauche du viewport
                if (pRect.left < (50/100)*contentRect.width) {
                  // Calcul du réajustement à appliquer
                  adjustGap = (50/100) * contentRect.width - pRect.left + (1/100) * viewportWidth;
                }
                
                // Calculer la correction horizontale finale à appliquer sur content
                const delta = adjustGap - correctionX - (50/100)*contentRect.width;
                // Appliquer les corrections horizontales et verticales sur content
                content.style.transform = `translate(${delta}px, ${correctionY}px)`;
              }
            }

            // Tester si la bulle dépasse sur la droite, et si oui, la décaler vers la gauche
            if (adjustedContentRight > pRect.right) {
              
              // Dans le cas où l'infobulle se trouve dans une bulle narrative
              const narrative = p.closest(".narrative.active");
              // Ne prendre que les bulles qui sont au bord de la bulle narrative (mais pas au bord du vieport => cas géré avec le cas général)
              if (narrative && contentRect.right < viewportWidth) {
                const delta = - (50/100)*contentRect.width;
                
                // Appliquer les corrections horizontales et verticales sur content
                content.style.transform = `translate(${delta}px, ${correctionY}px)`;
              
              // Si l'infobulle n'est pas dans une bulle narrative
              } else {
                // Calculer la correction horizontale finale à appliquer sur content
                const delta = - correctionX - (contentRect.right - viewportWidth) - (1/100)*viewportWidth - (50/100)*contentRect.width;
                // Appliquer les corrections horizontales et verticales sur content
                content.style.transform = `translate(${delta}px, ${correctionY}px)`;
              }
            }
            
          // Si l'infobulle n'a pas la classe "active" on la replace à son emplacement initial
          } else {
            // Si une translation à été faite (detla est non nul)
            if (delta !== 0) {
              // Recentrer la bulle, en la décalant de - delta
              content.style.transform = `translateX(-${delta}px)`;
              // Réinitialiser delta
              delta = 0;
            // Sinon (delta = 0)
            } else {
              // Centrer la bulle sous le "?"
              content.style.transform = "translateX(-50%)";
            }
          }
        }
      });
    });

    observer.observe(container, {attributes: true});
  });
}

// Attendre que la page soit chargée pour appliquer la fonction observeTooltips
window.addEventListener("DOMContentLoaded", function () {
  console.log("DOM entièrement chargé, script lancé");
  observeTooltips();
});




  // ========================= //
 // Zoomer sur une carte html //
// ========================= //

 // Objectif des fonctions : Décoder et permettre l'affichage des cartes html du document //
// ===================================================================================== //

  ////////////////////////////////////////////
 // Fonction : decodeEmbeddedIframeContent //
////////////////////////////////////////////

/**
 * Décoder le contenu HTML encodé dans l'attribut src d'une iframe si c'est un data URI.
 *
 * @param {HTMLIFrameElement} iframe - L'iframe dont on veut décoder le contenu.
 * @returns {string|null} Le contenu HTML décodé ou null si échec ou si ce n'est pas un data URI.
 */
function decodeEmbeddedIframeContent(iframe) {
  // Retourne null si l'iframe n'est pas définie
  if (!iframe) return null;

  // Récupère la valeur de src de l'iframe
  const src = iframe.src;

  // Vérifie si src commence par "data:text/html" (data URI HTML)
  if (!src.startsWith("data:text/html")) {
    // Si ce n'est pas le cas, on retourne null
    return null;
  }

  // Découpe le data URI en deux parties : metadata et données encodées
  const parts = src.split(",");

  // La partie avant la virgule est la metadata (type et encodage)
  const metadata = parts[0];

  // La partie après la virgule correspond aux données encodées
  const encodedData = parts.slice(1).join(",");

  try {
    // Si la metadata indique un encodage base64, on décode avec atob
    if (metadata.includes("base64")) {
      return atob(encodedData);
    } else {
      // Sinon on suppose que c'est encodé en URL et on décode avec decodeURIComponent
      return decodeURIComponent(encodedData);
    }
  } catch (e) {
    // En cas d'erreur lors du décodage, log de l'erreur
    console.error("Erreur décodage:", e);
    // Retourne null pour signaler l'échec
    return null;
  }
}


  //////////////////////////////////////////
 // Fonction : reloadDecodedHtmlInIframe //
//////////////////////////////////////////

/**
 * Remplace une iframe avec un contenu encodé en data URI
 * par une nouvelle iframe avec ce contenu injecté via srcdoc.
 *
 * @param {HTMLIFrameElement} originalIframe - L'iframe à remplacer.
 * @returns {HTMLIFrameElement|null} La nouvelle iframe créée ou null en cas d'échec.
 */
function reloadDecodedHtmlInIframe(originalIframe) {
  // Tente de décoder le contenu HTML encodé dans l'iframe originale
  const htmlContent = decodeEmbeddedIframeContent(originalIframe);

  // Si le contenu n'a pas pu être décodé, avertit et quitte
  if (!htmlContent) {
    console.warn("Impossible de décoder le contenu");
    return null;
  }

  // Crée une nouvelle iframe pour injecter le contenu décodé
  const newIframe = document.createElement("iframe");

  // Définit un id pour la nouvelle iframe
  newIframe.id = "map";

  // Configure la largeur à 100% du parent
  newIframe.style.width = "100%";

  // Configure la hauteur à 600 pixels
  newIframe.style.height = "600px";

  // Injecte directement le contenu HTML dans srcdoc de la nouvelle iframe
  newIframe.srcdoc = htmlContent;

  // Remplace l'ancienne iframe par la nouvelle dans le DOM
  originalIframe.parentNode.replaceChild(newIframe, originalIframe);

  // Retourne la nouvelle iframe créée
  return newIframe;
}



  ////////////////////////////////
 // Fonction : waitForBulles() //
////////////////////////////////

/**
 * Attend que des éléments correspondant à un sélecteur apparaissent dans le DOM,
 * et appelle une callback dès qu'ils sont trouvés, ou abandonne après un nombre max d'essais.
 *
 * @param {string} selector - Le sélecteur CSS des éléments à attendre.
 * @param {function} callback - Fonction appelée avec les éléments dès qu'ils sont détectés.
 * @param {number} [maxAttempts=20] - Nombre maximal d'essais avant abandon.
 * @param {number} [interval=200] - Intervalle en ms entre chaque essai.
 */
function waitForBulles(selector, callback, maxAttempts = 20, interval = 200) {
  // Initialise le compteur de tentatives
  let attempts = 0;

  // Lance un intervalle qui vérifie la présence des éléments toutes les X ms
  const timer = setInterval(() => {
    // Recherche tous les éléments correspondant au sélecteur dans le DOM
    const bulles = Array.from(document.querySelectorAll(selector));

    // Si au moins un élément est trouvé
    if (bulles.length > 0) {
      // Stoppe l'intervalle pour éviter les appels futurs inutiles
      clearInterval(timer);

      // Appelle la callback en passant la liste des éléments trouvés
      callback(bulles);
      
      // Si le nombre maximum d'essais est atteint sans succès
    } else if (++attempts >= maxAttempts) {

      // Stoppe l'intervalle
      clearInterval(timer);

      // Avertit dans la console que les éléments n'ont pas été trouvés
      console.warn("Les bulles n'ont pas été trouvées.");
    }
  // Sinon continue à attendre la prochaine vérification
  }, interval);
}

  /////////////////////////////////////
 // Fonction : setupBulleTracking() //
/////////////////////////////////////

 // Objectif : Appliquer dynamiquement la classe "active" aux bulles visibles dans le viewport //
// ========================================================================================== //

/**
 * Initialise le suivi des bulles visibles dans le viewport.
 * Applique dynamiquement une classe "active" à chaque bulle visible à l'écran, utile pour déclencher des effets (ex : zoom sur carte).
 *
 * @param {Element[]} bulles - Tableau des éléments de bulle à suivre.
 */
function setupBulleTracking(bulles) {
  /**
   * Détermine si un élément est actuellement visible dans la fenêtre (viewport).
   *
   * @param {Element} el - Élément DOM à tester.
   * @returns {boolean} - true si visible, false sinon.
   */
  function isInViewport(el) {
    const rect = el.getBoundingClientRect();
    // Récupérer la dimension (hauteur) du viewport
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    // Renvoi true si est entièrement (de haut en bas) dans le viewport
    return rect.top < windowHeight && rect.bottom > 0;
  }

  /**
   * Met à jour l’état "active" des bulles selon leur visibilité dans le viewport.
   */
  function updateBulles() {
    bulles.forEach((bulle) => {
      if (isInViewport(bulle)) {
        // Ajoute la classe "active" à la classList de la bulle ciblée
        bulle.classList.add("active");
      } else {
        // Retire la classe "active" à la classList de la bulle ciblée
        bulle.classList.remove("active");
      }
    });
  }

  // Suivre les scrolls et redimensionnements de fenêtre pour actualiser les bulles visibles
  window.addEventListener("scroll", updateBulles);
  window.addEventListener("resize", updateBulles);
  updateBulles(); // Mise à jour initiale dès le chargement
}



 // Objectif : Récupérer les paramètres de zoom des départements ciblés dans zoomOrder //
// ================================================================================== //

  /////////////////////////////////
 // Fonction 1 : getCentroids() //
/////////////////////////////////

/**
 * Extrait dynamiquement les centroïdes géographiques (lat/lng) intégrés à l'intérieur d'une iframe.
 * Utilisé pour déterminer les points de zoom sur une carte Leaflet.
 *
 * @param {HTMLIFrameElement} iframe - L'iframe contenant la carte et le script JSON.
 * @returns {Array|undefined} - Tableau de centroïdes ou undefined si une erreur survient.
 */

// Fonction qui retourne une Promise résolue avec les centroïdes extraits de l'iframe une fois celle-ci chargée
function getCentroids(iframe) {
  return new Promise((resolve, reject) => {
    // Vérification basique : présence de l'iframe
    if (!iframe) {
      reject("Aucun iframe détecté");
      return;
    }

    // Fonction interne qui tente de récupérer les centroïdes dans le DOM de l'iframe
    const tryGetCentroids = () => {
      try {
        // Accès au document de l'iframe (contenu chargé dans l'iframe)
        const doc = iframe.contentDocument || iframe.contentWindow.document;

        // Si document inaccessible, rejette la promesse
        if (!doc) {
          reject("iframe.contentDocument inaccessible");
          return;
        }

        // Recherche dans le DOM d'un élément ayant l'id "centroids"
        const centroidsElement = doc.getElementById("centroids");
        if (!centroidsElement) {
          reject("Élément #centroids introuvable dans DOM iframe");
          return;
        }

        // Récupère le contenu JSON texte stocké dans cet élément
        const centroidsJson = centroidsElement.textContent || centroidsElement.innerText;

        // Parse le JSON en objet JavaScript
        const centroids = JSON.parse(centroidsJson);

        // Résout la promesse avec les centroïdes récupérés
        resolve(centroids);
      } catch (err) {
        // En cas d'erreur de parsing ou autre, rejette la promesse avec l'erreur
        reject("Erreur lors de l'extraction ou parsing des centroïdes : " + err);
      }
    };

    // Vérifie si l'iframe est déjà chargée (document prêt)
    if (iframe.contentDocument && iframe.contentDocument.readyState === "complete") {
      console.log("iframe déjà chargée, on force un rechargement");

      // Pour forcer la mise à jour du contenu de l'iframe
      if (iframe.src) {
        // Sauvegarde la source originale
        const originalSrc = iframe.src;
        // Vide l'iframe temporairement pour forcer un reload
        iframe.src = "about:blank";
        // Recharge la source originale après un court délai
        setTimeout(() => {
          iframe.src = originalSrc;
        }, 100);
      } else if (iframe.srcdoc) {
        // Même principe que pour src mais avec srcdoc (contenu HTML inline)
        const originalSrcdoc = iframe.srcdoc;
        iframe.srcdoc = "";
        setTimeout(() => {
          iframe.srcdoc = originalSrcdoc;
        }, 100);
      }

      // Écoute le prochain chargement de l'iframe pour extraire les centroïdes
      iframe.addEventListener("load", () => {
        console.log("iframe rechargée");
        tryGetCentroids();
      });

    } else {
      // Si iframe pas encore chargée, on attend l'événement "load"
      console.log("iframe pas encore chargée, on attend le load");
      iframe.addEventListener("load", () => {
        console.log("iframe chargée");
        tryGetCentroids();
      });
    }
  });
}

  ////////////////////////////////////
 // Fonction 2 : getZoomSettings() //
////////////////////////////////////

/**
 * Génère les paramètres de zoom (coordonnées + échelle) à partir de l'ordre de zoom et des centroïdes.
 *
 * @param {Array} zoomOrder - Liste ordonnée des régions ou départements à zoomer.
 * @param {HTMLIFrameElement} iframe - Iframe contenant la carte et les centroïdes.
 * @returns {Object} - Dictionnaire associant l’index à un objet {lat, lng, scale}.
 */

// Fonction asynchrone qui récupère les réglages de zoom selon un ordre donné et les centroïdes extraits de l'iframe
async function getZoomSettings(zoomOrder, iframe) {
  try {
    // Attend la récupération des centroïdes dans l'iframe
    const centroids = await getCentroids(iframe);
    if (!centroids) {
      console.warn("Les centroïdes n'ont pas pu être chargés");
      return null;
    }

    // Initialisation de l'objet qui contiendra les réglages de zoom
    const zoomSettings = {};

    // Pour chaque région (nom) dans l'ordre de zoom demandé
    zoomOrder.forEach((centroidName, i) => {
      // Recherche le centroïde correspondant au nom dans la liste
      const centroide = centroids.find(c => c.nom === centroidName);
      if (centroide) {
        // Affecte un zoom spécifique (6 pour Carte, 9 sinon) avec lat/lng du centroïde
        zoomSettings[i] = {
          bounds: [
            [centroide.rect_bounds.ymin , centroide.rect_bounds.xmin],
            [centroide.rect_bounds.ymax , centroide.rect_bounds.xmax]
          ],
          lat: centroide.lat,
          lng: centroide.lng
        };
      }
    });

    // Si aucun réglage n'a été trouvé, log un avertissement
    if (!Object.keys(zoomSettings).length) {
      console.warn("Zoom Settings non chargés");
      return null;
    }
    
    console.log("zoomSettings", zoomSettings);
    // Retourne l'objet des réglages de zoom trouvés
    return zoomSettings;
  } catch (err) {
    // En cas d'erreur dans toute la procédure, affiche une erreur et retourne null
    console.error("Erreur getZoomSettings :", err);
    return null;
  }
}


 // Objectif : Identifie l’index de scrollama de la première bulle d’une section ".map" //
// =================================================================================== //

    // Description : --------------------------------------------------------------------------------------- //
   // Cette fonctionnalité est (pour le moment) exclusivement utilisée pour gérer les intéractions de zoom  //
  // sur les cartes. Il est impératif de récupérer l'index de la première bulle de la section CloseRead de //
 // chaque carte pour ensuite calculer un index relatif à cette section (relativeIndex), et zoomer sur la //
// bonne zone. ----------------------------------------------------------------------------------------- //

  //////////////////////////////////////
 // Fonction : getFirstBubbleIndex() //
//////////////////////////////////////

/**
 * Identifie l’index de scrollama de la première bulle d’une section ".map".
 *
 * @param {HTMLElement} section - Section contenant la carte et ses bulles.
 * @returns {number|null} - Index de la première bulle, ou null si non trouvé.
 */
function getFirstBubbleIndex(section) {
  // Récupère le premier "triger" la section = celui qui contient la première bulle
  const firstTrigger = section?.querySelector(".narrative-col .trigger");
  // Extrait le scrollama index de la première bulle
  const index = firstTrigger?.dataset.scrollamaIndex;
  if (index !== undefined) {
    console.log("Première bulle trouvée :", index);
    // Renvoi en sortie l'index de la première bulle
    return parseInt(index, 10);
  } else {
    console.warn("Première bulle introuvable");
    return null;
  }
}

 // Objectif : Attribuer un index de scrollama aux bulles n'en ayant pas, en propageant le dernier index valide rencontré //
// ===================================================================================================================== //


    // Description : ---------------------------------------------------------------------------------------------------- //
   // Dans certains cas, pour les bulles non définies par une synthaxe purement issue de CloseRead, le .trigger associé  //
  // à cette bulle ne contient pas de Scrollama index (c'est le cas quans on change la couleur du fond de la bulle par  //
 // exemple). Donc pour quand même permettre l'affichage (fonction surtout utilisé dans le cas des zoom sur une carte) //
// de la bonne bulle associé à la bonne animation, il faut ajouter un index fictif le "scrollamaIndexPropagated". --- //


  //////////////////////////////////////////
 // Fonction : propagateScrollamaIndex() //
//////////////////////////////////////////

/**
 * Attribue un index de scrollama aux bulles n'en ayant pas,
 * en propageant le dernier index valide rencontré.
 *
 * @param {HTMLElement[]} bulles - Liste des bulles narratives.
 */
function propagateScrollamaIndex(bulles) {
  // Initialiser lastValidIndex
  let lastValidIndex = null;

  // Rechercher pour chaque bulle, si le .trigger associé à un index scrollama
  bulles.forEach((bulle) => {
    // Accéder au .trigger de la bulle ciblée
    const trigger = bulle.closest(".trigger");
    
    // Tester si le .trigger à in index Scrollama déjà défini
    if (trigger?.dataset.scrollamaIndex !== undefined) {
      // Si oui, assigner à lastValidIndex l'index Scrollama de ce .trigger (en base 10)
      lastValidIndex = parseInt(trigger.dataset.scrollamaIndex, 10);
      // Assigner à la bulle un index Scrollama fictif
      bulle.dataset.scrollamaIndexPropagated = lastValidIndex;
      
      // Si non, assigner à la bulle le lastValidIndex (= cette bulle aura le même index fictif que la précédente)
    } else if (lastValidIndex !== null) {
      bulle.dataset.scrollamaIndexPropagated = lastValidIndex;
      
      // Dans le cas où la première bulle n'ai pas d'index (cela peut se produire si elle comporte une infobulle), on y assigne un index de 0
    } else if (lastValidIndex === null) {
      bulle.dataset.scrollamaIndexPropagated = 0;
    }
  });
}

 // Objectif : Récupérer l'index de la bulle actuellement visible dans le viewport //
// ============================================================================== //

  //////////////////////////////////////
 // Fonction : getActiveBulleIndex() //
//////////////////////////////////////


/**
 * Récupère l’index scrollama (propagé) de la bulle narrative visible la plus avancée.
 *
 * @returns {number|null} - Index de la bulle active ou null si aucune n’est active.
 */
function getActiveBulleIndex() {
  // Collecter la / les bulles présentes dans le viewport (= avec la classe "active")
  const activeBulles = Array.from(document.querySelectorAll(".narrative.active"));
  // S'il n'y a aucunes bulles, renvoyer "null"
  if (activeBulles.length === 0) return null;

  // Sinon, récupérer l'index Scrollama fictif le plus élevé parmi les bulles actives
  const maxIndex = activeBulles.reduce((max, bulle) => {
    const index = parseInt(bulle.dataset.scrollamaIndexPropagated, 10);
    return index > max ? index : max;
  }, -1);
  // Renvoyer l'index maximal s'il existe, sinon renvoyer null (= aucunes bulles dans le viewport)
  return maxIndex === -1 ? null : maxIndex;
}

 // Objectif : Créer une animation de zoom sur une zone données //
// =========================================================== //

  ////////////////////////////
 // Fonction : applyZoom() //
////////////////////////////

    // Description : ------------------------------------------------------------------------------------------------- //
   // Cette fonction, permet de, à partir de l'index actuel de la bulle affiché sur le viewport et des paramètres de  //
  // zoom de chaque iframe, d'associer le bon zoom à la bonne bulle, et de synchroniser le zoom spécifique de chaque //
 // bulle. -------------------------------------------------------------------------------------------------------- //

/**
 * Applique dynamiquement un zoom sur la carte active en fonction de l'index de bulle.
 *
 * @param {number} index - Index de la bulle active.
 * @param {Object} iframeZoomOrder - Objet contenant les zoomOrders et zoomSettings pour chaque iframe.
 */

 // Initialisation de lastIndex en amont de la fonction
let lastIndex = null;

function applyZoom(index, iframeZoomOrder) {
  // Test permettant de mettre fin à la fonction si l'index de la bulle n'a pas changé (soit la même bulle, soit 2 bulles ayant le même index)
  if (index === lastIndex) return;
  // Assigner un index qui va permettre de vérifier une condition spécifique dans la suite de la fonction
  const verifyIndex = lastIndex;
  // L'index actuel étant différent du précédent, alors réassigner le bon "lastIndex"
  lastIndex = index;

  // Récupérer la bulle affiché dans le viewport
  const activeBulle = document.querySelector(".narrative.active");
  // Récupérer les informations sur la section CloseRead dans laquelle elle se trouve
  const section = activeBulle?.closest(".cr-section.map");
  // Récupérer l'iframe présent dans cette section CloseRead
  const iframe = section?.querySelector("iframe");
  
  if (!iframe || !iframe.id || !iframeZoomOrder[iframe.id]) return;
  
  // Récupérer les paramètres de zoom intégrés dans iframeZoomOrder
  const { zoomOrder, zoomSettings, firstBubbleIndexSection } = iframeZoomOrder[iframe.id];
  // Tester si tous les paramètres ont bien été récupérés
  if (!zoomOrder || !zoomSettings || !firstBubbleIndexSection) {
    console.warn("Erreur de chargement d'au moins une donnée de iframeZoomOrder dans applyZoom");
    return;
  }
  // Calculer l'index Scrollama relatif à cette section CloseRead
  const relativeIndex = index - firstBubbleIndexSection;


  // Si on scrolle vers un département déjà visible → ne pas re-zoomer (importance du verifyIndex dans ce test)
  if (verifyIndex !== null && index === verifyIndex + 1 && zoomOrder[relativeIndex] === zoomOrder[relativeIndex - 1]) return;
  
  // Récupérer les paramètres de zoom de la bulle actuellement active
  const current = zoomSettings[relativeIndex] || zoomSettings[0];
  console.log(current);
  if (!current) return;

  // Récupérer l'iframe dans un objet "map"
  const map = iframe.contentWindow.map;
  // Réupérer les fonctionnalité offertes par Leaflet dans un objet "L"
  const L = iframe.contentWindow.L;
  if (!map || typeof map.fitBounds !== "function") {
    console.warn("Objet 'map' introuvable");
    return;
  }
  
  // Initialise ou ferme la fonctionalité de popup de Leaflet
  map.closePopup();

  // Zoomer sur la bonne zone, en lien avec la bulle active du viewport
  // Pour la première bulle de la section, uniquement zoomer sur la zone en question
  if (index === firstBubbleIndexSection) {
    map.fitBounds(current.bounds);
  // Pour les autres bulles, faire d'abord un dé-zoom sur le centre initial de la carte, puis zoomer sur la zone ciblée
  } else {
    console.log("Zoom sur :", current.nom)
    map.fitBounds(zoomSettings[0].bounds);
    setTimeout(() => {
      map.fitBounds(current.bounds);
      const centroidName = zoomOrder[relativeIndex];
      // afficher un popup avec le nom du département (sauf quand c'est le zoom initial = Carte entière)
      if (L && centroidName && centroidName !== "Carte") {
        // Créer le popup
        const popup = L.popup()
          // Y intégrer les coordonnées du département ciblé
          .setLatLng([current.lat, current.lng])
          // Afficher le nom du département ciblé dans le popup
          .setContent(`<strong>${centroidName}</strong>`);
        // Ouvrir le popup
        map.openPopup(popup);
      }
    }, 1000);
  }
}


// --- Fonction recalculeNarratives (extrait de ton code) ---
function recalculeNarratives() {
  const sections = document.querySelectorAll('.narrative-col');

  sections.forEach(section => {
    const triggers = section.querySelectorAll('.trigger');

    if (triggers.length === 0) return;

    const largeurParent = triggers[0].clientWidth;
    const hauteurParent = triggers[0].clientHeight;

    triggers.forEach((trigger, index) => {
      trigger.style.height = hauteurParent + 'px';
      trigger.style.width = largeurParent + 'px';
      trigger.style.position = 'relative';

      const narrative = trigger.querySelector('.narrative');
      if (!narrative) return;

      const hauteurNarrative = narrative.offsetHeight;

      narrative.style.position = 'absolute';
      narrative.style.marginRight = '24px';

      const estDernier = (index === triggers.length - 1);

      if (estDernier) {
        narrative.style.top = (hauteurParent - hauteurNarrative) + 'px';
        trigger.style.height = (hauteurParent * 2) + 'px';
      } else {
        narrative.style.top = (hauteurParent - hauteurNarrative) + 'px';
      }
    });
  });
}

// Récupérer la valeur de bascule définie entre le mode pc et smartphone (= les bulles narratives passent au milieu de l'écran)
function getBreakpointValue() {
  const rootStyles = getComputedStyle(document.documentElement);
  const bp = rootStyles.getPropertyValue('--breakpoint-large').trim();
  return parseInt(bp.replace('px', ''), 10);
}

// --- Fonction resizeStickyImages optimisée ---
function resizeStickyImages() {

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const marginH = viewportHeight * 0.03;
  const marginW = viewportWidth * 0.03;
  
  const breakpoint = getBreakpointValue();
  
  if (window.innerWidth < breakpoint) {
    document.querySelectorAll('.cr-section').forEach(section => {
      if (section.classList.contains('map')) return;
      
      const stickyCol = section.querySelector('.sticky-col');
      if (!stickyCol) return;
      
      const stickyElems = stickyCol.querySelectorAll('.sticky');
      if (stickyElems.length === 0) return;
        
      let tallestStickyHeight = 0;
      stickyElems.forEach(sticky => {
        
        // Trouver la hauteur sticky la plus grande dans cette section
        const stickyHeight = sticky.clientHeight;
        if (stickyHeight > tallestStickyHeight) tallestStickyHeight = stickyHeight;
        
      });
      
      if (tallestStickyHeight < viewportHeight - 2 * marginH) return;
      
      stickyElems.forEach(sticky => {
        // Récupérer les paramètres de l'image
        const img = sticky.querySelector("img");
        if (!img) return;
        const imgWidth = img.clientWidth;
        const imgHeight = img.clientHeight;
      
        // Récupérer les paramètres de la balise <p> associée à l'image
        const p = img.closest("p");
        const pWidth = p.clientWidth;
        const pHeight = p.clientHeight;
        if (!pWidth || !pHeight) return;

        const stickyHeight = sticky.clientHeight;
        const othersHeight = stickyHeight - imgHeight;

        const stickyWidthLimit = viewportWidth - 2 * marginW;
        const stickyHeightLimit = viewportHeight - 2 * marginH;
      
        const maxPWidth = stickyWidthLimit;
        const maxPHeight = stickyHeightLimit - othersHeight;
      
      
        // Calcul des ratios 
        const ratioW = maxPWidth / pWidth;
        const ratioH = maxPHeight / pHeight;
        
        // Sélection du ratio le plus bas
        const scaleRatio = Math.min(ratioW, ratioH, 1);
        
        img.style.width = (imgWidth * scaleRatio) + 'px';
        img.style.height = (imgHeight * scaleRatio) + 'px';
      });
    });
    
  // Sinon, dans le cas où le viewport est plus grand que le --breakpoint-large 
  } else {
    const minNarrativeWidthRatio = 0.4;

    document.querySelectorAll('.cr-section').forEach(section => {
      if (section.classList.contains('map')) return;

      const stickyCol = section.querySelector('.sticky-col');
      const narrativeCol = section.querySelector('.narrative-col');
      if (!stickyCol || !narrativeCol) return;

      const stickyElems = stickyCol.querySelectorAll('.sticky');
      if (stickyElems.length === 0) return;
    
    
      let tallestStickyHeight = 0;
      stickyElems.forEach(sticky => {
        // Trouver la hauteur sticky la plus grande dans cette section
        const stickyHeight = sticky.clientHeight;
        if (stickyHeight > tallestStickyHeight) tallestStickyHeight = stickyHeight;
      });
    
    // Vérifier si narrative-col est bien plus large que 40% viewport
      const narrativeWidth = narrativeCol.getBoundingClientRect().width;
      const narrativeWidthRatio = narrativeWidth / viewportWidth;
    
      stickyElems.forEach(sticky => {
        const img = sticky.querySelector("img");
        if (!img) return;
        const imgWidth = img.clientWidth;
        const imgHeight = img.clientHeight;
      
        const p = img.closest("p");
        const pWidth = p.clientWidth;
        const pHeight = p.clientHeight;
        if (!pWidth || !pHeight) return;

        const stickyHeight = sticky.clientHeight;
        const othersHeight = stickyHeight - imgHeight;

        const stickyWidthLimit = viewportWidth - 2 * marginW;
        const stickyHeightLimit = viewportHeight - 2 * marginH;
      
        const maxPWidth = stickyWidthLimit;
        const maxPHeight = stickyHeightLimit - othersHeight;
      
      
        // Calcul des ratios 
        const ratioW = maxPWidth / pWidth;
        const ratioH = maxPHeight / pHeight;
      
        // Condition d'agrandissement
        const canEnlarge = (tallestStickyHeight < stickyHeightLimit) && (narrativeWidthRatio > minNarrativeWidthRatio);
      
        // Calcul de l'échelle à appliquer
        let scaleRatio = 1;
      
        // Dans le cas où il est possible d'aggrandir l'image
        if (canEnlarge) {
          // Je choisi le ratio d'agrandissement le plus faible
          scaleRatio = Math.min(ratioW, ratioH);
        // Dans le cas où le sticky déborde déjà de l'écran
        } else {
          // Je choisi le ratio le plus faible (= réduction la plus importante pour que le sticky rentre complètement dans l'écran)
          scaleRatio = Math.min(ratioW, ratioH, 1);
        }
      
        img.style.width = (imgWidth * scaleRatio) + 'px';
        img.style.height = (imgHeight * scaleRatio) + 'px';
      });

      // Ajustement des colonnes
      const stickyWidth = stickyCol.getBoundingClientRect().width;
      const minNarrativeWidth = viewportWidth * minNarrativeWidthRatio;
      let newNarrativeWidth = viewportWidth - stickyWidth;

      if (newNarrativeWidth < minNarrativeWidth) {
        stickyCol.style.width = (viewportWidth - minNarrativeWidth) + 'px';
        narrativeCol.style.width = minNarrativeWidth + 'px';
      } else {
        stickyCol.style.width = stickyWidth + 'px';
        narrativeCol.style.width = newNarrativeWidth + 'px';
      }
    });
  }
  // Appliquer une correction de dimension aux images des section Quarto (!= div class="cr-section")
  document.querySelectorAll("figure").forEach(figure => {
    
    if (figure.closest('div.cr-section')) return;
    
    const figureWidth = figure.clientWidth;
    const figureHeight = figure.clientHeight;
    if (!figureWidth || !figureHeight) return;
      
    const img = figure.querySelector("img");
    
    const imgHeight = img.clientHeight;
    const imgWidth = img.clientWidth;
    if (!imgWidth || !imgHeight) return;
    
    const viewportHeightLimit = viewportHeight - 4 * marginH;
    const viewportWidthLimit = viewportWidth - 4 * marginW;
      
    if (figureHeight > viewportHeightLimit || figureWidth > viewportWidthLimit) {

      const ratioH = figureHeight / viewportHeightLimit;
      const ratioW = figureWidth / viewportWidthLimit;
        
      const scaleRatio = Math.max(ratioH, ratioW);

      img.style.width = (imgWidth / scaleRatio) + 'px';
      img.style.height = (imgHeight / scaleRatio) + 'px';
    };
  });
}

// --- Fonction adjustGraph (extrait de ton code) ---
function adjustGraph () {
  document.querySelectorAll("figure").forEach(figure => {
    const img = figure.querySelector("img");
    if (!img) return;

    figure.style.textAlign = "center";

    // Supprimer les anciens wrappers boutons si existants (nettoyage)
    const oldWrapper = figure.querySelector(".download-wrapper");
    if (oldWrapper) {
      oldWrapper.remove();
    }

    const caption = figure.querySelector("figcaption");
    if (caption) {
      const captionRect = caption.getBoundingClientRect();
      const imgRect = img.getBoundingClientRect();
      const gap = imgRect.left - captionRect.left;
      caption.style.width = `${imgRect.width}px`;
      caption.style.transform = `translateX(${gap}px)`;
      caption.style.textAlign = "left";
    }

    const baseName = img.getAttribute("data-name");
    if (!baseName) return;

    const scripts = figure.querySelectorAll(`script[data-name="${baseName}"]`);
    if (scripts.length === 0) return;

    const filesData = {};
    scripts.forEach(script => {
      const type = script.getAttribute("data-type");
      const base64content = script.textContent.trim();
      filesData[type] = base64content;
    });

    const btn = document.createElement("button");
    btn.textContent = "Télécharger";
    btn.classList.add('btn');

    const linksSpan = document.createElement("span");
    linksSpan.style.display = "none";
    linksSpan.style.marginLeft = "0.5em";

    function makeLink(type, base64data) {
      const mimeMap = {
        csv: "text/csv",
        png: "image/png",
        svg: "image/svg+xml"
      };
      const mime = mimeMap[type] || "application/octet-stream";
      const href = `data:${mime};base64,${base64data}`;

      const a = document.createElement("a");
      a.href = href;
      a.download = `${baseName}.${type}`;
      a.textContent = type;
      a.style.marginRight = "0.3em";
      a.style.color = "#000091";

      return a;
    }

    Object.entries(filesData).forEach(([type, b64], i, arr) => {
      const link = makeLink(type, b64);
      linksSpan.appendChild(link);
      if (i < arr.length - 1) {
        linksSpan.appendChild(document.createTextNode(" | "));
      }
    });

    btn.addEventListener("click", () => {
      linksSpan.style.display = (linksSpan.style.display === "none") ? "inline" : "none";
    });

    const wrapper = document.createElement("div");
    wrapper.classList.add("download-wrapper");
    wrapper.style.marginTop = "0.5em";   // <-- Ici on ajoute plus d'espace
    wrapper.appendChild(btn);
    wrapper.appendChild(linksSpan);
    figure.appendChild(wrapper);

    const wrapperRect = wrapper.getBoundingClientRect();
    const imgRect = img.getBoundingClientRect();
    const gapWrapper = imgRect.left - wrapperRect.left;
    wrapper.style.transform = `translateX(${gapWrapper}px)`;
    wrapper.style.textAlign = "left";
    wrapper.style.width = `${imgRect.width}px`;
  });
}

let resizeTimeout;

window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  
  resizeTimeout = setTimeout(() => {
    location.reload();
  }, 300);
});

// Gérer le bouton figé en bas à droite de la dataviz
function setupFixedButton() {
  // Ton code pour observer le bouton et gérer l'affichage du bouton fixe
  const originalButton = document.getElementById('originalButton');
  const fixedButton = document.getElementById('fixedButton');

  if (!originalButton || !fixedButton) return;

  // Observer si le bouton original est visible dans le viewport
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        fixedButton.style.display = 'none';
      } else {
        fixedButton.style.display = 'block';
      }
    });
  });

  observer.observe(originalButton);
}

 // Objectif : Charger l'ensemble des fonction utlise au zoom dans le bon ordre, après avoir chargé la page //
// ======================================================================================================= //

/**
 * Initialisation à la fin du chargement de la page :
 * - Détection des bulles narratives
 * - Préparation des zooms pour chaque section .map
 * - Activation du zoom dynamique au scroll
 */

// Initialisation de iframeZoomOrder en amont du script
const iframeZoomOrder = {};

// --- Chargement de la page principal (ton code existant) ---
window.addEventListener("load", async () => {
  // waitForBulles etc. (ton code d'origine)

  waitForBulles("main .cr-section .narrative-col .trigger .narrative", async (bulles) => {
    setupBulleTracking(bulles);
    propagateScrollamaIndex(bulles);

    const mapSections = Array.from(document.querySelectorAll(".cr-section.map"));

    for (let index = 0; index < mapSections.length; index++) {
      const section = mapSections[index];
      const parentSection = section.closest("section");
      const zoomOrderScript = parentSection.querySelector("#zoomOrder");
      if (!zoomOrderScript) {
        console.warn("Zoom Order Script Introuvable");
        continue;
      }
      const zoomOrder = JSON.parse(zoomOrderScript.textContent);
      const originalIframe = section.querySelector("iframe");
      if (!originalIframe) {
        console.warn("Iframe manquant pour la carte de cette section");
        continue;
      }
      const iframe = reloadDecodedHtmlInIframe(originalIframe);
      if (!iframe) {
        console.warn("Échec du rechargement de l'iframe décodée");
        continue;
      }
      if (iframe.id === "map") {
        iframe.id = `map-${index + 1}`;
      }
      const zoomSettings = await getZoomSettings(zoomOrder, iframe);
      const firstBubbleIndexSection = getFirstBubbleIndex(section);

      iframeZoomOrder[iframe.id] = {
        zoomOrder,
        zoomSettings,
        firstBubbleIndexSection,
        iframe,
      };
    }

    // Appels initiaux après chargement complet
    resizeStickyImages();
    recalculeNarratives();
    adjustGraph();
    setupFixedButton();
    

    window.addEventListener("scroll", () => {
      const activeIndex = getActiveBulleIndex();
      if (activeIndex !== null) {
        applyZoom(activeIndex, iframeZoomOrder);
      }
    });
  });
});
