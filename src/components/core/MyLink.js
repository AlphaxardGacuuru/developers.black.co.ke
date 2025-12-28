import Link from "next/link"

const MyLink = ({ linkTo, text, icon, className }) => {
	return (
		<Link
			href={linkTo}
			className={`inline-flex items-center gap-2 p-2 px-4 rounded-3xl text-white bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all duration-700 ease-out ${className}`}>
			{icon && <span className="flex items-center">{icon}</span>}
			{text && <span>{text}</span>}
		</Link>
	)
}

MyLink.defaultProps = {
	linkTo: "/",
}

export default MyLink
