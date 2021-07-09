import React, {
  useState,
} from 'react';

import Router from 'next/router';

import useRequest from 'hooks/useRequest';

interface SignInProps {
  emailHandleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  passwordHandleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

interface SignInState {
  email: string;
  password: string;
  errors: [];
}

const SignIn: React.FC<SignInProps> = ({}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/users/signin',
    method: 'post',
    body: {
      email, password
    },
    onSuccess: () => {
      return Router.push('/');
    }
  })

  const emailHandleChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(target.value);
  }

  const passwordHandleChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(target.value);
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    doRequest(); // will automatically call provided onSuccess callback, if passed in as params
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Sign In</h1>
      <div className="form-group">
        <label>Email Address</label>
        <input value={email} onChange={emailHandleChange} className="form-control" />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input value={password} onChange={passwordHandleChange} type="password" className="form-control" />
      </div>
      {errors}
      <button>Sign In</button>
    </form>
  );
}

export default SignIn;
