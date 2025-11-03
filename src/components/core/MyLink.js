import { Link, useLocation } from "react-router-dom/cjs/react-router-dom.min"

const MyLink = ({ linkTo, text, icon, className }) => {
	const location = useLocation()

	return (
		<Link
			to={`${
				location.pathname.match("/admin/")
					? "/admin"
					: location.pathname.match("/tenant/")
						? "/tenant"
						: "/super"
			}${linkTo}`}
			className={`btn mysonar-btn ${className}`}>
			<span>{icon}</span>
			{text && <span className="mx-1">{text}</span>}
		</Link>
	)
}

MyLink.defaultProps = {
	linkTo: "/",
}

export default MyLink