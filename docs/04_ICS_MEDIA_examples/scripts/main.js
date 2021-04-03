'use strict';

// ページの読み込みを待つ
window.addEventListener('load', init);

function init() {

  let items_list = document.querySelectorAll('.item-title');

  items_list.forEach(item => {
    let _item_name = item.textContent;
    item.addEventListener('click', function (event) {
      let elTarget = event.target;
      let src = elTarget.textContent;
      console.log('load ' + _item_name);
      
      let w = window.open('about:blank');
      let d = w.document;
    
      d.open();
      d.write('<title>' + src + '</title>');
      d.write('<body>');
      d.write('<div id="container"></div>');
      d.write('<script type="module" src="scripts/' + _item_name + '.js"></script>');
      d.write('</body>');
      d.close();
    });
  });

}
