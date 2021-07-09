import { NextPageContext } from 'next';
import preconfiguredAxios from 'api/preconfiguredAxios';

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
 const response = await preconfiguredAxios(context).get('/api/users/currentuser');
  return response.data; // will return { currentUser: null } or { currentUser: { id: , email: , iat:  }}
};

export default Index;