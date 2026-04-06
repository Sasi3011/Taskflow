import './App.css'
import { Navigate, NavLink, Outlet, Route, Routes } from 'react-router-dom'

const user = {
	fullName: 'Sasi Kumar',
	role: 'Project Manager',
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

function Dashboard() {
	return (
		<PlaceholderPage
			title="Dashboard"
			text="Dashboard component placeholder. Your analytics and summary widgets will appear here."
		/>
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

function Login() {
	return (
		<PlaceholderPage
			title="Login"
			text="Login component placeholder. Authentication form fields will be added here."
		/>
	)
}

function Signup() {
	return (
		<PlaceholderPage
			title="Signup"
			text="Signup component placeholder. New account registration fields will be added here."
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

function AppLayout() {
	const modules = [
		{ name: 'Dashboard', tag: 'Live', to: '/' },
		{ name: 'Projects', tag: '18', to: '/project' },
		{ name: 'Team Members', tag: '12', to: '/team' },
		{ name: 'Profile', tag: 'You', to: '/profile' },
	]
	const profileInitial = user.fullName.trim().charAt(0).toUpperCase()

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
					<div className="profile-pic" aria-hidden="true">
						{profileInitial}
					</div>
					<div className="user-info">
						<p className="user-name">{user.fullName}</p>
						<p className="user-role">{user.role}</p>
					</div>
				</section>
			</aside>

			<main className="container" aria-label="Main container">
				<Outlet />
			</main>
		</div>
	)
}

function App() {
	return (
		<Routes>
			<Route element={<AppLayout />}>
				<Route path="/" element={<Dashboard />} />
				<Route path="/project" element={<Projects />} />
				<Route path="/team" element={<Team />} />
				<Route path="/profile" element={<UserProfile />} />
			</Route>
			<Route element={<AuthLayout />}>
				<Route path="/login" element={<Login />} />
				<Route path="/signup" element={<Signup />} />
			</Route>
			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
	)
}

export default App
