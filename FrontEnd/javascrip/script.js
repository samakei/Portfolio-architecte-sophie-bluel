// On récupère le token depuis le localStorage
const token = localStorage.getItem('token');

//On récupère la liste des catégories
const takeCategories = async () => {
  try {
    const response = await fetch('http://localhost:5678/api/categories');
    if (!response.ok) {
      throw new Error(`Erreur: ${response.status}`);
    }
    const categories = await response.json();
    return categories;
  } catch (error) {
    alert(`Erreur: ${error}`);
  }
};

// Si token stocké, donc utilisateur loggué
if (token) {
  let updatedThumbnails;
  // On joute la barre admin, on enlève les filtres
  document.querySelector('.blackBarAdmin').classList.remove('hidden');
  document.querySelector('.filters').classList.add('hidden');
  // On ajoute le bouton Modifier et modifie la margin du titre Mes Projets
  document.querySelector('.modal-btn').classList.remove('hidden');
  const titleProject = document.querySelector('.portfolioTitleLogged');
  titleProject.style.marginBottom = '92px';

  // On modifie la valeur du bouton login en logout
  const loginBtn = document.querySelector('.loginLogout');
  loginBtn.innerHTML = 'logout';

  // On dynamise la fermeture de la modale
  const modalContainer = document.querySelector('.modal-container');
  const modalTriggers = document.querySelectorAll('.modal-trigger');

  // Affichage des vignettes des travaux dans la modale
  function displayThumbnails(works) {
    const thumbnailsModal = document.querySelector('.thumbnailsModal');
    const formModalTwo = document.querySelector('.formModalTwo');
    thumbnailsModal.innerHTML = '';
    const modalTitle = document.querySelector('.modalTitle');
    modalTitle.innerHTML = 'Galerie Photo';
    
    addWorksButton.classList.remove('hidden');
    backModalButton.classList.add('hidden');
    thumbnailsModal.classList.remove('hidden');
    formModalTwo.classList.add('hidden');

    for (let i = 0; i < works.length; i++) {
      const worksIndex = works[i];
      // Récupération de la section du Dom pour afficher la galerie
      const sectionGallery = document.querySelector('.thumbnailsModal');
      // Création Form pour les travaux
      const formElement = document.createElement('form');
      // Création de la balise figure qui affichera les travaux
      const worksElement = document.createElement('figure');
      worksElement.setAttribute('id', worksIndex.id);
      // Création des balises interne qui affichera images
      const imageElement = document.createElement('img');
      imageElement.src = worksIndex.imageUrl;
      // Création du boutton trash submit
      const trashButton = document.createElement('button');
      trashButton.setAttribute('type', 'submit');
      trashButton.setAttribute('data-id', worksIndex.id);
      const trash = document.createElement('i');
      trash.setAttribute('class', 'fa-solid fa-trash-can fa-xs trash');
      trashButton.appendChild(trash);
      // Rattachement de la balise figure à la section gallery
      sectionGallery.appendChild(formElement);
      // Rattachement du Form à la figure
      formElement.appendChild(worksElement);
      // Rattachement des balises img à la balise figure
      worksElement.appendChild(imageElement);
      // Rattachement du boutton au form
      worksElement.appendChild(trashButton);

      //Gestion de l'evenement sur le DELETE
      formElement.addEventListener('submit', (e) => {
        e.preventDefault();
        fetch(
          `http://localhost:5678/api/works/${trashButton.getAttribute(
            'data-id'
          )}`,
          {
            method: 'delete',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ).then((res) => {
          if (res.status) {
            //Met à jour la liste Works
            updatedThumbnails = works.filter(
              (work) => work.id != trashButton.getAttribute('data-id')
            );
            displayThumbnails(updatedThumbnails); //Mise à jour des vignettes
            takeWorks(updatedThumbnails);
      
          }
         
        });
      });
    }
  }

  const thumbnailsModal = document.querySelector('.thumbnailsModal');
  const formModalTwo = document.querySelector('.formModalTwo');
  const addWorksButton = document.querySelector('.addWorksButton');
  const backModalButton = document.querySelector('.back-modal');

  addWorksButton.addEventListener('click', () => {
    switchModal2();
  });

  //Ouverture de la modale pour ajout projet
  async function switchModal2() {

    let imageSrcInput = document.getElementById("File");
    let titleInput = document.getElementById("title");
    let categoryIdInput = document.getElementById("categories");

    titleInput.value = "";

    checkInputChanges(); //vérification des valeurs des champs du formulaire
    
    //Modif CSS en fonction du message d'erreur
    document.querySelector('.errorMessageCategory').classList.add('hidden');

    const errorCatMargin = document.querySelector('.form select');
    errorCatMargin.style.marginBottom = '63px';

    const errorPhotoMargin = document.querySelector('.titleLabel');
    errorPhotoMargin.style.marginTop = '30px';

    const errorTitleMargin = document.querySelector('.categoriesLabel');
    errorTitleMargin.style.marginTop = '30px';

    thumbnailsModal.classList.add('hidden');
    formModalTwo.classList.remove('hidden');

    const modalTitle = document.querySelector('.modalTitle');
    modalTitle.innerHTML = 'Ajout Photo';
    
    addWorksButton.classList.add('hidden');
    backModalButton.classList.remove('hidden');

    document.querySelector('#title').value = '';

    const categories = document.querySelector('#categories');
    categories.innerHTML = '';

    //Catégories pour le menu déroulant
    const allCategories = await takeCategories();
    categories.appendChild(document.createElement('option'));
    for (const element of allCategories) {
      const categoriesOption = document.createElement('option');
      categoriesOption.textContent = element.name;
      categoriesOption.setAttribute('value', element.id);
      categories.appendChild(categoriesOption);
    }

    //Changement de block pour affichage miniature photo
    const photoMini = document.querySelector('.photoMini');
    if (photoMini) {
      document.querySelector('.addPhotoBlockBis').classList.remove('hidden');
      photoMini.remove();
    }

    //addEventListener sur les champs du form
    imageSrcInput.addEventListener("change", checkInputChanges);
    titleInput.addEventListener("change", checkInputChanges);
    categoryIdInput.addEventListener("change", checkInputChanges);
  }

  // Vérification des champs remplis
  function checkInputChanges() {
    
    let imageSrcInput = document.getElementById("File");
    let titleInput = document.getElementById("title");
    let categoryIdInput = document.getElementById("categories");

    let imageSrc = imageSrcInput.files[0];
    let title = titleInput.value;
    let categoryId = categoryIdInput.value;
    let btnValider = document.getElementById("btnValider");

    //Si tous les champs rempli, alors bouton vert
    if (imageSrc !== undefined && title !== "" && categoryId !== "") {
      btnValider.classList.add('btn-ajouter-valid')
      document.querySelector('.errorMessageCategory').classList.add('hidden');
      const errorCatMargin = document.querySelector('.form select');
      errorCatMargin.style.marginBottom = '63px';    
    } else {
      btnValider.classList.remove('btn-ajouter-valid')
    }
  }

  //Ajout d'un projet
  async function addNewProject() {

    let imageSrcInput = document.getElementById("File");
    let titleInput = document.getElementById("title");
    let categoryIdInput = document.getElementById("categories");
    
    let validation = true;
    let imageSrc = imageSrcInput.files[0];
    let title = titleInput.value;
    let categoryId = categoryIdInput.value;

    //Si un des champs vide, message d'erreur
    if (imageSrc == undefined || title == "" || categoryId == "") {
      document.querySelector('.errorMessageCategory').classList.remove('hidden');
      const errorCatMargin = document.querySelector('.form select');
      errorCatMargin.style.marginBottom = '2px';
      const errorMessageCat = document.querySelector('.errorMessageCategory');
      errorMessageCat.style.paddingBottom = '23px';
      validation = false;
    } else if (imageSrc.size > 4194304) { //Si image trop grande, alerte
      alert("Veuillez choisir une photo de 4mo max");
      const photoMini = document.querySelector('.photoMini');
      document.querySelector('.addPhotoBlockBis').classList.remove('hidden');
      photoMini.remove();
      imageSrcInput.value = "";
      validation = false;
    }
    
    checkInputChanges();

    //Envoi du nouveau travail
    try {
      let formData = new FormData()
      formData.append("image", imageSrc);
      formData.append("title", title);
      formData.append("category", categoryId);

      if (validation) {
        const token = localStorage.getItem("token");
        const response = await fetch('http://localhost:5678/api/works', {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData
        })
        if (response.status == 201) {
          getWorks();
          alert("Projet ajouté avec succès !");
          return;
        }
        else {
          alert("Alerte, impossible d'ajouter ce projet");
          return;
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const worksForm = document.querySelector('#testForm');
    worksForm.addEventListener('submit', (e) => {
      e.preventDefault()
      addNewProject()
    })

  //Affichage de la miniature
  function showImageMini(input) {
    let file = input.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);

    const addPhotoBlock = document.querySelector('.addPhotoBlock');
    document.querySelector('.addPhotoBlockBis').classList.add('hidden');
    const photoMini = document.createElement('div');
    photoMini.classList.add('photoMini');
    addPhotoBlock.appendChild(photoMini);
    const imgMini = document.createElement('img');
    photoMini.appendChild(imgMini);

    reader.onload = function () {
      imgMini.src = reader.result;
    };
  }

  //Affichage updaté sur le bouton retour
  backModalButton.addEventListener('click', () => {
    getWorks();
  });

  const toggleModal = () => {
    modalContainer.classList.toggle('active');
    getWorks();
  };

  const getWorks = () => {
    let works;
    fetch('http://localhost:5678/api/works')
      .then((response) => response.json())
      .then((data) => {
        works = data;
        displayThumbnails(works);
        takeWorks(works);
      })
      .catch((error) => {
        alert(`Erreur: ` + error);
      });
  }

  modalTriggers.forEach((trigger) =>
    trigger.addEventListener('click', toggleModal)
  );

  // Au clic sur logout on se délog (enlève le token) et on revient sur la page index
  loginBtn.href = '#';
  loginBtn.addEventListener('click', (event) => {
    event.preventDefault();
    window.localStorage.removeItem('token');
    window.location = 'index.html';
    return 'index.html'
  });
};