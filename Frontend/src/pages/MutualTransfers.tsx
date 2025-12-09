import { useState } from 'react'
import { motion } from 'framer-motion'
import { usePageTitle } from '../hooks/usePageTitle'
import Button from '../components/Button'
import Input from '../components/Input'

// Demo data for Central Railways mutual transfer listings
const DEMO_LISTINGS = [
  {
    id: '1',
    post: 'Junior Engineer (Civil)',
    currentLocation: 'Mumbai Central',
    desiredLocation: 'Pune Division',
    division: 'Mumbai',
    availabilityDate: '2026-01-15',
    contactName: 'Rajesh Kumar',
    contactEmail: 'rajesh.k@railway.gov.in',
    contactPhone: '+91 98765 43210',
    notes: '5 years of service. Willing to exchange with any location in Pune division.',
    isActive: true
  },
  {
    id: '2',
    post: 'Assistant Loco Pilot',
    currentLocation: 'Nagpur Division',
    desiredLocation: 'Solapur Division',
    division: 'Nagpur',
    availabilityDate: '2026-02-01',
    contactName: 'Amit Sharma',
    contactEmail: 'amit.sharma@railway.gov.in',
    contactPhone: '+91 98765 43211',
    notes: 'Freight operations experience. Family reasons for transfer.',
    isActive: true
  },
  {
    id: '3',
    post: 'Senior Section Engineer (Electrical)',
    currentLocation: 'BSL Division',
    desiredLocation: 'Mumbai Division',
    division: 'BSL',
    availabilityDate: '2026-03-10',
    contactName: 'Priya Deshmukh',
    contactEmail: 'priya.d@railway.gov.in',
    contactPhone: '+91 98765 43212',
    notes: '8 years of service in traction maintenance. Ready for immediate exchange.',
    isActive: true
  },
  {
    id: '4',
    post: 'Track Maintainer',
    currentLocation: 'Pune Division',
    desiredLocation: 'Nagpur Division',
    division: 'Pune',
    availabilityDate: '2026-01-20',
    contactName: 'Suresh Patil',
    contactEmail: 'suresh.patil@railway.gov.in',
    contactPhone: '+91 98765 43213',
    notes: 'Experienced in track maintenance and inspection.',
    isActive: true
  },
  {
    id: '5',
    post: 'Signal & Telecom Maintainer',
    currentLocation: 'Solapur Division',
    desiredLocation: 'BSL Division',
    division: 'Solapur',
    availabilityDate: '2026-02-15',
    contactName: 'Vikram Singh',
    contactEmail: 'vikram.s@railway.gov.in',
    contactPhone: '+91 98765 43214',
    notes: 'S&T Grade II. 6 years experience in interlocking systems.',
    isActive: true
  },
  {
    id: '6',
    post: 'Junior Engineer (Signal)',
    currentLocation: 'Mumbai Division',
    desiredLocation: 'Pune Division',
    division: 'Mumbai',
    availabilityDate: '2026-03-01',
    contactName: 'Deepak Mehta',
    contactEmail: 'deepak.mehta@railway.gov.in',
    contactPhone: '+91 98765 43215',
    notes: 'Working in suburban section. Prefer Pune for better work-life balance.',
    isActive: true
  }
]


export default function MutualTransfers() {
  usePageTitle('CREA • Mutual Transfer Corner')
  
  const [searchForm, setSearchForm] = useState({ post: '', current: '', desired: '' })
  const [filteredListings, setFilteredListings] = useState(DEMO_LISTINGS)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const filtered = DEMO_LISTINGS.filter(listing => {
      const postMatch = !searchForm.post || listing.post.toLowerCase().includes(searchForm.post.toLowerCase())
      const currentMatch = !searchForm.current || listing.currentLocation.toLowerCase().includes(searchForm.current.toLowerCase())
      const desiredMatch = !searchForm.desired || listing.desiredLocation.toLowerCase().includes(searchForm.desired.toLowerCase())
      return postMatch && currentMatch && desiredMatch
    })
    setFilteredListings(filtered)
  }

  const handleReset = () => {
    setSearchForm({ post: '', current: '', desired: '' })
    setFilteredListings(DEMO_LISTINGS)
  }

  const totalListings = DEMO_LISTINGS.length
  const activeListings = DEMO_LISTINGS.filter(l => l.isActive).length

  return (
    <div className="space-y-6">
      {/* Professional Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-r from-[var(--primary)] to-[#1a4d8f] rounded-xl p-8 text-white shadow-lg"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold !text-white">Mutual Transfer Corner</h1>
              <p className="text-white/90 text-sm mt-1">Connect with colleagues across Central Railway divisions to exchange posts and locations</p>
            </div>
          </div>
        </div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-md border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--secondary)] mb-1">Total Listings</p>
              <p className="text-3xl font-bold text-[var(--primary)]">{totalListings}</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-md border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--secondary)] mb-1">Active Listings</p>
              <p className="text-3xl font-bold text-[var(--accent)]">{activeListings}</p>
            </div>
            <div className="p-3 bg-[var(--accent)]/10 rounded-lg">
              <svg className="w-6 h-6 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-md border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--secondary)] mb-1">Divisions Covered</p>
              <p className="text-3xl font-bold text-[var(--secondary)]">5</p>
            </div>
            <div className="p-3 bg-[var(--secondary)]/10 rounded-lg">
              <svg className="w-6 h-6 text-[var(--secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl p-6 shadow-md border border-gray-200"
      >
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-200">
          <div className="p-2 bg-[var(--accent)]/10 rounded-lg">
            <svg className="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-[var(--primary)]">Find Matching Opportunities</h2>
            <p className="text-sm text-[var(--secondary)]">Search for suitable transfer candidates across divisions</p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Input
              label="Post"
              value={searchForm.post}
              onChange={(e) => setSearchForm({ ...searchForm, post: e.target.value })}
              placeholder="e.g. Junior Engineer"
            />
            <Input
              label="Current Location"
              value={searchForm.current}
              onChange={(e) => setSearchForm({ ...searchForm, current: e.target.value })}
              placeholder="e.g. Mumbai Central"
            />
            <Input
              label="Desired Location"
              value={searchForm.desired}
              onChange={(e) => setSearchForm({ ...searchForm, desired: e.target.value })}
              placeholder="e.g. Pune Division"
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit" className="bg-[var(--primary)] hover:bg-[#0a2343]">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
            </Button>
            <Button type="button" variant="ghost" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </form>
      </motion.div>

      {/* Listings Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl p-6 shadow-md border border-gray-200"
      >
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[var(--primary)]/10 rounded-lg">
              <svg className="w-5 h-5 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-[var(--primary)]">Available Transfer Opportunities</h3>
              <p className="text-sm text-[var(--secondary)]">{filteredListings.length} listings found</p>
            </div>
          </div>
        </div>

        {filteredListings.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h4 className="text-lg font-semibold text-gray-700 mb-2">No Listings Found</h4>
            <p className="text-sm text-[var(--secondary)] max-w-md mx-auto">
              No transfer opportunities match your search criteria. Try adjusting your filters or check back later.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredListings.map((listing, idx) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-[var(--primary)] transition-all duration-200"
              >
                <div className="flex flex-wrap gap-6">
                  {/* Left Section - Main Info */}
                  <div className="flex-1 min-w-[300px]">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[var(--primary)] to-[#1a4d8f] rounded-lg flex items-center justify-center text-white font-bold shadow-md">
                        {listing.post.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-[var(--primary)] mb-1">{listing.post}</h4>
                        <span className="inline-block px-2.5 py-0.5 bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-semibold rounded-full">
                          {listing.division} Division
                        </span>
                      </div>
                    </div>

                    {/* Location Transfer */}
                    <div className="flex items-center gap-3 mb-4 flex-wrap">
                      <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-[var(--primary)] rounded-lg font-medium text-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {listing.currentLocation}
                      </div>
                      <svg className="w-6 h-6 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                      <div className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg font-medium text-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                        {listing.desiredLocation}
                      </div>
                    </div>

                    {/* Availability Date */}
                    <div className="flex items-center gap-2 text-sm text-[var(--secondary)] mb-3">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Available from: <strong className="text-[var(--primary)]">{new Date(listing.availabilityDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong></span>
                    </div>

                    {/* Notes */}
                    {listing.notes && (
                      <div className="bg-gray-50 border-l-4 border-[var(--accent)] p-3 rounded">
                        <p className="text-sm text-gray-700">{listing.notes}</p>
                      </div>
                    )}
                  </div>

                  {/* Right Section - Contact Info */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 min-w-[250px]">
                    <p className="text-xs font-bold text-[var(--secondary)] uppercase tracking-wide mb-3">Contact Information</p>
                    
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-[var(--primary)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="text-sm font-semibold text-[var(--primary)]">{listing.contactName}</span>
                      </div>

                      <div className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-[var(--primary)] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <a href={`mailto:${listing.contactEmail}`} className="text-sm text-blue-600 hover:text-blue-800 hover:underline break-all">
                          {listing.contactEmail}
                        </a>
                      </div>

                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-[var(--primary)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="text-sm text-gray-700">{listing.contactPhone}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-300">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Active Listing
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Info Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-blue-50 border border-blue-200 rounded-xl p-4"
      >
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm text-blue-900">
              <strong className="font-semibold">Note:</strong> This is a demonstration page with sample data. 
              To publish your own mutual transfer listing or manage existing ones, please log in to your account. 
              Contact details shown are examples for demonstration purposes only.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
