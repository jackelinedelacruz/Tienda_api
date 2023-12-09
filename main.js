const content = document.querySelector('.content-card')
let cart = []
let totales = []
let countContent = document.querySelector('#count')
let count = 0
let totalContent = document.querySelector('#total')
let total = 0


document.addEventListener('DOMContentLoaded', ()=> {
    main()
})


function main(){
    getAllCategories()
    getAllProducts()

    const cart = document.querySelector('.fa-cart-shopping')
    const showMobileCategories = document.querySelector('.fa-bars')
    const home = document.querySelector('#home')
    const categories = document.querySelector('.categories')
    countContent.innerHTML = count
    totalContent.innerHTML = `$${total}`
    home.addEventListener('click', getAllProducts)
    cart.addEventListener('click',showListCard)
    showMobileCategories.addEventListener('click', (e)=> {
        categories.classList.toggle('inactive')
    })
}

const showListCard = ()=> {
    const listShopping = document.querySelector('.listShopping')
    listShopping.classList.toggle('inactive')

}

const getAllCategories = async ()=> {
    const contententCategories = document.querySelector('.categories')
    try {
        const url = "https://fakestoreapi.com/products/categories"
        const respuesta = await fetch(url)
        const resultado = await respuesta.json()
        resultado.forEach(categories => {
            const p = document.createElement('p')
            p.innerHTML = categories
            p.addEventListener('click', ()=> {
                getCategory(categories)
            })
            contententCategories.appendChild(p)
        })
    } catch (error) {
        console.log(error);
    }
}

const getAllProducts = async ()=> {
    try {
        const url = "https://fakestoreapi.com/products"
        const respuesta = await fetch(url)
        const resultado = await respuesta.json()
        showProducts(resultado)
    } catch (error) {
        console.log(error);
    }
    
}

const getCategory = async (category)=> {
    try {
        const url = `https://fakestoreapi.com/products/category/${category}`
        const respuesta = await fetch(url)
        const resultado = await respuesta.json()
        showProducts(resultado)
    } catch (error) {
        console.log(error);
    }
    
}

const showProducts = (products)=>{
    removeHTML(content)
    products.forEach((product, i )=> {
        const {id,title, image,price} = product
        const card = document.createElement('DIV')
        card.classList.add('card')
        const infoCard = document.createElement('DIV')
        infoCard.classList.add('infoCard')
        const imageProduct = document.createElement('IMG')
        imageProduct.src = image
        const titleProduct = document.createElement('H2')
        titleProduct.innerText = title
        titleProduct.addEventListener('click', ()=> {
            showModal(product)
        })
        const priceProduct = document.createElement('P')
        priceProduct.innerText = `$${price}`
        const button = document.createElement('button')
        button.addEventListener('click', ()=> {
            const inCartIndex = cart.findIndex(item => item.id === id);
            if(inCartIndex !== -1){
                cart[inCartIndex].total += price;
                cart[inCartIndex].quantity += 1
            }else{
                cart.push({
                    id,
                    title,
                    image,
                    price,
                    total: price,
                    quantity: 1
                })
                
            }
            totales.push(price)
            let totalGeneral = totales.reduce((a,b) => a + b,0)
            countContent.innerHTML = count += 1
            totalContent.innerHTML = `$${totalGeneral.toLocaleString("en")}`;
            addCard(cart)

        })
        button.innerText = "Add to card"
        infoCard.append(imageProduct,titleProduct,priceProduct)
        card.append(infoCard,button)
        content.append(card)

    });
}



const addCard = (products)=> {
    const contentListShopping = document.querySelector('.content-listShopping')
    removeHTML(contentListShopping)
    products.forEach(product => {
        const contentProduct = document.createElement('div')
        const removeProduct = document.createElement('span')
        removeProduct.innerHTML = "X"
        removeProduct.addEventListener('click', ()=> {
            deleteProduct(product)
        })
        contentProduct.classList.add('contentProductList')
        contentProduct.dataset.idProduct = product.id
        const img = document.createElement('IMG')
        img.src = product.image
        const title = document.createElement('H3')
        title.innerText = product.title
        const price = document.createElement('p')
        price.innerText = `$${product.total.toLocaleString("en")}`
        contentProduct.append(img,title, price, removeProduct)
        contentListShopping.append(contentProduct)
    })
}

const showModal = (product)=> {
    const modal = document.createElement('DIV');
    modal.classList.add('modal')
    modal.innerHTML = `
    <div class="mooreInfo">
        <span class="closed">X</span>
        <h2>${product.title}</h2>
        <img src=${product.image} alt=${product.title}/>
        <p>${product.description}</p>
    </div>
    `
    setTimeout(() => {
        const mooreInfo = document.querySelector('.mooreInfo');
        mooreInfo.classList.add('animated')
    }, 0)

    modal.addEventListener('click', e => {
        e.preventDefault()

        if(e.target.classList.contains('closed')){
            const mooreInfo = document.querySelector('.mooreInfo');
            mooreInfo.classList.add('close')
            setTimeout(() => {
                modal.remove();
            }, 500);
        }
    })

    document.querySelector('.content').appendChild(modal)
}

const deleteProduct = (product)=> {
    countContent.innerHTML = count -= product.quantity
    const filterProduct = cart.filter(p => p.id !== product.id)
    cart = [...filterProduct]
    
    const newTotalGeneral = filterProduct.reduce((total, p) => total + p.total, 0);
    if(newTotalGeneral === 0){
        totales = []
        console.log(totales);
    }
    totalContent.innerHTML = `$${newTotalGeneral.toLocaleString("en")}`;
    addCard(filterProduct);
}

function cerrar(){

}

const removeHTML = (html)=> {
    while(html.firstChild){
        html.removeChild(html.firstChild)
    }
}