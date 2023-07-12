import { useState, useEffect } from 'react';
import axios from 'axios';
import './output.css';
import { Button, CircularProgress, Drawer, Fade, Paper, Rating, TextField } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [disable, setDisable] = useState(false);
  const [products, setProducts] = useState([]);
  const [currentProduct, setCurrentProduct] = useState({});
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [randomProduct, setRandomProduct] = useState('');

  const openCart = (product) => {
    setOpen(true);
    setPreview(product.image);
    setCurrentProduct(product);
    setRandomProduct(products[Math.floor(Math.random() * products.length)]);
    // console.log(Math.floor(Math.random() * products.length))
  }

  const updateQuantity = (method) => {
    let updateData = currentProduct;
    setDisable(true);

    if(method === 1) {
      updateData.rating.count++;
      axios.put('https://fakestoreapi.com/carts/7', updateData)
        .then(res => {
          setQuantity(prev => prev + 1);
          setDisable(false);
          setTotalCost(prev => prev + currentProduct.price);
        });
    } else {
      if(quantity > 0) {
        updateData.rating.count--;
        axios.put('https://fakestoreapi.com/carts/7', updateData)
          .then(res => {
            setQuantity(prev => prev - 1);
            setDisable(false);
            setTotalCost(prev => prev - currentProduct.price);
          });
      } else {
        setDisable(false);
      }
    }
  }

  useEffect(() => {
    axios.get('https://fakestoreapi.com/products?limit=10')
      .then(res=> {
        setProducts(res.data);
        setIsLoading(false);
      });
  }, []);

  return isLoading ? (
    <div className='flex justify-center items-center w-full h-screen'>
      <CircularProgress size={72} />
    </div>
  ) : (
    <div className="flex flex-wrap w-full">
      <h1 className='font-bold text-teal-600 text-7xl w-full text-center my-8'>Shopify</h1>

      {
        products.map(product => (
          <div className='w-full sm:w-1/2 md:w-1/4 h-96 p-4' key={product.id}>
            <Fade in={true}>
              <Paper className='flex flex-col w-full h-full shadow-xl'>
                <div className='shop-card flex flex-col justify-center relative w-full h-full text-white bg-violet-500 overflow-hidden'>
                  <div className='flex flex-col justify-center items-center w-3/4 h-full'>
                    <h1 className='font-bold text-lg p-4 text-center'>{product.title}</h1>
                    <Rating value={product.rating.rate} readOnly />
                    <p className='my-2'>Price: ${product.price}</p>
                    <p className='my-2'>Quantity: {product.rating.count}</p>
                  </div>
                  <div className='absolute top-0 left-0 w-full h-full bg-white'>
                    <img src={product.image} alt="product" className='absolute top-0 left-1/2 -translate-x-1/2 w-auto h-full' />
                  </div>
                </div>
                <Button
                  color='secondary'
                  variant='contained'
                  className='rounded-none h-12'
                  onClick={() => openCart(product)}
                >
                  <AddShoppingCartIcon />&nbsp;Add to Cart
                </Button>
              </Paper>
            </Fade>
          </div>
        ))
      }

      <Drawer open={open} onClose={() => setOpen(false)} anchor='right'>
        <Paper className='fixed top-4 left-4 flex flex-col w-96 p-8 bg-white z-50'>
          <img src={randomProduct.image} alt='recommend' className='w-full' />
          <h1 className='font-bold text-xl'>{randomProduct.title}</h1>
        </Paper>

        <div className='flex flex-col justify-center items-center w-96 h-full'>
          <h1 className='font-bold text-3xl mb-12'>Add to Cart</h1>

          <img src={preview} alt='preview' className='w-full my-4' />

          <div className='flex items-center h-14 border-2 border-blue-400 rounded-md overflow-hidden'>
            <Button
              color='primary'
              variant='contained'
              className='w-12 h-full'
              onClick={() => updateQuantity(-1)}
              disabled={disable}
            >
              <RemoveIcon />
            </Button>
            
            <TextField
              color='primary'
              inputProps={{style:{textAlign:'center',fontSize:24,width:96,padding: 10}}}
              value={quantity}
              onChange={({target:{value}}) => setQuantity(value)}
              disabled={disable}
            />
            
            <Button
              color='primary'
              variant='contained'
              className='w-12 h-full'
              onClick={() => updateQuantity(1)}
              disabled={disable}
            >
              <AddIcon />
            </Button>
          </div>

          <div className='flex flex-col items-center mt-12'>
            <p className='text-2xl'>Total Cost</p>
            <p className='text-5xl p-4'>${totalCost}</p>
          </div>
        </div>
      </Drawer>
    </div>
  );
}

export default App;
