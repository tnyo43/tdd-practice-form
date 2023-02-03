import { useForm } from 'react-hook-form';
import './index.css';

export type Inputs = {
  name: string;
  nickname: string;
  birthday: string;
};

type Props = {
  onSubmit: (data: Inputs) => void;
};

export const RegisterForm: React.FC<Props> = (props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  return (
    <form onSubmit={handleSubmit((data) => props.onSubmit(data))}>
      <div id="register-form" className="container">
        <div className="input-unit">
          <label htmlFor="register-form--name" className="required">
            ユーザ名
          </label>
          <input
            id="register-form--name"
            {...register('name', { required: 'ユーザ名を入力してください' })}
          />
          {errors.name && (
            <p role="alert" className="error">
              {errors.name.message}
            </p>
          )}
        </div>
        <div className="input-unit">
          <label htmlFor="register-form--nickname">ニックネーム</label>
          <input id="register-form--nickname" {...register('nickname')} />
          {errors.nickname && (
            <p role="alert" className="error">
              {errors.nickname.message}
            </p>
          )}
        </div>
        <div className="input-unit">
          <label htmlFor="register-form--birthday" className="required">
            生年月日
          </label>
          <p>YYYY-MM-DD の形式で入力してください。</p>
          <input
            id="register-form--birthday"
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
          />
          {errors.birthday && (
            <p role="alert" className="error">
              {errors.birthday.message}
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
