const express = require('express')
const app = express()
const port = 8080

const fs = require('fs');

const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))



const products = [
  {
    _id: '1',
    name: 'Product 1',
    price: 10
  },
  {
    _id: '2',
    name: 'Product 2',
    price: 20
  },
  {
    _id: '3',
    name: 'Product 3',
    price: 30
  }
]




const productsRouter = express.Router()

productsRouter.get('/', (req, res) => {
  const limit = req.query.limit || 10
  res.send(products.slice(0, limit))
})

productsRouter.get('/:pid', (req, res) => {
  const pid = req.params.pid
  const product = products.find(p => p._id === pid)
  res.send(product)
})

app.use('/api/products', productsRouter)





const cartsRouter = express.Router()

cartsRouter.get('/', (req, res) => {
  res.send(carts)
})

cartsRouter.get('/:cid', (req, res) => {
  const cid = req.params.cid
  const cart = carts.find(c => c._id === cid)

  if (cart) {
    res.send(cart)
  } else {
    res.status(404).send({ message: 'Cart not found' })
  }
})

app.use('/api/carts', cartsRouter)




productsRouter.post('/', (req, res) => {
  const product = req.body
  product._id = Date.now()
  product.status = true
  products.push(product)
  res.send(product)
})




productsRouter.put('/:pid', (req, res) => {
  const pid = req.params.pid

  const updatedProduct = req.body

  const productIndex = products.findIndex(p => p._id === pid)
  
  if (productIndex !== -1) {
    const product = products[productIndex]
    Object.assign(product, updatedProduct, { _id: undefined })
    res.send(product)
  } else {
    res.status(404).send({ message: 'Product not found' })
  }
})





productsRouter.delete('/:pid', (req, res) => {
  const pid = req.params.pid

  const productIndex = products.findIndex(p => p._id === pid)
  
  if (productIndex !== -1) {
    products.splice(productIndex, 1)
    res.send({ message: 'Product deleted' })
  } else {
    res.status(404).send({ message: 'Product not found' })
  }
})



cartsRouter.post('/', (req, res) => {
  const cart = req.body
  cart._id = Date.now()
  carts.push(cart)
  res.send(cart)
})



cartsRouter.get('/:cid', (req, res) => {
  const cid = req.params.cid
  const cart = carts.find(c => c._id === cid)

  if (cart) {
    res.send(cart.products)
  } else {
    res.status(404).send({ message: 'Cart not found' })
  }
})




cartsRouter.post('/:cid/product/:pid', (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;

  const body = req.body;

  if (!cart[cid]) {
    cart[cid] = {
      products: [],
    };
  }

  const cart = cart[cid];

  const existingProduct = cart.products.find(
    (product) => product.id === pid
  );

  if (existingProduct) {
    existingProduct.quantity += body.quantity;
  } else {
    cart.products.push({
      id: pid,
      quantity: body.quantity,
    });
  }

  res.send({ message: 'Producto agregado al carrito' });
});




app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`)
})