import React, {
  useEffect,
} from 'react'
// note: must import Router from 'next/router' instead of { Router }
// otherwise: you'll get an ordinary Router instead of the SingletonRouter w/c has method Router.push
import Router from 'next/router';

import useRequest from 'hooks/useRequest';

interface SignOutProps {

}

const SignOut: React.FC<SignOutProps> = function SignOutComponent({}) {
  const { doRequest, errors } = useRequest({
    url: '/api/users/signout',
    method: 'post',
    body: {},
    onSuccess: () => {
      return Router.push('/');
    }
  });

  useEffect(() => {
    doRequest();
  }, []) // [] so will only be called once, on initial render.

  return (
    <>
    Signing you out..
    </>
  );
}

export default SignOut;