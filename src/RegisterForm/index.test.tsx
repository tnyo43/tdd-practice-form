import { render, screen } from '@testing-library/react';
import UserEvent from '@testing-library/user-event';
import { RegisterForm } from '.';

const mockOnSubmit = jest.fn();

describe('RegisterForm', () => {
  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  test('入力した名前が送信される', async () => {
    render(<RegisterForm onSubmit={mockOnSubmit} />);
    const user = UserEvent.setup();

    await user.type(
      screen.getByRole('textbox', { name: /ユーザ名/ }),
      'たろう'
    );
    await user.click(screen.getByRole('button', { name: /送信/ }));

    expect(mockOnSubmit).toBeCalledWith({ name: 'はなこ' });
  });
});
