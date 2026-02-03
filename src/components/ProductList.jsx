import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { 
  setProducts, 
  setLoading, 
  addToCart,
  selectProducts,
  selectLoading
} from '../store/store'

const CATEGORIES = {
  all: 'Все категории',
  phones: 'Телефоны',
  laptops: 'Ноутбуки',
  tablets: 'Планшеты'
}

const SORT_OPTIONS = {
  name: 'По названию',
  price: 'По цене'
}

const MOCK_PRODUCTS = [
  { id: 1, name: 'iPhone 14', price: 799, category: 'phones', image: 'https://via.placeholder.com/200', description: 'Новейший iPhone' },
  { id: 2, name: 'Samsung Galaxy S23', price: 699, category: 'phones', image: 'https://via.placeholder.com/200', description: 'Флагман Samsung' },
  { id: 3, name: 'MacBook Pro', price: 1999, category: 'laptops', image: 'https://via.placeholder.com/200', description: 'Мощный ноутбук Apple' },
  { id: 4, name: 'Dell XPS 13', price: 1299, category: 'laptops', image: 'https://via.placeholder.com/200', description: 'Премиум ноутбук Dell' },
  { id: 5, name: 'iPad Air', price: 599, category: 'tablets', image: 'https://via.placeholder.com/200', description: 'Планшет Apple' },
  { id: 6, name: 'Samsung Galaxy Tab', price: 399, category: 'tablets', image: 'https://via.placeholder.com/200', description: 'Планшет Samsung' }
]

const ProductList = () => {
  const dispatch = useDispatch()
  const products = useSelector(selectProducts)
  const loading = useSelector(selectLoading)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    dispatch(setLoading(true))
    
    setTimeout(() => {
      dispatch(setProducts(MOCK_PRODUCTS))
      dispatch(setLoading(false))
    }, 1000)
  }, [dispatch])
  
  const handleAddToCart = useCallback((product) => {
    dispatch(addToCart(product))
  }, [dispatch])

  const filteredProducts = useMemo(() => {
    const filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
      return matchesSearch && matchesCategory
    })

    return [...filtered].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'price') return a.price - b.price
      return 0
    })
  }, [products, searchTerm, selectedCategory, sortBy])

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value)
  }

  const handleSortChange = (e) => {
    setSortBy(e.target.value)
  }

  if (loading) {
    return <div className="loading">Загрузка товаров...</div>
  }

  return (
    <div className="product-list">
      <div className="filters">
        <div className="search">
          <input
            type="text"
            placeholder="Поиск товаров..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        
        <div className="filter-controls">
          <select value={selectedCategory} onChange={handleCategoryChange}>
            {Object.entries(CATEGORIES).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          
          <select value={sortBy} onChange={handleSortChange}>
            {Object.entries(SORT_OPTIONS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          
          <button onClick={() => setShowFilters(!showFilters)}>
            {showFilters ? 'Скрыть фильтры' : 'Показать фильтры'}
          </button>
        </div>
      </div>

      <div className="products">
        {filteredProducts.map(product => (
          <ProductCard 
            key={product.id} 
            product={product}
            onAddToCart={() => handleAddToCart(product)}
          />
        ))}
      </div>
    </div>
  )
}

const ProductCard = React.memo(({ product, onAddToCart }) => (
  <div className="product-card">
    <img src={product.image} alt={product.name} />
    <h3>{product.name}</h3>
    <p>{product.description}</p>
    <div className="price">${product.price}</div>
    <button onClick={onAddToCart}>
      Добавить в корзину
    </button>
  </div>
))

export default ProductList