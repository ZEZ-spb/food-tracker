import { useAuth } from './hooks/useAuth'
import { useProducts } from './hooks/useProducts'
import { LoginForm } from './components/Auth/LoginForm'
import { RegisterForm } from './components/Auth/RegisterForm'
import { useState, useEffect } from 'react'
import { ProductsTable } from './components/Products/ProductsTable'

function App() {
  const { token, isAuthenticated, login, register, logout } = useAuth()
  const { products, getProducts, createProduct, updateProduct, removeProduct, updatePhoto, removePhoto } = useProducts()

  const [showRegister, setShowRegister] = useState(false)
//  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (isAuthenticated) {
      getProducts(token)
    }
  }, [isAuthenticated, token])

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div>
      {!isAuthenticated ? (
        <div>
          {showRegister
            ? <RegisterForm onRegister={register} />
            : <LoginForm onLogin={login} />
          }
          <div className="text-center mt-3">
            <button className="btn btn-link" onClick={() => setShowRegister(!showRegister)}>
              {showRegister ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
            </button>
          </div>
        </div>
      ) : (
        <div>
          <ProductsTable
            products={products}
            token={token}
            createProduct={createProduct} 
            updateProduct={updateProduct}
            removeProduct={removeProduct}
            updatePhoto={updatePhoto}
            removePhoto={removePhoto}
            getProducts={getProducts}/>
          <div className="text-center mt-3">
            <button className="btn btn-danger" onClick={handleLogout}>
              Выйти
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
export default App