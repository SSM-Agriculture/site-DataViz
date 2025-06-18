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
          
          
  // ====================== //
 // Gestion des infobulles // 
// ====================== //

 // Objectif : Ouvrir une bulle avec du texte à l'intérieur lorsque l'utilisateur click sur un certain élément de la Viz //
// ==================================================================================================================== //


   // Précision sur les éléments utilisés : ---------------------------------------- //
  // tooltip-container (appelé container) = Cercle jaune présent en dessous du "?"  //
 // tooltip-question (appelé question) = "?"                                       //
// tooltip-content (appelé content) = Bloc ouvert lorsque l'on clique sur le "?"   //


// Charger le contenu de la page
document.addEventListener("DOMContentLoaded", function () {
  // Collecter l'ensemble des infobulles du document 
  const tooltips = document.querySelectorAll(".tooltip-container");
  
// Pour chaque infobulle du document, ouvrir un bloc avec du texte dedans lorsque l'on clique dessus
tooltips.forEach((tooltip) => {
  // Réagir au clic
  tooltip.addEventListener("click", function (e) {
    // Empêcher qu'une autre infobulle ne soit ouverte en même temps
    e.stopPropagation();
    // Assigner la classe active à l'infobulle
    tooltip.classList.toggle("active");

    // Fermer toutes les autres
    tooltips.forEach((other) => {
      if (other !== tooltip) {
        other.classList.remove("active");
     }
    });
  });
});

// Réagir au clic sur la page html
document.addEventListener("click", function () {
  // Lorsque l'on re-clic sur la page (peut importe où), cela ferme l'infobulle ouverte
  tooltips.forEach((tooltip) => tooltip.classList.remove("active"));
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

            // Tester si la bulle dépasse sur la gauche, et si oui, la décaler vers la droite
            if (adjustedContentLeft < 0) {
              // Calculer la correction horizontale finale à appliquer sur content
              const delta = - correctionX - adjustedContentLeft + (1/100)*viewportWidth - (50/100)*contentRect.width;
              console.log("Décale vers la droite/bas de :", delta, correctionY);
              // Appliquer les corrections horizontales et verticales sur content 
              content.style.transform = `translate(${delta}px, ${correctionY}px)`;
                
            } 
            
            // Tester si la bulle dépasse sur la droite, et si oui, la décaler vers la gauche
            if (adjustedContentRight > viewportWidth) {
              // Calculer la correction jorizontale finale à appliquer sur content
              const delta = - correctionX - (contentRect.right - viewportWidth) - (1/100)*viewportWidth - (50/100)*contentRect.width;
              console.log("Décale vers la gauche/bas de :", delta, correctionY);
              // Appliquer les corrections horizontales et verticales sur content 
              content.style.transform = `translate(${delta}px, ${correctionY}px)`;
            }
            
          // Si la bulle n'a pas la classe "active" on la replace à son emplacement initial
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

 // Objectif des fonctions : appliquer une classe "active" pour les bulles une fois dans le viewport //
// ================================================================================================ //


/**
 * Fonction utilitaire qui attend que les éléments "bulles" soient présents dans le DOM.
 * Elle exécute un callback dès que ces éléments sont détectés (ou affiche un avertissement après plusieurs tentatives).
 *
 * @param {string} selector - Sélecteur CSS pour cibler les bulles.
 * @param {function} callback - Fonction à exécuter une fois les bulles disponibles.
 * @param {number} maxAttempts - Nombre maximal de tentatives avant abandon (par défaut : 20).
 * @param {number} interval - Intervalle entre chaque tentative (en ms, par défaut : 200).
 */
function waitForBulles(selector, callback, maxAttempts = 20, interval = 200) {
  let attempts = 0;
  const timer = setInterval(() => {
    const bulles = Array.from(document.querySelectorAll(selector));
    if (bulles.length > 0) {
      clearInterval(timer);
      callback(bulles);
    } else if (++attempts >= maxAttempts) {
      clearInterval(timer);
      console.warn("Les bulles n'ont pas été trouvées.");
    }
  }, interval);
}




  /////////////////////////////////////
 // Fonction : setupBulleTracking() //
////////////////////////////////////

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
function getCentroids(iframe) {
  
  // Test si l'iframe chargé n'est pas vide, s'il est vide => renvoi une erreur et arrête la fonction
  if (!iframe) {
    console.warn("Aucun iframe détecté");
    return;
  }
  
  
  function extractCentroids() {
    // Récupère le contenu de l'iframe dans "iframeDoc" (pour récupérer les centroïdes intégrés dans le code html de la carte)
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    // Récupérer les centroïdes (version brutes json)
    const centroidsScript = iframeDoc.getElementById("centroids");

    if (!centroidsScript) {
      console.warn("Élément centroids introuvable dans l'iframe");
      return;
    }
    
    // Traduit le format json pour sortir les centroïdes intégrés à la carte sous forme d'une liste (Array)
    const centroids = JSON.parse(centroidsScript.texteContent);
    
    // Vérifier que les centroïdes sont bien chargés (sinon cela renvoi une erreur)
    if (!centroids) {
      console.warn("Erreur dans le chargement des centroïdes");
    }
    // Renvoyer ne sortie de fonction la liste de l'ensemble des centroïdes
    return centroids;
  }
  // Renvoyer ne sortie de fonction la liste de l'ensemble des centroïdes
  return extractCentroids();
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
function getZoomSettings(zoomOrder, iframe) {
  
  // Récupérer l'ensemble des centrïdes de l'iframe
  const centroids = getCentroids(iframe);
  if (!centroids) {
    console.warn("Les centroides n'ont pas pu être chargés");
    return;
  }
  
  // Initialisation de la liste qui va répertorier les paramètres de zoom, en lien avec les élements de la liste zoomOrder
  const zoomSettings = {};
  
  // Parcourir la liste des département ciblés dans zoomOrder et affecter pour chacun d'eux les paramètres de zoom dans zoomSettings
  zoomOrder.forEach((depName, i) => {
    // Récupérer les coordonnées du centroïde correspondant à chacun des élements de zoomOrder
    // Si aucune correspondance n'est trouvée => renvoi undefined
    const centroide = centroids.find(c => c.region === depName);
    // Affecte les paramètre de zoom (dans zoomSettings) pour le département ciblé selon leur index d'apparition dans zoomOrder (ici défini par "i").
    if (centroide) {
      zoomSettings[i] = {
        // Cette version de scale (=puissance du zoom) permet d'affecter un scale de 6, si le terme de zoomOrder testé est "France", sinon cela affecte 9 par défaut.
        // Cela permet d'avoir une puissance de zoom différente selon les éléments.
        scale: depName === "France" ? 6 : 9,
        lat: centroide.lat,
        lng: centroide.lng
      };
    }
  });

  if (!Object.keys(zoomSettings).length) {
    console.warn("Zoom Settings non chargés");
    return;
  }
  // Renvoi en fin de fonction la liste des paramètres de zoom.
  return zoomSettings;
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
      // Si oui, assigner à lastValidIndex l'index Scrollama de ce .trigger
      lastValidIndex = parseInt(trigger.dataset.scrollamaIndex, 10);
      // Assigner à la bulle un index Scrollama fictif
      bulle.dataset.scrollamaIndexPropagated = lastValidIndex;
    } else if (lastValidIndex !== null) {
      // Si non, assigner à la bulle le lastValidIndex (= cette bulle aura le même index fictif que la précédente)
      bulle.dataset.scrollamaIndexPropagated = lastValidIndex;
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
  if (!current) return;
  
  // Récupérer l'iframe dans un objet "map"
  const map = iframe.contentWindow.map;
  // Réupérer les fonctionnalité offertes par Leaflet dans un objet "L"
  const L = iframe.contentWindow.L;
  if (!map || typeof map.setView !== "function") {
    console.warn("Objet 'map' introuvable");
    return;
  }
  
  // Initialise ou ferme la fonctionalité de popup de Leaflet
  map.closePopup();
  
  // Zoomer sur la bonne zone, en lien avec la bulle active du viewport
  // Pour la première bulle de la section, uniquement zoomer sur la zone en question
  if (index === firstBubbleIndexSection) {
    map.setView([current.lat, current.lng], current.scale);
  // Pour les autres bulles, faire d'abord un dé-zoom sur le centre initial de la carte, puis zoomer sur la zone ciblée
  } else {
    map.setView([zoomSettings[0].lat, zoomSettings[0].lng], zoomSettings[0].scale);
    setTimeout(() => {
      map.setView([current.lat, current.lng], current.scale);
      const depName = zoomOrder[relativeIndex];
      // afficher un popup avec le nom du département (sauf quand c'est le zoom initial = france entière)
      if (L && depName && depName !== "France") {
        // Créer le popup
        const popup = L.popup()
          // Y intégrer les coordonnées du département ciblé
          .setLatLng([current.lat, current.lng])
          // Afficher le nom du département ciblé dans le popup
          .setContent(`<strong>${depName}</strong>`);
        // Ouvrir le popup
        map.openPopup(popup);
      }
    }, 1000);
  }
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

// Charger la page (/!\ primordial pour accéder à l'ensemble des élements)
window.addEventListener("load", () => {
  waitForBulles("main .cr-section .narrative-col .trigger .narrative", (bulles) => {
    setupBulleTracking(bulles);
    propagateScrollamaIndex(bulles);
    
    // Collecter l'ensemble des sections sections CloseRead contenant une carte
    const mapSections = Array.from(document.querySelectorAll(".cr-section.map"));
    
    // Pour chacune de ces sections, rentrer les données de zoom, iframe, ... dans iframeZoomOrder
    mapSections.forEach((section, index) => {
      // Récupère la section Quarto dans laquelle se trouve la carte
      const parentSection = section.closest("section");
      // Récupère la liste des département sur lesquels il faut appliquer un zoom
      const zoomOrderScript = parentSection.querySelector("#zoomOrder");
      if (!zoomOrderScript) {
        console.warn("Zoom Order Script Introuvable");
        return;
      }
      
      // Transformer une chaîne JSON en objet JavaScript
      const zoomOrder = JSON.parse(zoomOrderScript.textContent);
      // Collecter l'iframe de la section
      const iframe = section.querySelector("iframe");

      if (!iframe) {
        console.warn("Iframe manquant pour la carte de cette section");
        return;
      }

      // Donner un ID unique à chaque iframe pour le suivi
      if (iframe.id === "map") {
        iframe.id = `map-${index + 1}`;
      }
      
      // Récupérer les paramètres de zoom (logitude, latitude, ...) pour chacun des département de la liste "zoomOrder"
      const zoomSettings = getZoomSettings(zoomOrder, iframe);
      // Récupérer l'index de la première bulle de la section 
      const firstBubbleIndexSection = getFirstBubbleIndex(section);
      
      // Intégrer l'ensemble des données citées précédemment dans iframeZoomOrder
      iframeZoomOrder[iframe.id] = {
        zoomOrder,
        zoomSettings,
        firstBubbleIndexSection,
        iframe,
      };
    });
    
    // Écoute du scroll pour déclencher les zooms => fait tourner cette partie du code à chaque mouvement de scroll
    window.addEventListener("scroll", () => {
      // Récupère l'index de la bulle actuellement visible dans le viewport
      const activeIndex = getActiveBulleIndex();
      if (activeIndex !== null) {
        // Application de la fonction applyZoom
        applyZoom(activeIndex, iframeZoomOrder);
      }
    });
  });
});


// ===== //
// Autre //
// ===== //

// Centrer les images qui ont comme classe "img-fluid-custom"
document.querySelectorAll('p').forEach(p => {
  if (p.querySelector('img.img-fluid-custom')) {
    p.style.textAlign = 'center';
  }
});

