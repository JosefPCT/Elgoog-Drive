// public/js/modalHandler.js

// Create Folder Modal Handler
const createFolderModal = document.getElementById('createFolderModal');
const createFolderModalCloseButton = document.querySelector('.createFolderModal.close-button');


function openCreateFolderModal() {
  // let node = e.target;
  // console.log(node);
  createFolderModal.style.display = 'block';
}

function closeCreateFolderModal() {
  createFolderModal.style.display = 'none';
}

createFolderModalCloseButton.onclick = closeCreateFolderModal;

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
const uploadFileModal = document.getElementById('uploadFileModal');
const uploadFileModalCloseButton = document.querySelector('.uploadFileModal.close-button');

function openUploadFileModal() {
  // let node = e.target;
  // console.log(node);
  uploadFileModal.style.display = 'block';
}

function closeUploadFileModal() {
  uploadFileModal.style.display = 'none';
}

uploadFileModalCloseButton.onclick = closeUploadFileModal;

// Close the modal if the user clicks outside of it
window.onclick = function(event) {
  if (event.target == uploadFileModal) {
    closeUploadFileModal();
  }
};

// Share Folder/File Modal Handler
const shareModal = document.getElementById('shareModal');
const shareModalCloseButton = document.querySelector('.shareModal.close-button');

function openShareModal() {
  // let node = e.target;
  // console.log(node);
  shareModal.style.display = 'block';
}

function closeShareModal() {
  shareModal.style.display = 'none';
}

shareModalCloseButton.onclick = closeShareModal;

// Close the modal if the user clicks outside of it
window.onclick = function(event) {
  if (event.target == shareModal) {
    closeShareModal();
  }
};

// View Share Details Modal Handler
const viewShareModal = document.getElementById('viewShareModal');
const viewShareModalCloseButton = document.querySelector('.viewShareModal.close-button');

function openViewShareModal(){
  viewShareModal.style.display = 'block';
}

function closeViewShareModal(){
  viewShareModal.style.display = 'none';
}

viewShareModalCloseButton.onclick = closeViewShareModal;;

window.onclick = function(event) {
  if (event.target == viewShareModal){
    closeViewShareModal();
  }
}


