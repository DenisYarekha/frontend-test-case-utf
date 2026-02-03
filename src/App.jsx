import React from 'react'
import { Provider } from 'react-redux'
import { store } from './store/store'
import Header from './components/Header'
import ProductList from './components/ProductList'
import Cart from './components/Cart'
import './App.css'

function App() {
  return (
    <Provider store={store}>
      <div className="app">
        <Header />
        <div className="main-content">
          <ProductList />
          <Cart />
        </div>
      </div>
    </Provider>
  )
}

export default App
