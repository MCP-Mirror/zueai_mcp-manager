import { Save, Trash2 } from "lucide-react"
import { useState } from "react"

type MCPServerConfig = {
	command: string
	args: string[]
}

type MCPServerCardProps = {
	serverName: string
	config: MCPServerConfig
	icon?: React.ReactNode
	variables?: {
		name: string
		value: string
		argIndex: number
	}[]
	onUpdate: (name: string, newConfig: MCPServerConfig) => void
	onDelete: (name: string) => void
}

export function MCPServerCard({
	serverName,
	config,
	icon,
	variables,
	onUpdate,
	onDelete
}: MCPServerCardProps) {
	const [hasChanges, setHasChanges] = useState(false)
	const [values, setValues] = useState<Record<string, string>>(() => {
		if (!variables) return {}
		const initialValues: Record<string, string> = {}
		for (const v of variables) {
			initialValues[v.name] = v.value
		}
		return initialValues
	})

	const handleVariableChange = (
		name: string,
		value: string,
		argIndex: number
	) => {
		setValues((prev) => ({ ...prev, [name]: value }))
		setHasChanges(true)
	}

	const handleSave = () => {
		try {
			const newConfig = { ...config }
			if (variables) {
				for (const v of variables) {
					newConfig.args[v.argIndex] = values[v.name]
				}
			}
			onUpdate(serverName, newConfig)
			setHasChanges(false)
		} catch (error) {
			console.error("Error saving configuration:", error)
		}
	}

	return (
		<div className="join join-vertical w-full">
			<div className="collapse collapse-arrow join-item border border-base-300 bg-white">
				<input type="checkbox" defaultChecked />
				<div className="collapse-title">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							{icon}
							<h3 className="text-lg font-medium capitalize">
								{serverName}
							</h3>
						</div>
						<div className="flex gap-2">
							{variables && hasChanges && (
								<button
									type="button"
									onClick={handleSave}
									className="btn btn-primary btn-sm"
								>
									<Save className="w-4 h-4" />
									<span className="ml-2">Save Changes</span>
								</button>
							)}
							<button
								type="button"
								onClick={() => onDelete(serverName)}
								className="btn btn-sm bg-red-200 hover:bg-red-400"
							>
								<Trash2 className="w-4 h-4" />
								<span className="ml-2">Delete</span>
							</button>
						</div>
					</div>
				</div>
				<div className="collapse-content">
					{variables && (
						<div className="bg-base-200 rounded-lg p-4 mt-4">
							<div className="space-y-4">
								{variables.map((variable) => (
									<div
										key={variable.name}
										className="form-control"
									>
										<label
											className="label"
											htmlFor={`${serverName}-${variable.name}`}
										>
											<span className="label-text capitalize">
												{variable.name}
											</span>
										</label>
										<input
											id={`${serverName}-${variable.name}`}
											type="text"
											value={values[variable.name]}
											onChange={(e) =>
												handleVariableChange(
													variable.name,
													e.target.value,
													variable.argIndex
												)
											}
											className="input input-bordered w-full"
											placeholder={`Enter ${serverName} ${variable.name}`}
										/>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
