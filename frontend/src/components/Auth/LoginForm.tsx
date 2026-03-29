import { useState } from 'react'

export const LoginForm = ({ onLogin }: { onLogin: (email: string, password: string) => Promise<void> }) => {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [error, setError] = useState<string>('')

    const handleSubmit = async (): Promise<void> => {
        try {
            await onLogin(email, password)
        } catch {
            setError('Неверный email или пароль')
        }
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-4">
                    <h2 className="mb-4">Вход</h2>

                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button className="btn btn-primary w-100" onClick={handleSubmit} >
                        Войти
                    </button>

                    {error && <div className="alert alert-danger mt-3">{error}</div>}

                </div>
            </div>
        </div>
    )
}