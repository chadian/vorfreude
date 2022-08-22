import '@testing-library/jest-dom';
import { render } from '@testing-library/svelte';
import svelte from 'svelte-inline-compile';

test('it renders the button with slot', () => {
	const { getByRole } = render(svelte`
        <script>
            import Button from './Button.svelte';
        </script>

        <Button>Hello World!</Button>
    `);

    const button = getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveTextContent('Hello World!')
});

test('it renders the button with specified type', () => {
	const { getByRole } = render(svelte`
        <script>
            import Button from './Button.svelte';
        </script>

        <Button type="submit">Hello World!</Button>
    `);

    const button = getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toHaveTextContent('Hello World!')
});
