import { useAuth } from './hooks/useAuth'
import { useProducts } from './hooks/useProducts'
import { useTransactions } from './hooks/useTransactions'
import { LoginForm } from './components/Auth/LoginForm'
import { RegisterForm } from './components/Auth/RegisterForm'
import { useState, useEffect } from 'react'
import { ProductsTable } from './components/Products/ProductsTable'
import { TransactionsPage } from './components/Transactions/TransactionsPage'

function App() {
  const { token, email, currency, isAuthenticated, login, register, logout, removeUser,
    updateEmail, updatePassword, updateCurrency } = useAuth()
  const { products, getProducts, createProduct, updateProduct, removeProduct,
    updatePhoto, removePhoto, clearProducts } = useProducts()
  const { transactions, createTransaction, getTransactions, updateTransaction, removeTransaction } = useTransactions()

  const [showRegister, setShowRegister] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showTransactions, setShowTransactions] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      getProducts(token)
    }
  }, [token])

  useEffect(() => {
    if (isAuthenticated && showTransactions) {
      getTransactions(token, '1m')
    }
  }, [showTransactions, token])

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
    try {
      await updateEmail(newEmail)
      setNewEmail('')
      setEmailError('')
      setShowEmailModal(false)
    } catch (err: any) {
      setEmailError(err.response?.data?.message || 'Ошибка при изменении email')
    }
  }

  const handleUpdatePassword = async () => {
    try {
      await updatePassword(currentPassword, newPassword)
      setCurrentPassword('')
      setNewPassword('')
      setPasswordError('')
      setShowPasswordModal(false)
    } catch (err: any) {
      setPasswordError(err.response?.data?.message || 'Ошибка при изменении пароля')
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


          <div className="d-flex justify-content-between align-items-center p-3">
            {/* <div className="d-flex justify-content-end p-3"> */}

            <button className="btn btn-outline-primary" onClick={() => setShowTransactions(!showTransactions)}>
              {showTransactions ? 'Продукты' : 'Покупки'}
            </button>

            <div className="dropdown">
              <button className="btn btn-outline-secondary dropdown-toggle"
                data-bs-toggle="dropdown">
                {email}
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                {/* <li><button className="dropdown-item">Изменить email</button></li> */}
                <li><button className="dropdown-item" onClick={() => setShowEmailModal(true)}>Изменить email</button></li>
                <li><button className="dropdown-item" onClick={() => setShowPasswordModal(true)}>Изменить пароль</button></li>

                <li>
                  <div className="dropdown-item">
                    Валюта:
                    <select
                      className="ms-2"
                      value={currency}
                      onChange={(e) => updateCurrency(e.target.value as 'ILS' | 'EUR' | 'USD' | 'RUB')}
                    >
                      <option value="ILS">₪ шекель</option>
                      <option value="EUR">€ евро</option>
                      <option value="USD">$ доллар</option>
                      <option value="RUB">₽ рубль</option>
                    </select>
                  </div>
                </li>

                <li><hr className="dropdown-divider" /></li>
                <li><button className="dropdown-item" onClick={handleLogout}>Выйти</button></li>
                <li><button className="dropdown-item text-danger" onClick={handleRemoveUser}>Удалить аккаунт</button></li>
              </ul>
            </div>
          </div>

          {showTransactions ? (

            // <p>Покупки — здесь будет таблица транзакций</p>

<TransactionsPage
    transactions={transactions}
    token={token}
    period="1m"
    getTransactions={getTransactions}
    removeTransaction={removeTransaction}
    updateTransaction={updateTransaction}
    currency={currency}
/>

          ) : (
            <ProductsTable
              products={products}
              token={token}
              createProduct={createProduct}
              updateProduct={updateProduct}
              removeProduct={removeProduct}
              updatePhoto={updatePhoto}
              removePhoto={removePhoto}
              getProducts={getProducts}
              createTransaction={createTransaction}
              currency={currency}
            />
          )}

        </div>

      )}

      {showEmailModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Изменить email</h5>
                <button className="btn-close" onClick={() => { setShowEmailModal(false); setEmailError('') }} />
              </div>
              <div className="modal-body">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Новый email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />

                {emailError && <div className="alert alert-danger mt-2">{emailError}</div>}

              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => { setShowEmailModal(false); setEmailError('') }}>
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
                <button className="btn-close" onClick={() => { setShowPasswordModal(false); setPasswordError('') }} />
              </div>

              <div className="modal-body">
                <div className="input-group">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    className="form-control mb-3"
                    placeholder="Текущий пароль"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <button
                    className="btn btn-outline-secondary mb-3"
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? '🙈' : '👁️'}
                  </button>
                </div>

                <div className="input-group">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    className="form-control"
                    placeholder="Новый пароль"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? '🙈' : '👁️'}
                  </button>
                </div>

                {passwordError && <div className="alert alert-danger mt-2">{passwordError}</div>}

              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => { setShowPasswordModal(false); setPasswordError('') }}>
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