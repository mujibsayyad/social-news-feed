const dBtn = document.querySelectorAll('.dropbutton');

function btnToggle(id) {
  const toToggle = document.querySelector(`[data-toggle='${id}']`);
  toToggle.classList.toggle('show');
}

function feedAddEventListener() {
  dBtn.forEach((p) => {
    let id = p.getAttribute('data-id');
    p.addEventListener('click', () => btnToggle(id));
  });
}

feedAddEventListener();

// Prevents menu from closing when clicked inside
document.getElementById('Dropdown').addEventListener('click', function (event) {
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
