import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PropertyGalleryManager } from '@/components/properties/PropertyGalleryManager';
import { apiRequest } from '@/lib/api';
import React from 'react';

// Mock apiRequest
vi.mock('@/lib/api', () => ({
  apiRequest: vi.fn(),
}));

// Mock next/image because it doesn't work well in JSDOM
vi.mock('next/image', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: (props: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { src, alt, fill, unoptimized, priority, ...rest } = props;
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...rest} />;
  },
}));

// Mock confirm
global.confirm = vi.fn(() => true);

describe('PropertyGalleryManager', () => {
  const mockPropertyId = 'prop-123';
  const mockImages = [
    { id: '1', public_url: '/img1.jpg', is_cover: true, position: 0 },
    { id: '2', public_url: '/img2.jpg', is_cover: false, position: 1 },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly with given images', () => {
    render(
      <PropertyGalleryManager 
        propertyId={mockPropertyId} 
        initialImages={mockImages} 
      />
    );

    expect(screen.getByText(/Orden de la Galería/i)).toBeDefined();
    // Verify cover badge
    expect(screen.getByText(/PORTADA/i)).toBeDefined();
    // Both images should be rendered
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
  });

  it('calls API to set main image when Star button is clicked', async () => {
    render(
      <PropertyGalleryManager 
        propertyId={mockPropertyId} 
        initialImages={mockImages} 
      />
    );

    // Image 2 is not cover, should have a Star button
    const setMainButtons = screen.getAllByTitle(/Marcar como portada/i);
    expect(setMainButtons).toHaveLength(1);

    fireEvent.click(setMainButtons[0]);

    expect(apiRequest).toHaveBeenCalledWith(
      `/properties/${mockPropertyId}/images/2/set-main`,
      expect.objectContaining({ method: 'PATCH' })
    );

    // After success, it should update local state (UI change)
    await waitFor(() => {
        // Now Image 2 should have the PORTADA badge
        // Note: The UI updates locally after API call
        expect(screen.getByText(/PORTADA/i)).toBeDefined();
    });
  });

  it('calls API to delete image when Trash button is clicked and confirmed', async () => {
    render(
      <PropertyGalleryManager 
        propertyId={mockPropertyId} 
        initialImages={mockImages} 
      />
    );

    const deleteButtons = screen.getAllByTitle(/Eliminar imagen/i);
    expect(deleteButtons).toHaveLength(2);

    fireEvent.click(deleteButtons[1]); // Delete Image 2

    expect(global.confirm).toHaveBeenCalled();
    expect(apiRequest).toHaveBeenCalledWith(
      `/properties/images/2`,
      expect.objectContaining({ method: 'DELETE' })
    );

    await waitFor(() => {
        // Image 2 should be gone
        const images = screen.queryAllByRole('img');
        expect(images).toHaveLength(1);
    });
  });

  it('displays empty state when no images are provided', () => {
    render(
      <PropertyGalleryManager 
        propertyId={mockPropertyId} 
        initialImages={[]} 
      />
    );

    expect(screen.getByText(/La galería está vacía/i)).toBeDefined();
  });
});
