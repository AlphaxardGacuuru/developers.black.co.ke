import React from "react"

const PaginationLinks = ({ getPaginated, setState, list }) => {
	return (
		<nav
			aria-label="Page navigation example"
			className="mb-2">
			<ul className="pagination justify-content-start">
				{list.meta?.links.map((link, key) => (
					<li
						key={key}
						className={`page-item ${
							link.active ? "active" : `${link.url ? " bg-white" : "disabled"}`
						}`}
						style={{ backgroundColor: "white", cursor: "pointer" }}
						onClick={() => {
							// Use URL API to remove domain
							var url = link.url.replace(/^(?:\/\/|[^/]+)*\/api\//, "")

							// Check if url is available
							if (link.url) {
								getPaginated(url, setState)
							}
						}}>
						<a
							className="page-link rounded-0"
							dangerouslySetInnerHTML={{
								__html: link.label,
							}}></a>
					</li>
				))}
			</ul>
		</nav>
	)
}

export default PaginationLinks