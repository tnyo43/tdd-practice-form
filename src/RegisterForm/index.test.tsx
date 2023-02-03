import { render, screen, getByText } from '@testing-library/react';
import UserEvent from '@testing-library/user-event';
import type { UserEvent as User } from '@testing-library/user-event/dist/types/setup/setup';
import { Inputs, RegisterForm } from '.';

type PartialNull<T> = { [K in keyof T]?: T[K] | null };

const mockOnSubmit = jest.fn();

const defaultInputValues: Inputs = {
  name: 'たろう',
  nickname: 'たろちゃん',
};

const inputAndSubmitData = async (user: User, data: PartialNull<Inputs>) => {
  if (data.name !== null) {
    const name = data.name || defaultInputValues.name;
    await user.type(screen.getByRole('textbox', { name: /ユーザ名/ }), name);
  }

  if (data.nickname !== null) {
    const nickname = data.nickname || defaultInputValues.nickname;
    await user.type(
      screen.getByRole('textbox', { name: /ニックネーム/ }),
      nickname
    );
  }

  await user.click(screen.getByRole('button', { name: /送信/ }));
};

describe('RegisterForm', () => {
  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  test('入力したデータが送信される', async () => {
    render(<RegisterForm onSubmit={mockOnSubmit} />);
    const user = UserEvent.setup();

    await inputAndSubmitData(user, { name: 'はなこ', nickname: 'はなちゃん' });

    expect(mockOnSubmit).toBeCalledWith({
      name: 'はなこ',
      nickname: 'はなちゃん',
    });
  });

  describe('ユーザ名のバリデーション', () => {
    describe('必須項目', () => {
      test('入力していないと、エラーになって送信できない', async () => {
        render(<RegisterForm onSubmit={mockOnSubmit} />);
        const user = UserEvent.setup();

        await inputAndSubmitData(user, { name: null });

        expect(mockOnSubmit).not.toBeCalled();
        const alertText = await screen.findByRole('alert');
        expect(
          getByText(alertText, 'ユーザ名を入力してください')
        ).toBeInTheDocument();
      });
    });
  });

  describe('ニックネームのバリデーション', () => {
    describe('必須項目ではない', () => {
      test('入力しなくても送信できる', async () => {
        render(<RegisterForm onSubmit={mockOnSubmit} />);
        const user = UserEvent.setup();

        await inputAndSubmitData(user, { nickname: null });

        expect(mockOnSubmit).toBeCalled();
      });
    });
  });
});
