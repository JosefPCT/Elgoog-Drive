// public/js/modalHandler.js
const createFolderModal = document.getElementById('createFolderModal');
const closeButton = document.querySelector('.close-button');


function openModal() {
  createFolderModal.style.display = 'block';
}

function closeModal() {
  createFolderModal.style.display = 'none';
}

closeButton.onclick = closeModal;

// Close the modal if the user clicks outside of it
window.onclick = function(event) {
  if (event.target == createFolderModal) {
    closeModal();
  }
};

// Example action handler
function handleModalAction() {
  alert('Modal action performed!');
  closeModal();
}