import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CodeBlock } from '../../components/CodeBlock';

describe('CodeBlock Component', () => {
  it('should render code content', () => {
    const code = 'const x = 1;';
    const { container } = render(
      <CodeBlock code={code} language="javascript" />
    );

    expect(container.textContent).toContain(code);
  });

  it('should display language label', () => {
    render(<CodeBlock code="print('hello')" language="python" />);

    expect(screen.getByText(/python/i)).toBeInTheDocument();
  });

  it('should handle different languages', () => {
    const languages = ['javascript', 'typescript', 'python', 'sql'];

    languages.forEach(lang => {
      const { unmount } = render(
        <CodeBlock code="test code" language={lang} />
      );
      expect(screen.getByText(new RegExp(lang, 'i'))).toBeInTheDocument();
      unmount();
    });
  });

  it('should render multiline code', () => {
    const multilineCode = `function test() {
  console.log('line 1');
  console.log('line 2');
}`;

    const { container } = render(
      <CodeBlock code={multilineCode} language="javascript" />
    );

    expect(container.textContent).toContain('line 1');
    expect(container.textContent).toContain('line 2');
  });

  it('should handle empty code', () => {
    const { container } = render(<CodeBlock code="" language="javascript" />);

    expect(container).toBeInTheDocument();
  });

  it('should handle special characters in code', () => {
    const codeWithSpecialChars = '<div class="test">Hello & goodbye</div>';

    const { container } = render(
      <CodeBlock code={codeWithSpecialChars} language="html" />
    );

    // React escapes HTML by default, so this is safe
    expect(container.textContent).toContain('Hello & goodbye');
  });
});
