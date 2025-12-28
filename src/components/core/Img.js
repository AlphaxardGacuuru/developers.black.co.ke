import React from "react"

const Img = ({ src, width, height, className, style, alt }) => {
	const handleError = (e) => {
		// Set fallback to male-avatar.png for broken images
		e.target.src = "/storage/avatars/male-avatar.png"
	}

	return (
		<img
			src={src ?? "/storage/img/android-chrome-512x512.png"}
			width={width}
			height={height}
			className={className}
			style={style}
			alt={alt}
			loading="lazy"
			onError={handleError}
		/>
	)
}

Img.defaultProps = {
	src: "/storage/img/party-people.png",
	alt: "image",
}

export default Img
