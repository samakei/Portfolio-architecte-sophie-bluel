//**Déclaration de variables**//

let works; // Stocke les données des travaux
let categories; // Stocke les travaux categories//
let filterWorks;  // Stocke les travaux filtrés


// Déclaration de la fonction takeCategory
const takeCategory = (categories) => {
  // Sélectionne l'élément HTML avec la classe 'filters'
  const sectionFilters = document.querySelector('.filters');
  // Vide son contenu
  sectionFilters.innerHTML = '';

  // Fonction pour créer un bouton filtre
  const createButton = (text, dataId) => {
    const button = document.createElement('button'); // Crée le bouton
    button.textContent = text; // Définit le texte du bouton
    button.setAttribute('data-id', dataId); // Définit l'attribut 'data-id'
    button.classList.add('btnFilter'); // Ajoute la classe 'btnFilter'
    sectionFilters.appendChild(button); // Ajoute le bouton à la section 'filters'
    return button; // Retourne le bouton créé
  };

  // Crée un bouton "Tous" avec l'ID 0, ajout classe 'activation'
  const buttonAll = createButton('Tous', 0);
  buttonAll.classList.add('activation');

  // Fonction pour filtrer les travaux en fonction de la catégorie sélectionnée
  const filterWorks = (categoryId) => {
    // Sélectionne tous les boutons de filtre
    const btnFilters = document.querySelectorAll('.btnFilter');
    // Supprime la classe 'ativation' de tous les boutons de filtre
    btnFilters.forEach((btn) => btn.classList.remove('activation'));
    // Filtrer les travaux en fonction de l'ID de catégorie
    const filteredWorks = works.filter((el) => el.categoryId == categoryId);

    // Si des travaux filtrés sont trouvés, les affiche, sinon affiche tous les travaux
    if (filteredWorks.length !== 0) {
      takeWorks(filteredWorks);
    } else {
      takeWorks(works);
    }
  };

  // Ajoute un addEventListener au bouton "Tous" pour afficher tous les travaux
  buttonAll.addEventListener('click', () => {
    filterWorks(0);
    buttonAll.classList.add('activation'); // Marque le bouton "Tous" comme activé
  });

  // Boucle sur les catégories, création des boutons pour chaque catégorie
  categories.forEach((element) => {
    const buttonCategory = createButton(element.name, element.id);
    // Ajoute un addEventListener pour chaque bouton de catégorie
    buttonCategory.addEventListener('click', () => {
      filterWorks(element.id); // Filtre les travaux en fonction de l'ID de catégorie
      buttonCategory.classList.add('activation'); // Marque le bouton de catégorie comme activé
    });
  });
};

// Récupération des catégories depuis l'API avec fetch
fetch('http://localhost:5678/api/categories')
  .then((response) => response.json()) // Transforme la réponse en JSON
  .then(takeCategory) // Appelle la fonction takeCategory avec les données des catégories
  .catch((error) => {
    alert(`Erreur: ${error}`);
  });

//-- Récupération des projets depuis l'API -- //
fetch('http://localhost:5678/api/works')
.then((response) => response.json())
 .then((data) => {
    works = data; // Stocke les données des travaux dans la variable 'works'
    takeWorks(works); // Appelle la fonction takeWorks pour afficher les travaux
  })
  .catch((error) => {
    alert(`Erreur: ${error}`);
  });

// Fonction pour afficher la galerie de travaux
const takeWorks = (works) => {
  // Sélectionne l'élément HTML avec la classe 'gallery'
  const gallery = document.querySelector('.gallery');
  // Vide son contenu HTML
  gallery.innerHTML = '';

  // Boucle sur les travaux et création des éléments HTML pour chaque travail
   works.forEach((work) => {
    const { imageUrl, title } = work;

    const worksElement = document.createElement('figure'); // Crée un élément 'figure'
    const imageElement = document.createElement('img'); // Crée un élément 'img'
    imageElement.src = imageUrl; // Définit la source de l'image
    imageElement.alt = title; // Définit le texte alternatif de l'image

    const titleElement = document.createElement('h3'); // Crée un élément 'h3'
    titleElement.innerHTML = title; // Définit le contenu HTML du titre

    worksElement.appendChild(imageElement); // Ajoute l'image à l'élément 'figure'
    worksElement.appendChild(titleElement); // Ajoute le titre à l'élément 'figure'
    gallery.appendChild(worksElement); // Ajoute l'élément 'figure' à la galerie
  });
};

    
