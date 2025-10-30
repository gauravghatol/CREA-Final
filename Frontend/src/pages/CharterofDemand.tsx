import { useCallback, useEffect, useMemo, useState } from 'react'
import { format } from 'date-fns'
import { usePageTitle } from '../hooks/usePageTitle'
import SectionHeader from '../components/SectionHeader'
import Button from '../components/Button'
import Modal from '../components/Modal'
import Input from '../components/Input'
import FileUploader from '../components/FileUploader'
import { useAuth } from '../context/auth'
import type { CharterDemand } from '../types'
import {
	getCharterDemands,
	createCharterDemand,
	updateCharterDemand,
	deleteCharterDemand,
} from '../services/api'

type FormState = {
	title: string
	summary: string
	content: string
	order: string
	published: boolean
	file: File | null
}

const EMPTY_FORM: FormState = {
	title: '',
	summary: '',
	content: '',
	order: '0',
	published: true,
	file: null,
}

const formatDate = (value?: string) => {
	if (!value) return ''
	const date = new Date(value)
	if (Number.isNaN(date.getTime())) return ''
	return format(date, 'MMM d, yyyy')
}

export default function CharterOfDemand() {
	usePageTitle('CREA • Charter of Demand')
	const { user } = useAuth()

	const [charters, setCharters] = useState<CharterDemand[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const [modalOpen, setModalOpen] = useState(false)
	const [form, setForm] = useState<FormState>(EMPTY_FORM)
	const [formError, setFormError] = useState<string | null>(null)
	const [saving, setSaving] = useState(false)
	const [editing, setEditing] = useState<CharterDemand | null>(null)
	const [deletingId, setDeletingId] = useState<string | null>(null)
		const [uploaderKey, setUploaderKey] = useState(0)

	const isAdmin = user?.role === 'admin'

	const loadCharters = useCallback(async () => {
		try {
			setLoading(true)
			setError(null)
			const list = await getCharterDemands(isAdmin ? { all: true } : undefined)
			setCharters(list)
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Failed to load charter of demands'
			setError(message)
		} finally {
			setLoading(false)
		}
	}, [isAdmin])

	useEffect(() => {
		loadCharters()
	}, [loadCharters])

	const openCreateModal = () => {
		setEditing(null)
		setForm(EMPTY_FORM)
		setFormError(null)
			setUploaderKey(key => key + 1)
		setModalOpen(true)
	}

	const openEditModal = (charter: CharterDemand) => {
		setEditing(charter)
		setForm({
			title: charter.title,
			summary: charter.summary ?? '',
			content: charter.content ?? '',
			order: String(charter.order ?? 0),
			published: charter.published ?? true,
			file: null,
		})
		setFormError(null)
				setUploaderKey(key => key + 1)
		setModalOpen(true)
	}

	const closeModal = () => {
		if (saving) return
		setModalOpen(false)
		setForm(EMPTY_FORM)
		setEditing(null)
		setFormError(null)
	}

	const handleFileChange = (files: File[]) => {
		setForm(prev => ({ ...prev, file: files[0] ?? null }))
	}

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault()
		if (!form.title.trim()) {
			setFormError('Title is required')
			return
		}

		setSaving(true)
		setFormError(null)

		const orderValue = Number(form.order)
		const safeOrder = Number.isFinite(orderValue) ? orderValue : 0

		const basePayload = {
			title: form.title.trim(),
			summary: form.summary,
			content: form.content,
			order: safeOrder,
			published: form.published,
		}

		try {
			if (editing) {
				const patch: typeof basePayload & { file?: File } = { ...basePayload }
				if (form.file) patch.file = form.file
				await updateCharterDemand(editing.id, patch)
			} else {
				const payload: typeof basePayload & { file?: File } = { ...basePayload }
				if (form.file) payload.file = form.file
				await createCharterDemand(payload)
			}
			closeModal()
			await loadCharters()
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Failed to save charter demand'
			setFormError(message)
		} finally {
			setSaving(false)
		}
	}

	const handleDelete = async (charter: CharterDemand) => {
		if (!window.confirm(`Delete "${charter.title}"? This action cannot be undone.`)) return
		setDeletingId(charter.id)
		try {
			await deleteCharterDemand(charter.id)
			await loadCharters()
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Failed to delete charter demand'
			setError(message)
		} finally {
			setDeletingId(null)
		}
	}

		const visibleCharters = useMemo(
			() => (isAdmin ? charters : charters.filter(item => item.published)),
			[charters, isAdmin]
		)

	const renderEmptyState = () => (
		<div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-gray-600">
			{isAdmin ? 'No charter demands yet. Use “New Demand” to create one.' : 'Charter of Demand will be published here soon.'}
		</div>
	)

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<SectionHeader
					title="Charter of Demand"
					subtitle="Access the latest Charter of Demand in both PDF and web formats."
				/>
				{isAdmin && (
					<Button onClick={openCreateModal}>New Demand</Button>
				)}
			</div>

			{error && (
				<div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
					{error}
				</div>
			)}

					{loading ? (
				<div className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-600">
					Loading charter demands…
				</div>
					) : visibleCharters.length === 0 ? (
				renderEmptyState()
			) : (
				<div className="space-y-4">
							{visibleCharters.map(charter => (
						<article key={charter.id} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
							<div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
								<div>
									<h3 className="text-xl font-semibold text-blue-900">{charter.title}</h3>
									{charter.summary && <p className="mt-1 text-gray-600">{charter.summary}</p>}
									{charter.content && (
										<p className="mt-3 whitespace-pre-line text-sm text-gray-700">{charter.content}</p>
									)}
								</div>
								{charter.pdfUrl && (
									<a
										href={charter.pdfUrl}
										target="_blank"
										rel="noreferrer"
										className="inline-flex items-center justify-center rounded-md border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-100"
									>
										Download PDF
									</a>
								)}
							</div>

							<div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-gray-500">
								<span>Updated {formatDate(charter.updatedAt) || 'recently'}</span>
								{isAdmin && !charter.published && <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-yellow-700">Draft</span>}
							</div>

							{isAdmin && (
								<div className="mt-4 flex flex-wrap gap-2">
									<Button variant="secondary" onClick={() => openEditModal(charter)}>Edit</Button>
									<Button
										variant="danger"
										onClick={() => handleDelete(charter)}
										loading={deletingId === charter.id}
									>
										Delete
									</Button>
								</div>
							)}
						</article>
					))}
				</div>
			)}

			<Modal open={modalOpen} onClose={closeModal} title={editing ? 'Edit Demand' : 'New Demand'}>
				<form className="space-y-4" onSubmit={handleSubmit}>
					<Input
						label="Title *"
						placeholder="Enter demand title"
						value={form.title}
						onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
						required
					/>

					<Input
						label="Summary"
						placeholder="Short summary (optional)"
						value={form.summary}
						onChange={e => setForm(prev => ({ ...prev, summary: e.target.value }))}
					/>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="charter-content">Web Version</label>
						<textarea
							id="charter-content"
							rows={6}
							className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
							placeholder="Enter the charter details as plain text."
							value={form.content}
							onChange={e => setForm(prev => ({ ...prev, content: e.target.value }))}
						/>
					</div>

					<div className="grid gap-4 sm:grid-cols-2">
						<Input
							label="Display Order"
							type="number"
							min="0"
							value={form.order}
							onChange={e => setForm(prev => ({ ...prev, order: e.target.value }))}
							hint="Lower numbers appear first"
						/>

						<label className="mt-6 inline-flex items-center gap-2 text-sm text-gray-700">
							<input
								type="checkbox"
								checked={form.published}
								onChange={e => setForm(prev => ({ ...prev, published: e.target.checked }))}
							/>
							Published
						</label>
					</div>

					<div className="space-y-2">
						<label className="block text-sm font-medium text-gray-700">PDF Version</label>
						{editing?.pdfUrl && !form.file && (
							<div className="text-xs text-gray-600">
								Current file: <a className="text-blue-700 underline" href={editing.pdfUrl} target="_blank" rel="noreferrer">View PDF</a>
							</div>
						)}
									<FileUploader
										key={`uploader-${uploaderKey}`}
							accept=".pdf"
							maxFiles={1}
							onFiles={handleFileChange}
							hint="Upload an optional PDF version (max 10 MB)"
						/>
					</div>

					{formError && (
						<div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
							{formError}
						</div>
					)}

					<div className="flex justify-end gap-3 pt-2">
						<Button type="button" variant="ghost" onClick={closeModal} disabled={saving}>Cancel</Button>
						<Button type="submit" loading={saving}>{editing ? 'Save Changes' : 'Create Demand'}</Button>
					</div>
				</form>
			</Modal>
		</div>
	)
}
