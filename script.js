let modalQt = 1;
let cart = [];
let modalKey = 0;
let subtotal;
let desconto;
let total;

const q = e=>document.querySelector(e);
const qa = e=>document.querySelectorAll(e);

pizzaJson.map((item, index)=>{
    let pizzaItem = q('.models .pizza-item').cloneNode(true);

    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

    pizzaItem.querySelector('a').addEventListener('click', (e)=>{
        e.preventDefault();
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQt = 1;
        modalKey = key;

        q('.pizzaBig img').src = pizzaJson[key].img;
        q('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        q('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        q('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        // q('.pizzaInfo--size.selected').classList.remove('selected');

        qa('.pizzaInfo--size').forEach((size, sizeIndex) => {
            if(sizeIndex == 2) {
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });

        q('.pizzaInfo--qt').innerHTML = modalQt;

        q('.pizzaWindowArea').style.display = 'flex';
        setTimeout(() => {
            q('.pizzaWindowArea').style.opacity = 1;
        }, 200);
    });

    q('.pizza-area').append(pizzaItem);
});

// Eventos do Modal
function closeModal() {
    q('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
        q('.pizzaWindowArea').style.display = 'none';
    }, 200);
}

qa('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
});

q('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQt++;
    q('.pizzaInfo--qt').innerHTML = modalQt;
});

q('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQt > 1) {
        modalQt--;
        q('.pizzaInfo--qt').innerHTML = modalQt;
    }
});

qa('.pizzaInfo--size').forEach((size, sizeIndex) => {
    size.addEventListener('click', ()=>{
        q('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});

q('.pizzaInfo--addButton').addEventListener('click', ()=>{
    // let size = parseInt(q('.pizzaInfo--size.selected').getAttribute('data-key'));
    let size = 1;
    let identifier = pizzaJson[modalKey].id+'@'+size;
    let key = cart.findIndex( item => item.identifier == identifier );
    if(key > -1) {
        cart[key].qt += modalQt;
    } else {
        cart.push({
            identifier,
            id:pizzaJson[modalKey].id,
            size,
            qt:modalQt
        })
    }
    updateCart()
    closeModal()
})

q('.menu-openner').addEventListener('click', ()=>{
    if(cart.length > 0) {
        q('aside').style.left = 0;
    }
})

q('.menu-closer').addEventListener('click', ()=>{
    q('aside').style.left = '100vw';
})

function updateCart() {
    q('.menu-openner span').innerHTML = cart.length;
    let totalItems = 0;

    if(cart.length > 0) {
        q('aside').classList.add('show')
        q('.cart').innerHTML = '';
        subtotal = 0;
        desconto = 0;
        total = 0;
        for(let i in cart) {
            let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id )
            subtotal += pizzaItem.price * cart[i].qt;
            let cartItem = q('.models .cart--item').cloneNode(true)
            let pizzaName = `${pizzaItem.name}`;
            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;

            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qt++;
                updateCart()
            });
            
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                if(cart[i].qt > 1) {
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1);
                }
                updateCart()
            });
            totalItems += cart[i].qt;
            q('.cart').append(cartItem);
        }
        desconto = totalItems * 1;
        total = subtotal - desconto;
        q('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        q('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        q('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
    } else {
        q('aside').classList.remove('show');
        q('aside').style.left = '100vw';
    }
}

q('.cart--finalizar').addEventListener('click', ()=>{

    let pedido = [];
    let cliente = document.querySelector('#nome').value;
    let endereco = document.querySelector('#endereco').value;
    let telefone = document.querySelector('#telefone').value;
    let texto = `NOME: ${cliente} - ENDEREÇO: ${endereco} - TELEFONE: ${telefone} - PEDIDO: `;

    for(let item in cart) {
        nome = pizzaJson[cart[item].id].name;
        qt = cart[item].qt;
        texto += `Quant.: ${qt} - Prod.: ${nome} // `;
    }

    texto += `- Pagto em Dinheiro: ${total.toFixed(2)} - Outros meios de pagamento: ${subtotal.toFixed(2)}`;

    /* MSG WHATSAPP */

    let number = '559691215090';
    let msg = texto;
    let urlMsg = msg.split(' ').join('%20')
    let target = `https://wa.me/${number}?text=${urlMsg}`;

    let a = document.querySelector('.enviar-pedido');

    a.href = target;
    a.click();
    q('aside').style.left = '100vw';

    /* */ 
})
