import React from 'react';
import axios from 'axios';
import { useState } from 'react';

interface useRequestProps {
  url: string,
  method: string,
  body: {},
  onSuccess: (backendResponse?) => void
}

const useRequest = function useRequestHook({ url, method, body, onSuccess }: useRequestProps) {
  const [errors, setErrors] = useState(null);

  const doRequest = async () => {
    try {
      setErrors(null);
      // access axios method using computed member access notation
      // e.g. if method === POST --> await axios.post(url, body)
      const response = await axios[method.toLowerCase()](url, body)

      if (onSuccess) {
        onSuccess(response.data);
      }
      
      return response.data;
    } catch (err) {
      // console.log(err.response);
      const errorsArrayFromAPI = err.response.data.errors;

      setErrors(
        (<ul> 
          {errorsArrayFromAPI.map((err, i) => (<li key={i}>{err.message}</li>))}
        </ul>)
      )
    }
  };
  
  return { doRequest, errors }
};

export default useRequest;