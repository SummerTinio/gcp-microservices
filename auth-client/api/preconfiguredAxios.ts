import { NextPageContext } from 'next';
import axios from 'axios';

/**
 * await preconfiguredAxios().method() === meant to be called from inside .getInitialProps(). will return response object.
 * @param context or { req } : NextPageContext (captured from params of .getInitialProps)  
 * @returns a pre-configured instance of axios that sends appropriate request headers. for SSR cookie-setting.
 */
const preconfiguredAxios = function buildClientFromInsideGetInitialProps({ req }: NextPageContext) {
  // when running serverside, (i.e. when window !== 'global')
  if (typeof window === 'undefined') {
    // we are on the server
    // so send initial req.headers!
    return axios.create({ // 
      baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers
    });

  } else {
    // we are on the browser
    // no need to pass in new headers!
    return axios.create({
      baseURL: '/'
    });
  }
}

export default preconfiguredAxios;