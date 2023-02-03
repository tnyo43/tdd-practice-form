import { render, screen, getByText } from '@testing-library/react';
import UserEvent from '@testing-library/user-event';
import type { UserEvent as User } from '@testing-library/user-event/dist/types/setup/setup';
import { Inputs, RegisterForm } from '.';

type PartialNull<T> = { [K in keyof T]?: T[K] | null };

const mockOnSubmit = jest.fn();

const defaultInputValues: Inputs = {
  name: 'たろう',
  nickname: 'たろちゃん',
  birthday: '1996-06-10',
  favorite: 'イヌ',
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

  if (data.birthday !== null) {
    const birthday = data.birthday || defaultInputValues.birthday;
    await user.type(
      screen.getByRole('textbox', { name: /生年月日/ }),
      birthday
    );
  }

  if (data.favorite !== null) {
    const favorite = data.favorite || defaultInputValues.favorite;
    await user.selectOptions(
      screen.getByRole('combobox', { name: /好きな動物/ }),
      favorite
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

    await inputAndSubmitData(user, {
      name: 'はなこ',
      nickname: 'はなちゃん',
      birthday: '2023-02-04',
      favorite: 'ネコ',
    });

    expect(mockOnSubmit).toBeCalledWith({
      name: 'はなこ',
      nickname: 'はなちゃん',
      birthday: '2023-02-04',
      favorite: 'cat',
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

  describe('生年月日のバリデーション', () => {
    describe('必須項目', () => {
      test('入力していないと、エラーになって送信できない', async () => {
        render(<RegisterForm onSubmit={mockOnSubmit} />);
        const user = UserEvent.setup();

        await inputAndSubmitData(user, { birthday: null });

        expect(mockOnSubmit).not.toBeCalled();
        const alertText = await screen.findByRole('alert');
        expect(
          getByText(alertText, '生年月日を入力してください。')
        ).toBeInTheDocument();
      });
    });

    describe('入力した値が YYYY-MM-DD のフォーマットであること', () => {
      test.each([['1996-06-10'], ['2020-02-02'], ['1976-12-17']])(
        'YYYY-MM-DD のフォーマットは送信できる',
        async (dateText) => {
          render(<RegisterForm onSubmit={mockOnSubmit} />);
          const user = UserEvent.setup();

          await inputAndSubmitData(user, { birthday: dateText });

          expect(mockOnSubmit).toBeCalled();
        }
      );

      test.each([
        ['1996/06/10'],
        ['2020.02.02'],
        ['1976,12,17'],
        ['hogehogehoge'],
      ])('YYYY-MM-DD 以外のフォーマットは送信できない', async (dateText) => {
        render(<RegisterForm onSubmit={mockOnSubmit} />);
        const user = UserEvent.setup();

        await inputAndSubmitData(user, { birthday: dateText });

        expect(mockOnSubmit).not.toBeCalled();
        const alertText = await screen.findByRole('alert');
        expect(
          getByText(alertText, '正しい形式で入力してください。')
        ).toBeInTheDocument();
      });
    });

    describe('入力した値が正常な日付であること', () => {
      test.each([['1996-08-31'], ['2020-02-29'], ['1976-12-17']])(
        '正常な日付なら送信できる',
        async (dateText) => {
          render(<RegisterForm onSubmit={mockOnSubmit} />);
          const user = UserEvent.setup();

          await inputAndSubmitData(user, { birthday: dateText });

          expect(mockOnSubmit).toBeCalled();
        }
      );

      test.each([['1996-08-32'], ['1976-13-17']])(
        '正常でない日付は送信できない',
        async (dateText) => {
          render(<RegisterForm onSubmit={mockOnSubmit} />);
          const user = UserEvent.setup();

          await inputAndSubmitData(user, { birthday: dateText });

          expect(mockOnSubmit).not.toBeCalled();
          const alertText = await screen.findByRole('alert');
          expect(
            getByText(alertText, '正しい日付を入力してください。')
          ).toBeInTheDocument();
        }
      );
    });
  });

  describe('好きな動物のバリデーション', () => {
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
