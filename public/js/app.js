// const main = document.querySelector('.main');
// const container = document.querySelector('.container');
// const feed = document.querySelectorAll('.feed');
// const dBtn = document.querySelectorAll('.dropbutton');
// const dropdownMenu = document.querySelectorAll('.dropdownmenu');
// const dropdownenuContent = document.querySelector('.dropdownmenu-content');

// // function btnToggle() {
// //   document.getElementById('Dropdown').classList.toggle('show');
// // }

// // function feedAddEventListener() {
// //   dropdownMenu.forEach((e) => {
// //     e.addEventListener('click', (e) => {
// //       const c = e.target.closest('.dropbutton');
// //       console.log(c);

// //       dBtn.forEach((p) => {
// //         p.addEventListener('click', btnToggle);
// //       });
// //     });
// //   });
// // }

// function btnToggle(id) {
//   const toToggle = document.querySelector(`[data-toggle='${id}']`);
//   toToggle.classList.toggle('show');
// }

// function feedAddEventListener() {
//   dBtn.forEach((p) => {
//     let id = p.getAttribute('data-id');
//     p.addEventListener('click', () => btnToggle(id));
//   });
// }

// feedAddEventListener();

// // Prevents menu from closing when clicked inside
// document.getElementById('Dropdown').addEventListener('click', function (event) {
//   event.stopPropagation();
// });

// // Closes the menu in the event of outside click
// window.onclick = function (event) {
//   if (!event.target.matches('.dropbutton')) {
//     var dropdowns = document.getElementsByClassName('dropdownmenu-content');

//     var i;
//     for (i = 0; i < dropdowns.length; i++) {
//       var openDropdown = dropdowns[i];
//       if (openDropdown.classList.contains('show')) {
//         openDropdown.classList.remove('show');
//       }
//     }
//   }
// };

const main = document.querySelector('.main');
const container = document.querySelector('.container');
const feed = document.querySelectorAll('.feed');
const dBtn = document.querySelectorAll('.dropbutton');
const dropdownMenu = document.querySelectorAll('.dropdownmenu');
const dropdownenuContent = document.querySelector('.dropdownmenu-content');

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
