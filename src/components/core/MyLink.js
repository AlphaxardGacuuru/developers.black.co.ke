import Link from "next/link"

const MyLink = ({ linkTo, text, icon, className }) => {
	return (
		<Link
			href={linkTo}
			className={`ml-4 mt-20 p-1 px-5 rounded-3xl text-white bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all duration-700 ease-out group ${className}`}>
			<span>{icon}</span>
			{text && <span className="mx-1">{text}</span>}
		</Link>
	)
}

MyLink.defaultProps = {
	linkTo: "/",
}

export default MyLink
