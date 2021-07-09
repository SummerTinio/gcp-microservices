import React, {
  useState,
} from 'react';

import Router from 'next/router';

import useRequest from 'hooks/useRequest';

interface SignUpProps {

}

interface SignUpState {
  email: string;
  password: string;
  errors: [];
}

const SignUp: React.FC<SignUpProps> = function SignUpComponent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/users/signup',
    method: 'post',
    body: {
      email, password
    },
    onSuccess: () => {
      return Router.push('/');
    }
  })

  const emailHandleChange = ({ target }) => {
    setEmail(target.value);
  }

  const passwordHandleChange = ({ target }) => {
    setPassword(target.value);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    doRequest(); // will automatically call provided onSuccess callback, if passed in as params
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
      {errors}
      <button>Sign Up</button>
    </form>
  );
}

export default SignUp;
