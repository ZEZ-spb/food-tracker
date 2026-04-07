import { useAuth } from './hooks/useAuth'
import { useProducts } from './hooks/useProducts'
import { LoginForm } from './components/Auth/LoginForm'
import { RegisterForm } from './components/Auth/RegisterForm'
import { useState, useEffect } from 'react'
import { ProductsTable } from './components/Products/ProductsTable'

function App() {
  const { token, email, isAuthenticated, login, register, logout, removeUser, updateEmail, updatePassword } = useAuth()
  const { products, getProducts, createProduct, updateProduct, removeProduct,
    updatePhoto, removePhoto, clearProducts } = useProducts()

  const [showRegister, setShowRegister] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')

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

  const handleUpdateEmail = async () => {
    await updateEmail(newEmail)
    setNewEmail('')
    setShowEmailModal(false)
  }





const handleUpdatePassword = async () => {
    await updatePassword(currentPassword, newPassword)
    setCurrentPassword('')
    setNewPassword('')
    setShowPasswordModal(false)
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
                {/* <li><button className="dropdown-item">Изменить email</button></li> */}
                <li><button className="dropdown-item" onClick={() => setShowEmailModal(true)}>Изменить email</button></li>
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





      {showEmailModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Изменить email</h5>
                <button className="btn-close" onClick={() => setShowEmailModal(false)} />
              </div>
              <div className="modal-body">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Новый email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowEmailModal(false)}>
                  Отмена
                </button>
                <button className="btn btn-primary" onClick={handleUpdateEmail}>
                  Сохранить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}









      {showPasswordModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Изменить пароль</h5>
                <button className="btn-close" onClick={() => setShowEmailModal(false)} />
              </div>

              <div className="modal-body">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Текущий пароль"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>

              <div className="modal-body">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Новый пароль"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowPasswordModal(false)}>
                  Отмена
                </button>
                <button className="btn btn-primary" onClick={handleUpdatePassword}>
                  Сохранить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}








    </div>
  )
}
export default App