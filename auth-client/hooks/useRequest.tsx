import React from 'react';
import axios from 'axios';
import { useState } from 'react';

interface Props {
  url: string,
  method: string,
  body: {}
}

const useRequest = function useRequestHook({ url, method, body }: Props) {
  const [errors, setErrors] = useState(null);

  const doRequest = async () => {
    try {
      // access axios method using computed member access notation
      // e.g. if method === POST --> await axios.post(url, body)
      const response = await axios[method.toLowerCase()](url, body)
      return response.data;
    } catch (err) {
      setErrors(
        (<ul>
          {err.response.data.errors.map((err, i) => (<li key={i}>err</li>))}
        </ul>)
      )
    }
  };
  
  return { doRequest, errors }
};

export default useRequest;