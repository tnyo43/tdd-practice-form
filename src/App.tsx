import './App.css';
import { RegisterForm } from './RegisterForm';

function App() {
  return (
    <div className="App">
      <RegisterForm onSubmit={console.log} />
    </div>
  );
}

export default App;
