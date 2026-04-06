import { useAuth } from './hooks/useAuth'
import { useProducts } from './hooks/useProducts'
import { LoginForm } from './components/Auth/LoginForm'
import { RegisterForm } from './components/Auth/RegisterForm'
import { useState, useEffect } from 'react'
import { ProductsTable } from './components/Products/ProductsTable'

function App() {
  const { token, email, isAuthenticated, login, register, logout, removeUser } = useAuth()
  const { products, getProducts, createProduct, updateProduct, removeProduct,
    updatePhoto, removePhoto, clearProducts } = useProducts()

  const [showRegister, setShowRegister] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      getProducts(token)
    }
  }, [token])

  const handleLogout = async () => {
    clearProducts()
    await logout()
  }

  const handleRemoveUser = async () => {
    if (window.confirm('Аккаунт будет удалён!')) {
        await removeUser(token)
    }
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

          <div className="d-flex justify-content-end p-3">
            <div className="dropdown">
              <button className="btn btn-outline-secondary dropdown-toggle"
                data-bs-toggle="dropdown">
                {email}
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li><button className="dropdown-item">Изменить email</button></li>
                <li><button className="dropdown-item">Изменить пароль</button></li>
                <li><hr className="dropdown-divider" /></li>
                <li><button className="dropdown-item" onClick={handleLogout}>Выйти</button></li>
                <li><button className="dropdown-item text-danger" onClick={handleRemoveUser}>Удалить аккаунт</button></li>
              </ul>
            </div>
          </div>

          <ProductsTable
            products={products}
            token={token}
            createProduct={createProduct}
            updateProduct={updateProduct}
            removeProduct={removeProduct}
            updatePhoto={updatePhoto}
            removePhoto={removePhoto}
            getProducts={getProducts} />

        </div>

      )}
    </div>
  )
}
export default App