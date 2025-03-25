'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';

interface ContentItem {
  id: string;
  type: 'hero' | 'feature' | 'testimonial';
  title?: string;
  description?: string;
  image: string;
  link?: string;
  order: number;
  active: boolean;
}

export default function ContentPage() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [selectedType, setSelectedType] = useState<'hero' | 'feature' | 'testimonial'>('hero');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const formData = new FormData();
    formData.append('file', files[0]);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      return data.imageUrl;
    } catch (error) {
      console.error('Failed to upload image:', error);
      return null;
    }
  };

  const handleAddContent = async () => {
    const fileInput = fileInputRef.current;
    if (!fileInput) return;
    
    // Trigger the file input click
    fileInput.click();
    
    // Wait for the file input change event
    const imageUrl = await new Promise<string | null>((resolve) => {
      const handleFileChange = async (e: Event) => {
        const input = e.target as HTMLInputElement;
        if (input.files && input.files[0]) {
          const url = await handleImageUpload(e as unknown as React.ChangeEvent<HTMLInputElement>);
          resolve(url);
        } else {
          resolve(null);
        }
        // Remove the event listener after handling the change
        fileInput.removeEventListener('change', handleFileChange);
      };

      fileInput.addEventListener('change', handleFileChange);
    });

    if (!imageUrl) return;

    const newContent: ContentItem = {
      id: Date.now().toString(),
      type: selectedType,
      title: '',
      description: '',
      image: imageUrl,
      order: content.length,
      active: true,
    };

    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newContent),
      });
      const data = await response.json();
      setContent([...content, data]);
    } catch (error) {
      console.error('Failed to add content:', error);
    }
  };

  const handleUpdateContent = async (id: string, updates: Partial<ContentItem>) => {
    try {
      const response = await fetch(`/api/content/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      const data = await response.json();
      setContent(content.map(item => item.id === id ? data : item));
    } catch (error) {
      console.error('Failed to update content:', error);
    }
  };

  const handleDeleteContent = async (id: string) => {
    try {
      await fetch(`/api/content/${id}`, {
        method: 'DELETE',
      });
      setContent(content.filter(item => item.id !== id));
    } catch (error) {
      console.error('Failed to delete content:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
        <div className="flex items-center space-x-4">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as 'hero' | 'feature' | 'testimonial')}
            className="block rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          >
            <option value="hero">Hero Images</option>
            <option value="feature">Features</option>
            <option value="testimonial">Testimonials</option>
          </select>
          <button
            onClick={handleAddContent}
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" />
            Add Content
          </button>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {content
          .filter(item => item.type === selectedType)
          .map((item) => (
            <div
              key={item.id}
              className="relative overflow-hidden rounded-lg bg-white shadow"
            >
              <div className="aspect-w-16 aspect-h-9">
                <Image
                  src={item.image}
                  alt={item.title || 'Content image'}
                  width={400}
                  height={225}
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <input
                  type="text"
                  value={item.title || ''}
                  onChange={(e) => handleUpdateContent(item.id, { title: e.target.value })}
                  placeholder="Title"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <textarea
                  value={item.description || ''}
                  onChange={(e) => handleUpdateContent(item.id, { description: e.target.value })}
                  placeholder="Description"
                  rows={3}
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={item.active}
                      onChange={(e) => handleUpdateContent(item.id, { active: e.target.checked })}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    <label className="ml-2 text-sm text-gray-700">Active</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleDeleteContent(item.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
} 