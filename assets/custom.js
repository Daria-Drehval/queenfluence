/*
* Broadcast Theme
*
* Use this file to add custom Javascript to Broadcast.  Keeping your custom
* Javascript in this fill will make it easier to update Broadcast. In order
* to use this file you will need to open layout/theme.liquid and uncomment
* the custom.js script import line near the bottom of the file.
*/


(function() {
  // Add custom code below this line

  /* Cart Drawer*/
  let cartLink = document.querySelector('.cartLink');
  let cartDrawer = document.querySelector('.drawer--cart');
  let cartBlock = document.querySelectorAll('.drawer--cart .cart-block');
  let cartItem = document.querySelectorAll('.drawer--cart .cart__item');
  
  cartLink.addEventListener('click', () => {
    cartDrawer.classList.add('is-open');
    cartBlock.forEach(element => {
      element.classList.add('is-animated');
    });
    cartItem.forEach(elem => {
      elem.classList.add('is-animated');
    });
  })




  // ^^ Keep your scripts inside this IIFE function call to 
  // avoid leaking your variables into the global scope.
})();
