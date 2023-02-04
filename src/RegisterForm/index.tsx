import { useForm } from 'react-hook-form';
import { RUnion } from '../type';
import './index.css';

export type Inputs = {
  name: string;
  nickname: string;
  birthday: string;
  favorite: string;
};

type Props = {
  onSubmit: (data: Inputs) => void;
} & RUnion<
  | {
      mode: 'create';
    }
  | {
      mode: 'edit';
      defaultValue: Inputs;
    }
>;

export const RegisterForm: React.FC<Props> = (props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: props.defaultValue,
  });

  return (
    <form onSubmit={handleSubmit((data) => props.onSubmit(data))}>
      <div id="register_form" className="container">
        <div className="input-unit required">
          <label htmlFor="register_form-name">ユーザ名</label>
          <input
            id="register_form-name"
            {...register('name', { required: 'ユーザ名を入力してください' })}
            aria-invalid={!!errors.name}
            aria-describedby="register_form-name-error"
          />
          {errors.name && (
            <p id="register_form-name-error" role="alert" className="error">
              {errors.name.message}
            </p>
          )}
        </div>
        <div className="input-unit">
          <label htmlFor="register_form-nickname">ニックネーム</label>
          <input
            id="register_form-nickname"
            {...register('nickname')}
            aria-invalid={!!errors.nickname}
            aria-describedby="register_form-nickname-error"
          />
          {errors.nickname && (
            <p id="register_form-nickname-error" role="alert" className="error">
              {errors.nickname.message}
            </p>
          )}
        </div>
        <div className="input-unit required">
          <label htmlFor="register_form-birthday">生年月日</label>
          <p>YYYY-MM-DD の形式で入力してください。</p>
          <input
            id="register_form-birthday"
            readOnly={props.mode === 'edit'}
            {...register('birthday', {
              required: '生年月日を入力してください。',
              validate: {
                rightFormat: (x) =>
                  /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(x) ||
                  '正しい形式で入力してください。',
                validDate: (x) =>
                  !isNaN(new Date(x).getDate()) ||
                  '正しい日付を入力してください。',
              },
            })}
            aria-invalid={!!errors.birthday}
            aria-describedby="register_form-birthday-error"
          />
          {errors.birthday && (
            <p id="register_form-birthday-error" role="alert" className="error">
              {errors.birthday.message}
            </p>
          )}
        </div>
        <div className="input-unit">
          <label htmlFor="register_form-favorite">好きな動物</label>
          <select
            id="register_form-favorite"
            {...register('favorite')}
            aria-invalid={!!errors.favorite}
            aria-describedby="register_form-favorite-error"
          >
            <option value="">---</option>
            <option value="dog">イヌ</option>
            <option value="cat">ネコ</option>
            <option value="rabbit">ウサギ</option>
          </select>
          {errors.favorite && (
            <p id="register_form-favorite-error" role="alert" className="error">
              {errors.favorite.message}
            </p>
          )}
        </div>
        <div className="input-unit">
          <button type="submit">送信</button>
        </div>
      </div>
    </form>
  );
};
