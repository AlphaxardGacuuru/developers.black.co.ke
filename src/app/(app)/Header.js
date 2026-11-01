// A page heading in the other Black apps' style (gallery's Heading); the
// floating app header above it already holds the navigation.
const Header = ({ title, description }) => {
	return (
		<header className="space-y-0.5">
			<h2 className="text-xl font-semibold tracking-tight">{title}</h2>
			{description && (
				<p className="text-sm text-muted-foreground">{description}</p>
			)}
		</header>
	)
}

export default Header
