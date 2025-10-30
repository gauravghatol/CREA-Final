import { useState } from 'react'
import { usePageTitle } from '../hooks/usePageTitle'
import SectionHeader from '../components/SectionHeader'
import Button from '../components/Button'
import SegmentedControl from '../components/SegmentedControl'
import DataTable from '../components/DataTable'
import FileUploader from '../components/FileUploader'
import Modal from '../components/Modal'
import Input from '../components/Input'
import { format } from 'date-fns'

type DocumentType = 'circular' | 'manual' | 'court-case'

interface Document extends Record<string, unknown> {
  id: string
  title: string
  description: string
  date: string
  type: DocumentType
  fileUrl: string
  fileName: string
  fileSize: string
  uploadedBy: string
  status?: string
  caseNumber?: string
  courtName?: string
  nextHearingDate?: string
  category?: string
  section?: string
}

const MOCK_DOCUMENTS: Document[] = [
  {
    id: '1',
    title: 'Annual Leave Policy Update',
    description: 'Updated leave policy for the year 2025',
    date: '2025-10-15',
    type: 'circular',
    fileUrl: '#',
    fileName: 'leave-policy-2025.pdf',
    fileSize: '2.1 MB',
    uploadedBy: 'Admin',
    category: 'Policy'
  },
  {
    id: '2',
    title: 'Safety Manual 2025',
    description: 'Comprehensive safety guidelines',
    date: '2025-09-20',
    type: 'manual',
    fileUrl: '#',
    fileName: 'safety-manual.pdf',
    fileSize: '5.3 MB',
    uploadedBy: 'Safety Officer',
    section: 'Safety'
  },
  {
    id: '3',
    title: 'Employee Benefits Case',
    description: 'Case regarding employee benefits',
    date: '2025-08-10',
    type: 'court-case',
    fileUrl: '#',
    fileName: 'case-documents.pdf',
    fileSize: '3.7 MB',
    uploadedBy: 'Legal Team',
    status: 'Ongoing',
    caseNumber: 'CC-2025-123',
    courtName: 'High Court',
    nextHearingDate: '2025-11-15'
  }
]

export default function Documents() {
  const [activeTab, setActiveTab] = useState<DocumentType>('circular')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [documents] = useState<Document[]>(MOCK_DOCUMENTS)

  usePageTitle('CREA • Documents')

  const filteredDocuments = documents.filter(doc => 
    doc.type === activeTab && 
    (doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     doc.description.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const getColumns = (type: DocumentType) => {
    const baseColumns = [
      {
        key: 'title' as keyof Document,
        header: 'Title',
        render: (row: Document) => (
          <div>
            <div className="font-medium text-gray-900">{row.title}</div>
            <div className="text-sm text-gray-500">{row.description}</div>
          </div>
        )
      },
      {
        key: 'date' as keyof Document,
        header: 'Date',
        render: (row: Document) => format(new Date(row.date), 'MMM d, yyyy')
      },
      {
        key: 'fileUrl' as keyof Document,
        header: 'File',
        render: (row: Document) => (
          <a href={row.fileUrl} className="text-blue-600 hover:text-blue-800 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>{row.fileName}</span>
          </a>
        )
      }
    ]

    if (type === 'circular') {
      return [
        ...baseColumns,
        { 
          key: 'category' as keyof Document,
          header: 'Category', 
          render: (row: Document) => row.category 
        }
      ]
    }

    if (type === 'manual') {
      return [
        ...baseColumns,
        { 
          key: 'section' as keyof Document,
          header: 'Section', 
          render: (row: Document) => row.section 
        }
      ]
    }

    if (type === 'court-case') {
      return [
        ...baseColumns,
        { 
          key: 'status' as keyof Document,
          header: 'Status', 
          render: (row: Document) => (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
              ${row.status === 'Ongoing' ? 'bg-yellow-100 text-yellow-800' : 
                row.status === 'Closed' ? 'bg-green-100 text-green-800' : 
                'bg-gray-100 text-gray-800'}`}>
              {row.status}
            </span>
          )
        },
        { 
          key: 'caseNumber' as keyof Document,
          header: 'Case Number', 
          render: (row: Document) => row.caseNumber 
        },
        { 
          key: 'nextHearingDate' as keyof Document,
          header: 'Next Hearing', 
          render: (row: Document) => 
            row.nextHearingDate ? format(new Date(row.nextHearingDate), 'MMM d, yyyy') : '-'
        }
      ]
    }

    return baseColumns
  }

  const getAddButtonText = (type: DocumentType) => {
    switch (type) {
      case 'circular': return 'Add Circular'
      case 'manual': return 'Add Manual'
      case 'court-case': return 'Add Court Case'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SectionHeader 
          title="Documents" 
          subtitle="Access all organization documents in one place" 
        />
        <Button onClick={() => setIsAddModalOpen(true)}>
          {getAddButtonText(activeTab)}
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <SegmentedControl
          value={activeTab}
          onChange={(value) => setActiveTab(value as DocumentType)}
          options={[
            { value: 'circular', label: 'Circulars' },
            { value: 'manual', label: 'Manuals' },
            { value: 'court-case', label: 'Court Cases' }
          ]}
        />
        <div className="flex-1 max-w-md">
          <Input
            type="search"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <DataTable
          columns={getColumns(activeTab)}
          data={filteredDocuments}
        />
      </div>

      <Modal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={getAddButtonText(activeTab)}
      >
        <form className="space-y-4">
          <Input label="Title *" placeholder="Enter document title" />
          <Input label="Description" placeholder="Enter document description" />
          
          {activeTab === 'circular' && (
            <Input label="Category" placeholder="Enter document category" />
          )}

          {activeTab === 'manual' && (
            <Input label="Section" placeholder="Enter manual section" />
          )}

          {activeTab === 'court-case' && (
            <>
              <Input label="Case Number *" placeholder="Enter case number" />
              <Input label="Court Name *" placeholder="Enter court name" />
              <Input type="date" label="Next Hearing Date" />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                  <option value="ongoing">Ongoing</option>
                  <option value="closed">Closed</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </>
          )}

          <div className="mt-6">
            <FileUploader
              accept=".pdf,.doc,.docx"
              maxFiles={1}
              onFiles={() => {}}
              hint="Upload document (PDF, DOC, DOCX)"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button>Save Document</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}