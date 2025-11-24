// public/js/modalHandler.js
const createFolderModal = document.getElementById('createFolderModal');
const closeButton = document.querySelector('.close-button');
// const modalTitle = document.getElementById('modalTitle');
// const modalBody = document.getElementById('modalBody');
// const modalActionButton = document.getElementById('modalActionButton');

function openModal(title, bodyContent, actionButtonText, actionCallback) {
  // modalTitle.textContent = title;
  // modalBody.textContent = bodyContent;
  // modalActionButton.textContent = actionButtonText;
  // modalActionButton.onclick = actionCallback; // Assign the callback for the action button
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