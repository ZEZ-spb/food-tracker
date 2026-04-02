import { useState } from 'react'

export const RegisterForm = ({ onRegister }: { onRegister: (email: string, password: string) => Promise<void> }) => {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [error, setError] = useState<string>('')
    const [showPassword, setShowPassword] = useState(false)

    const handleSubmit = async (): Promise<void> => {
        try {
            await onRegister(email, password)
        } catch (err: any) {
            setError(err.response?.data?.message || 'Ошибка регистрации')
        }
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-4">
                    <h2 className="mb-4">Регистрация</h2>

                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {/* <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div> */}

                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <div className="input-group">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                className="btn btn-outline-secondary"
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? '🙈' : '👁️'}
                            </button>
                        </div>
                    </div>

                    <button className="btn btn-primary w-100" onClick={handleSubmit} >
                        Зарегистрироваться
                    </button>

                    {error && <div className="alert alert-danger mt-3">{error}</div>}

                </div>
            </div>
        </div>
    )
}