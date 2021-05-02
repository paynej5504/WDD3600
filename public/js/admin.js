const deleteProduct = (btn) => {
    //get product id
    const prodId = btn.parentNode.querySelector('[name=productId]').value;
    const csrf = btn.parentNode.querySelector('[name=_csrf]').value;

    // closest element you want to delete is article
    const productElement = btn.closest('article');
    // send requests
    fetch('/admin/product/' + prodId, {
        //configure fetch request
        method: 'DELETE',
        headers: {
            'csrf-token': csrf
        }
    }).then(result => {
        return result.json();
    })
    .then(data => {
        //remove product
        console.log(data);
        productElement.parentNode.removeChild(productElement);
    })
    .catch(err => {
        console.log(err);
    });
};