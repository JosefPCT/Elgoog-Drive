// public/js/modalHandler.js
// Create Folder Modal Handler
const createFolderModal = document.getElementById('createFolderModal');
const closeButton = document.querySelector('.close-button');


function openCreateFolderModal() {
  // let node = e.target;
  // console.log(node);
  createFolderModal.style.display = 'block';
}

function closeCreateFolderModal() {
  createFolderModal.style.display = 'none';
}

closeButton.onclick = closeCreateFolderModal;

// Close the modal if the user clicks outside of it
window.onclick = function(event) {
  if (event.target == createFolderModal) {
    closeCreateFolderModal();
  }
};

// Example action handler
function handleModalAction() {
  alert('Modal action performed!');
  closeCreateFolderModal();
}

// Create/Upload File Modal Handler