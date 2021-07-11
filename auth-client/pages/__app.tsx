import { AppContextType } from 'next/dist/next-server/lib/utils';
import { NextPageContext } from 'next';
import React from 'react';

import preconfiguredAxios from 'api/preconfiguredAxios';
import Header from 'components/header';


interface AppComponentProps {
  ChildComponent: React.ReactChildren;
}

/**
 * AppComponent === our monkey-patched Next server.
 * AppComponent === the first render prop.
 * is also a custom App Component as opposed to being a typical Next 'Page'.
 * 
 * **order does NOT matter when destructuring**.
 * 
 * `props.ChildComponent` aka props.Component <-- Next automatically passes this into __app
 * `props.childProps` aka props.pageProps <-- w/c we manually returned from the very first __app .getInitialProps() call.
 * `props.currentUser` <-- the other thing we manually returned. 
 * 
 * { childProps, currentUser: response.data.currentUser }
 */
const AppComponent = function AppComponentComponent<AppComponentProps>({
  ChildComponent,
  childProps,
  currentUser,
}) {
  return (
    <div>
      <Header currentUser={currentUser} />
      <ChildComponent {...childProps} />
    </div>
  );
}

/** 
 * the .getInitialProps from your monkey-patched Next server
 * will receive the ff. context ===> { AppTree: , Component: , router: , ctx: }
 * 
 * `appContext.ctx` === NextPageContext === { req, res }
 * 
 * our cookies are in `appContext.ctx.req.headers`.
 * */
AppComponent.getInitialProps = async (appContext: AppContextType) => {
  // initial request overhead
  const response = await preconfiguredAxios(appContext.ctx).get('/api/users/currentuser');

  /**
   * childProps === a.k.a. 'pageProps'
   * childProps === `{ currentUser: ... }`
   * 
   * we're manually calling LandingPage.getInitialProps() from inside __app
   * since it no longer gets invoked on its own (at very first, initial SSR request)
   */
  let childProps = {};

  if (appContext.Component.getInitialProps) {
    childProps = await appContext.Component.getInitialProps(appContext.ctx);
  }

  // must return a plain object from .getInitialProps() -- without using .map(), .date(), .set()
  return { // you can destructure these out from the AppComponent itself.
    childProps,
    currentUser: response.data.currentUser // or ...response.data
  };
};

export default AppComponent;