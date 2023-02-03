import { useForm } from 'react-hook-form';
import './index.css';

type Inputs = {
  name: string;
};

type Props = {
  onSubmit: (data: Inputs) => void;
};

export const RegisterForm: React.FC<Props> = (props) => {
  const { register, handleSubmit } = useForm<Inputs>();

  return (
    <form onSubmit={handleSubmit((data) => props.onSubmit(data))}>
      <div id="register-form" className="container">
        <div className="input-unit">
          <label htmlFor="register-form--name">ユーザ名</label>
          <input id="register-form--name" {...register('name')} />
        </div>
        <div className="input-unit">
          <button type="submit">送信</button>
        </div>
      </div>
    </form>
  );
};
