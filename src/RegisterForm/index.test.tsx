import { render, screen, getByText } from '@testing-library/react';
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

    expect(mockOnSubmit).toBeCalledWith({ name: 'たろう' });
  });

  test('名前を入力していないと、エラーになって送信できない', async () => {
    render(<RegisterForm onSubmit={mockOnSubmit} />);
    const user = UserEvent.setup();

    await user.click(screen.getByRole('button', { name: /送信/ }));

    expect(mockOnSubmit).not.toBeCalled();
    const alertText = screen.getByRole('alert');
    expect(
      getByText(alertText, 'ユーザ名を入力してください')
    ).toBeInTheDocument();
  });
});
