import React, {
  useState,
} from 'react';
import axios from 'axios';

interface SignUpProps {
 // yo: string;
}

interface SignUpState {
  email: string;
  password: string;
  errors: [];
}

const SignUp: React.FC<SignUpProps> = function SignUpComponent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Array<string> | string>([]);

  const emailHandleChange = ({ target }) => {
    setEmail(target.value);
  }

  const passwordHandleChange = ({ target }) => {
    setPassword(target.value);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('/api/users/signup', {
        email, password
      }); // api response === accessible on response.data

      console.log(response.data);
    } catch (err) {
      console.log(err.response.data.errors)
      setErrors(err.response.data.errors);
    }

  }

  const displayErrors = () => {
    if (errors.length > 1) {
      return (
        <ul>
          {errors.map((err, i) => <li key={i}>{err.message}</li>)}
        </ul>
      )
    } 

    return (
      <>
        {errors.message}
      </>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Sign Up</h1>
      <div className="form-group">
        <label>Email Address</label>
        <input value={email} onChange={emailHandleChange} className="form-control" />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input value={password} onChange={passwordHandleChange} type="password" className="form-control" />
      </div>
      {displayErrors()}
      <button>Sign Up</button>
    </form>
  );
}

export default SignUp;
