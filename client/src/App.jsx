import './App.css'
import { useState } from 'react'
import { Navigate, NavLink, Outlet, Route, Routes } from 'react-router-dom'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import Dashboard from './pages/dashboard/Dashboard'

const USERS_STORAGE_KEY = 'taskflow_users'
const SESSION_STORAGE_KEY = 'taskflow_session'

function readStoredUsers() {
	try {
		const stored = localStorage.getItem(USERS_STORAGE_KEY)
		if (!stored) {
			return []
		}
		const parsed = JSON.parse(stored)
		return Array.isArray(parsed) ? parsed : []
	} catch {
		return []
	}
}

function writeStoredUsers(users) {
	localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
}

function readSessionUser() {
	try {
		const stored = sessionStorage.getItem(SESSION_STORAGE_KEY)
		if (!stored) {
			return null
		}
		const parsed = JSON.parse(stored)
		return parsed?.email ? parsed : null
	} catch {
		return null
	}
}

function writeSessionUser(user) {
	sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user))
}

function clearSessionUser() {
	sessionStorage.removeItem(SESSION_STORAGE_KEY)
}

function PlaceholderPage({ title, text }) {
	return (
		<section className="route-placeholder" aria-label={`${title} page`}>
			<p className="eyebrow">Taskflow</p>
			<h2>{title}</h2>
			<p className="subtitle">{text}</p>
		</section>
	)
}

function Projects() {
	return (
		<PlaceholderPage
			title="Projects"
			text="Projects component placeholder. Project lists, filters, and project boards will go here."
		/>
	)
}

function Team() {
	return (
		<PlaceholderPage
			title="Team"
			text="Team component placeholder. Team member directory and roles will be shown here."
		/>
	)
}

function UserProfile() {
	return (
		<PlaceholderPage
			title="User Profile"
			text="UserProfile component placeholder. Personal details, settings, and preferences will be here."
		/>
	)
}

function AuthLayout() {
	return (
		<div className="auth-shell">
			<main className="container auth-container" aria-label="Authentication container">
				<Outlet />
			</main>
		</div>
	)
}

function RequireAuth({ isAuthenticated }) {
	if (!isAuthenticated) {
		return <Navigate to="/login" replace />
	}

	return <Outlet />
}

function PublicOnly({ isAuthenticated }) {
	if (isAuthenticated) {
		return <Navigate to="/" replace />
	}

	return <Outlet />
}

function AppLayout({ sessionUser, onLogout }) {
	const modules = [
		{ name: 'Dashboard', tag: 'Live', to: '/' },
		{ name: 'Projects', tag: '18', to: '/project' },
		{ name: 'Team Members', tag: '12', to: '/team' },
		{ name: 'Profile', tag: 'You', to: '/profile' },
	]
	const displayName = sessionUser?.fullName || 'Guest User'
	const displayRole = sessionUser?.role || 'Member'
	const profileInitial = displayName.trim().charAt(0).toUpperCase()

	return (
		<div className="page-layout">
			<aside className="sidenav">
				<div className="sidenav-top">
					<div className="brand-block">
						<p className="brand-badge">Workspace</p>
						<h1 className="brand-title">Taskflow</h1>
					</div>

					<nav className="modules-nav" aria-label="Modules">
						<p className="section-label">Modules</p>
						<ul>
							{modules.map((module) => (
								<li key={module.name}>
									<NavLink
										to={module.to}
										end={module.to === '/'}
										className={({ isActive }) =>
											`module-link ${isActive ? 'active' : ''}`
										}
									>
										<span>{module.name}</span>
										<span className="module-tag">{module.tag}</span>
									</NavLink>
								</li>
							))}
						</ul>
					</nav>
				</div>

				<section className="user-section" aria-label="User profile">
					<div className="user-main">
						<div className="profile-pic" aria-hidden="true">
							{profileInitial}
						</div>
						<div className="user-info">
							<p className="user-name">{displayName}</p>
							<p className="user-role">{displayRole}</p>
						</div>
					</div>
					<button type="button" className="logout-btn" onClick={onLogout}>
						Logout
					</button>
				</section>
			</aside>

			<main className="container" aria-label="Main container">
				<Outlet />
			</main>
		</div>
	)
}

function App() {
	const [sessionUser, setSessionUser] = useState(() => readSessionUser())

	const handleSignup = ({ name, email, password }) => {
		const trimmedName = name.trim()
		const normalizedEmail = email.trim().toLowerCase()
		const strongPasswordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{6,}$/

		if (!trimmedName || !normalizedEmail || !password) {
			return { ok: false, message: 'Please fill in all fields.' }
		}

		if (!strongPasswordRegex.test(password)) {
			return {
				ok: false,
				message:
					'Password must be at least 6 characters with at least one letter, one number, and one special character.',
			}
		}

		const users = readStoredUsers()
		const userExists = users.some((user) => user.email === normalizedEmail)

		if (userExists) {
			return { ok: false, message: 'An account with this email already exists.' }
		}

		const newUser = {
			id: Date.now(),
			fullName: trimmedName,
			email: normalizedEmail,
			password,
			role: 'Member',
		}

		writeStoredUsers([...users, newUser])

		const sessionPayload = {
			fullName: newUser.fullName,
			email: newUser.email,
			role: newUser.role,
		}

		writeSessionUser(sessionPayload)
		setSessionUser(sessionPayload)

		return { ok: true }
	}

	const handleLogin = ({ email, password }) => {
		const normalizedEmail = email.trim().toLowerCase()
		const users = readStoredUsers()
		const existingUser = users.find(
			(user) => user.email === normalizedEmail && user.password === password,
		)

		if (!existingUser) {
			return { ok: false, message: 'Invalid email or password.' }
		}

		const sessionPayload = {
			fullName: existingUser.fullName,
			email: existingUser.email,
			role: existingUser.role,
		}

		writeSessionUser(sessionPayload)
		setSessionUser(sessionPayload)

		return { ok: true }
	}

	const handleLogout = () => {
		clearSessionUser()
		setSessionUser(null)
	}

	return (
		<Routes>
			<Route element={<RequireAuth isAuthenticated={Boolean(sessionUser)} />}>
				<Route element={<AppLayout sessionUser={sessionUser} onLogout={handleLogout} />}>
					<Route path="/" element={<Dashboard />} />
					<Route path="/project" element={<Projects />} />
					<Route path="/team" element={<Team />} />
					<Route path="/profile" element={<UserProfile />} />
				</Route>
			</Route>
			<Route element={<PublicOnly isAuthenticated={Boolean(sessionUser)} />}>
				<Route element={<AuthLayout />}>
					<Route path="/login" element={<Login onLogin={handleLogin} />} />
					<Route path="/signup" element={<Signup onSignup={handleSignup} />} />
				</Route>
			</Route>
			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
	)
}

export default App
