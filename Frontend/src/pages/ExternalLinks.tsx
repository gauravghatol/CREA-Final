import { useEffect, useState } from 'react';
import { useAuth } from '../context/auth';
import * as api from '../services/api';
import type { ExternalLink } from '../types';
import SectionHeader from '../components/SectionHeader';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';

import type { ExternalLinkCategory } from '../types';

interface GroupedLinks {
  [key: string]: Array<{
    id: string;
    title: string;
    url: string;
    category: ExternalLinkCategory;
    description?: string;
    order: number;
    isActive: boolean;
  }>;
}

const categoryLabels = {
  government: 'Government Links',
  industry: 'Industry Links',
  organization: 'Organization Links',
  other: 'Other Links'
};

export default function ExternalLinks() {
  const { user } = useAuth();
  const [links, setLinks] = useState<GroupedLinks>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<ExternalLink | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    category: 'other' as ExternalLinkCategory,
    description: '',
    order: 0
  });

  // Fetch links
  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const result = await api.getExternalLinks();
      setLinks(result);
    } catch (error) {
      console.error('Error fetching links:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingLink) {
        await api.updateExternalLink(editingLink.id, formData);
      } else {
        await api.createExternalLink(formData);
      }
      fetchLinks();
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving link:', error);
    }
  };

  const handleEdit = (link: ExternalLink) => {
    setEditingLink(link);
    setFormData({
      title: link.title,
      url: link.url,
      category: link.category,
      description: link.description || '',
      order: link.order
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this link?')) return;
    try {
      await api.deleteExternalLink(id);
      fetchLinks();
    } catch (error) {
      console.error('Error deleting link:', error);
    }
  };

  const resetForm = () => {
    setEditingLink(null);
    setFormData({
      title: '',
      url: '',
      category: 'other',
      description: '',
      order: 0
    });
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SectionHeader 
          title="External Links" 
          subtitle="Quick access to important external resources" 
        />
        {user?.role === 'admin' && (
          <Button onClick={openAddModal}>Add New Link</Button>
        )}
      </div>

      <div className="space-y-8">
        {Object.entries(categoryLabels).map(([category, label]) => (
          <div key={category} className="space-y-4">
            {links[category]?.length > 0 && (
              <>
                <h3 className="text-lg font-semibold text-gray-900">{label}</h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {links[category].map(link => (
                    <div key={link.id} className="relative group rounded-lg border p-4 hover:shadow-md transition-shadow bg-white">
                      <h4 className="font-medium text-gray-900">{link.title}</h4>
                      {link.description && (
                        <p className="text-sm text-gray-500 mt-1">{link.description}</p>
                      )}
                      <div className="mt-4 flex items-center justify-between">
                        <a 
                          href={link.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center gap-1"
                        >
                          Visit Link
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                        {user?.role === 'admin' && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(link)}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(link.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <Modal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingLink ? 'Edit External Link' : 'Add External Link'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Title *"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            required
          />
          <Input
            label="URL *"
            type="url"
            value={formData.url}
            onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as ExternalLinkCategory }))}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              {Object.entries(categoryLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          <Input
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          />
          <Input
            label="Display Order"
            type="number"
            value={formData.order}
            onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) }))}
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button 
              variant="ghost" 
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingLink ? 'Save Changes' : 'Add Link'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}