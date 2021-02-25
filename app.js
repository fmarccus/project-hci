const productList = document.querySelector('#product-list');
const form = document.querySelector('#add-product');

function renderProduct(doc) {
    let li = document.createElement('li');
    let name = document.createElement('span');
    let price = document.createElement('span');
    let quantity = document.createElement('span');
    let cross = document.createElement('a');

    li.setAttribute('data-id', doc.id);
    name.textContent = doc.data().name;
    price.textContent = " , Php " + doc.data().price;
    quantity.textContent =", " + doc.data().quantity +" pcs left ";

    cross.textContent = 'Delete Book';
    cross.setAttribute('class', 'text-mute text-danger');
    cross.style.cursor = "pointer";
    name.setAttribute('class', 'font-weight-bold');
    price.setAttribute('class', 'font-weight-bold text-primary');
    quantity.setAttribute('class', 'font-weight-bold text-info');


    li.appendChild(name);
    li.appendChild(price);
    li.appendChild(quantity);
    li.appendChild(cross);

    productList.appendChild(li);
    //delete
    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('products').doc(id).delete();
    });

}
/*retrieve
db.collection('products').orderBy('price').get().then((snapshot) => {
    snapshot.docs.forEach(doc => {
        renderProduct(doc);
    });
});*/

//add
form.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('products').add({
        name: form.name.value,
        price: form.price.value,
        quantity: form.quantity.value
    });
    form.name.value = '';
    form.price.value = '';
    form.quantity.value = '';
});

//retrieve real time
db.collection('products').orderBy('price').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if (change.type == 'added') {
            renderProduct(change.doc);
        } else if (change.type == 'removed') {
            let li = productList.querySelector('[data-id=' + change.doc.id + ']');
            productList.removeChild(li);
        }
    });
});



