import React from "react"

import Btn from "@/components/ui/button"

import DeleteSVG from "@/svgs/DeleteSVG"
import CloseSVG from "@/svgs/CloseSVG"

const DeleteModal = ({ index, model, modelName, onDelete }) => {
	return (
		<React.Fragment>
			{/* Confirm Delete Modal End */}
			<div
				className="modal fade"
				id={`deleteModal${index}`}
				tabIndex="-1"
				aria-labelledby="deleteModalLabel"
				aria-hidden="true">
				<div className="modal-dialog">
					<div className="modal-content bg-danger rounded-0 text-white">
						<div className="modal-header border-0">
							<h1
								id="deleteModalLabel"
								className="modal-title fs-5">
								Delete {modelName}
							</h1>

							{/* Close Start */}
							<span
								type="button"
								className="text-white"
								data-bs-dismiss="modal">
								<CloseSVG />
							</span>
							{/* Close End */}
						</div>
						<div className="modal-body text-start text-wrap">
							Are you sure you want to Delete {model.name ?? modelName}. All
							Associated Data will be lost.
						</div>
						<div className="modal-footer justify-content-between border-0">
							<button
								type="button"
								className="mysonar-btn btn-2"
								data-bs-dismiss="modal">
								cancel
							</button>
							<button
								type="button"
								className="mysonar-btn btn-2"
								data-bs-dismiss="modal"
								onClick={() => onDelete(model.id)}>
								<span className="me-1">{<DeleteSVG />}</span>
								Delete
							</button>
						</div>
					</div>
				</div>
			</div>
			{/* Confirm Delete Modal End */}

			{/* Button trigger modal */}
			<Btn
				icon={<DeleteSVG />}
				text="delete"
				dataBsToggle="modal"
				dataBsTarget={`#deleteModal${index}`}
			/>
			{/* Button trigger modal End */}
		</React.Fragment>
	)
}

export default DeleteModal