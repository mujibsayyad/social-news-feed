function btnToggle() {
  document.getElementById('Dropdown').classList.toggle('show');
}

// Prevents menu from closing when clicked inside
document.getElementById('Dropdown').addEventListener('click', function (event) {
  alert('click outside');
  event.stopPropagation();
});

// Closes the menu in the event of outside click
window.onclick = function (event) {
  if (!event.target.matches('.dropbutton')) {
    var dropdowns = document.getElementsByClassName('dropdownmenu-content');

    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
};

const dBtn = document.querySelector('.dropbutton');

dBtn.addEventListener('click', btnToggle);
