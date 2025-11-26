import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ImageModal } from '../../components/ImageModal';

describe('ImageModal Component', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it('should not render when isOpen is false', () => {
    const { container } = render(
      <ImageModal
        isOpen={false}
        imageUrl="https://example.com/image.png"
        altText="Test Image"
        onClose={mockOnClose}
      />
    );

    // Modal should not be visible
    expect(container.querySelector('[class*="fixed"]')).not.toBeInTheDocument();
  });

  it('should render when isOpen is true', () => {
    render(
      <ImageModal
        isOpen={true}
        imageUrl="https://example.com/image.png"
        altText="Test Image"
        onClose={mockOnClose}
      />
    );

    const image = screen.getByAltText('Test Image');
    expect(image).toBeInTheDocument();
  });

  it('should display correct image URL', () => {
    const imageUrl = 'https://example.com/test-image.jpg';

    render(
      <ImageModal
        isOpen={true}
        imageUrl={imageUrl}
        altText="Test"
        onClose={mockOnClose}
      />
    );

    const image = screen.getByAltText('Test') as HTMLImageElement;
    expect(image.src).toBe(imageUrl);
  });

  it('should call onClose when close button is clicked', () => {
    render(
      <ImageModal
        isOpen={true}
        imageUrl="https://example.com/image.png"
        altText="Test"
        onClose={mockOnClose}
      />
    );

    // Look for X button or close button
    const closeButton = screen.getAllByRole('button')[0]; // Get first button (close)
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should handle base64 images', () => {
    const base64Image = 'data:image/png;base64,iVBORw0KGgoAAAANS...';

    render(
      <ImageModal
        isOpen={true}
        imageUrl={base64Image}
        altText="Base64 Test"
        onClose={mockOnClose}
      />
    );

    const image = screen.getByAltText('Base64 Test') as HTMLImageElement;
    expect(image.src).toContain('data:image/png;base64');
  });
});
