//**Déclaration de variables**//

let works; // Stocke les données des travaux
let categories; // Stocke les travaux categories//
let filterWorks;  // Stocke les travaux filtrés


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

    
