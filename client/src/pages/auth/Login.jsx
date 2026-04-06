import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Login({ onLogin }) {
	const navigate = useNavigate()
	const [formData, setFormData] = useState({ email: '', password: '' })
	const [error, setError] = useState('')

	const handleSubmit = (event) => {
		event.preventDefault()

		if (!formData.email.trim() || !formData.password) {
			setError('Please fill in all required fields.')
			return
		}

		const result = onLogin(formData)

		if (!result.ok) {
			setError(result.message)
			return
		}

		setError('')
		navigate('/', { replace: true })
	}

	return (
		<section className="auth-card" aria-label="Login page">
			<p className="eyebrow">Welcome back</p>
			<h2>Login</h2>
			<p className="subtitle">Sign in to continue to your Taskflow workspace.</p>

			<form className="auth-form" noValidate onSubmit={handleSubmit}>
				<label className="auth-field" htmlFor="login-email">
					<span>Email</span>
					<input
						id="login-email"
						type="email"
						name="email"
						placeholder="you@example.com"
						value={formData.email}
						onChange={(event) =>
							setFormData((prev) => ({ ...prev, email: event.target.value }))
						}
					/>
				</label>

				<label className="auth-field" htmlFor="login-password">
					<span>Password</span>
					<input
						id="login-password"
						type="password"
						name="password"
						placeholder="Enter password"
						value={formData.password}
						onChange={(event) =>
							setFormData((prev) => ({ ...prev, password: event.target.value }))
						}
					/>
				</label>

				{error ? <p className="auth-error">{error}</p> : null}

				<button type="submit" className="primary-btn auth-btn">
					Login
				</button>
			</form>

			<p className="auth-meta">
				Don&apos;t have an account? <Link to="/signup">Create one</Link>
			</p>
		</section>
	)
}

export default Login
