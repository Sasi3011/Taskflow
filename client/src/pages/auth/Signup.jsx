import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Signup({ onSignup }) {
	const navigate = useNavigate()
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
	})
	const [error, setError] = useState('')

	const handleSubmit = (event) => {
		event.preventDefault()

		if (
			!formData.name.trim() ||
			!formData.email.trim() ||
			!formData.password ||
			!formData.confirmPassword
		) {
			setError('Please fill in all required fields.')
			return
		}

		if (formData.password !== formData.confirmPassword) {
			setError('Password and Confirm Password do not match.')
			return
		}

		const result = onSignup(formData)

		if (!result.ok) {
			setError(result.message)
			return
		}

		setError('')
		navigate('/', { replace: true })
	}

	return (
		<section className="auth-card" aria-label="Signup page">
			<p className="eyebrow">Create account</p>
			<h2>Signup</h2>
			<p className="subtitle">Register with your details to start managing tasks.</p>

			<form className="auth-form" noValidate onSubmit={handleSubmit}>
				<label className="auth-field" htmlFor="signup-name">
					<span>Full Name</span>
					<input
						id="signup-name"
						type="text"
						name="name"
						placeholder="Your full name"
						value={formData.name}
						onChange={(event) =>
							setFormData((prev) => ({ ...prev, name: event.target.value }))
						}
					/>
				</label>

				<label className="auth-field" htmlFor="signup-email">
					<span>Email</span>
					<input
						id="signup-email"
						type="email"
						name="email"
						placeholder="you@example.com"
						value={formData.email}
						onChange={(event) =>
							setFormData((prev) => ({ ...prev, email: event.target.value }))
						}
					/>
				</label>

				<label className="auth-field" htmlFor="signup-password">
					<span>Password</span>
					<input
						id="signup-password"
						type="password"
						name="password"
						placeholder="Create password"
						value={formData.password}
						onChange={(event) =>
							setFormData((prev) => ({ ...prev, password: event.target.value }))
						}
					/>
				</label>

				<label className="auth-field" htmlFor="signup-confirm-password">
					<span>Confirm Password</span>
					<input
						id="signup-confirm-password"
						type="password"
						name="confirmPassword"
						placeholder="Confirm password"
						value={formData.confirmPassword}
						onChange={(event) =>
							setFormData((prev) => ({ ...prev, confirmPassword: event.target.value }))
						}
					/>
				</label>

				<p className="auth-hint">
					Password must be at least 6 characters and include a letter, number, and special
					character.
				</p>

				{error ? <p className="auth-error">{error}</p> : null}

				<button type="submit" className="primary-btn auth-btn">
					Create Account
				</button>
			</form>

			<p className="auth-meta">
				Already registered? <Link to="/login">Login here</Link>
			</p>
		</section>
	)
}

export default Signup
