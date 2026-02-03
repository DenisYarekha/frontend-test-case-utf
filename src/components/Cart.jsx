import React, { useState, useCallback  } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { 
  removeFromCart, 
  updateQuantity, 
  clearCart,
  selectCart,
  selectCartCount,
  selectTotalPrice
} from '../store/store'

const Cart = () => {
  const dispatch = useDispatch()
  const cart = useSelector(selectCart)
  const cartCount = useSelector(selectCartCount)
  const totalPrice = useSelector(selectTotalPrice)
  
  const [isOpen, setIsOpen] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)

  const handleRemoveItem = useCallback((id) => {
    dispatch(removeFromCart(id))
  }, [dispatch])
  
  const handleUpdateQuantity = useCallback((id, quantity) => {
    if (quantity <= 0) {
      handleRemoveItem(id)
      return
    }
    dispatch(updateQuantity({ id, quantity }))
  }, [dispatch])

  const handleCheckout = useCallback(() => {
    setShowCheckout(true)
    setTimeout(() => {
      alert('Заказ оформлен!')
      dispatch(clearCart())
      setShowCheckout(false)
      setIsOpen(false)
    }, 1000)
  }, [dispatch])

  return (
    <div className="cart">
      <button 
        className="cart-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        Корзина ({cartCount})
      </button>

      {isOpen && (
        <div className="cart-dropdown">
          <div className="cart-header">
            <h3>Корзина</h3>
            <button onClick={() => setIsOpen(false)}>×</button>
          </div>

          <div className="cart-items">
            {cart.length === 0 ? (
              <p>Корзина пуста</p>
            ) : (
              cart.map(item => (
                <CartItem 
                  key={item.id}
                  item={item}
                  onRemove={handleRemoveItem}
                  onUpdateQuantity={handleUpdateQuantity}
                />
              ))
            )}
          </div>

          <div className="cart-footer">
            <div className="total">Итого: ${totalPrice}</div>
            <button 
              className="checkout-btn"
              onClick={handleCheckout}
              disabled={cart.length === 0 || showCheckout}
            >
              {showCheckout ? 'Оформляем...' : 'Оформить заказ'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const CartItem = React.memo(({ item, onRemove, onUpdateQuantity }) => (
  <div className="cart-item">
    <img src={item.image} alt={item.name} />
    <div className="item-details">
      <h4>{item.name}</h4>
      <p>${item.price}</p>
      <div className="quantity-controls">
        <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>
          -
        </button>
        <span>{item.quantity}</span>
        <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>
          +
        </button>
      </div>
    </div>
    <button 
      className="remove-btn"
      onClick={() => onRemove(item.id)}
    >
      Удалить
    </button>
  </div>
))

export default Cart