const container = document.querySelector('#objs');
const deleteBtns = container.querySelectorAll('button[data-cmd="delete"]');

console.log(container.childNodes);


deleteBtns.forEach(btn => {
  console.log(btn);
  btn.addEventListener('click', e => {
    let id = e.target.parentElement.getAttribute('data-id');
    fetch(`${window.location.href}/${id}`, {
        method: 'DELETE',
        credentials: 'same-origin'
      }).then(res => res.json()).then(body => id = body.deleted_id);
    container.removeChild(e.target.parentElement);
    //if(container.childNodes.length == 0) // do smth here
  })
});