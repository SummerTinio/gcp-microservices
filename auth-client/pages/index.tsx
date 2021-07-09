import { NextPageContext } from 'next';
import axios from 'axios'

interface IndexProps {

}

const Index = function IndexComponent<IndexProps>({ currentUser }) {
  return (
    <>
      <h1>Landing Page </h1>
      {currentUser && <h2>Hey, {currentUser.email}!</h2>}
    </>
  );
}

Index.getInitialProps = async (context: NextPageContext) => {
  if (typeof window === 'undefined') { // i.e. if we're in a server envt, where the global object !== 'window'
    // we are on the server
    // make requests to the complete ingress-srv url
    const response = await axios.get('http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser', {
      headers: context.req.headers
    })
    return response.data; // <-- will be accessible via Index.props.data
  } else {
    // we are likely in the browser
    // destructure JSON API response from res.data
    const response = await axios.get('/api/users/currentuser', {
      headers: context.req.headers
    })

    return response.data; // <-- will be accessible via Index.props.data
  }
  return {};
};

export default Index;