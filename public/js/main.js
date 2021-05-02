//JS for mobile navigation 
const backdrop = document.querySelector('.backdrop');
const sideDrawer = document.querySelector('.mobile-nav');
const menuToggle = document.querySelector('#side-menu-toggle');

function backdropClickHandler() {
  backdrop.style.display = 'none';
  sideDrawer.classList.remove('open');
}

//mobile menu function
function menuToggleClickHandler() {
  backdrop.style.display = 'block';
  sideDrawer.classList.add('open');
}

//when clicked call backdropClickHandler function
backdrop.addEventListener('click', backdropClickHandler);
//when clicked call menuToggleClickHandler function
menuToggle.addEventListener('click', menuToggleClickHandler);
