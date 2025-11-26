import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import { useAuth0 } from "@auth0/auth0-react";

const Home = () => {
  const { user, isAuthenticated } = useAuth0();
  return (
    <div className="home" style={{ padding: '0', margin: '0'}}>
      <h1 style ={{
        fontSize: '96px',
        marginBottom: '0px',
        paddingBottom: '0px',
        paddingLeft: '40px',

      }}>Welcome to</h1>
      <h1 style ={{
        fontSize: '96px',
        marginTop: '0px',
        paddingTop: '0px',
        marginBottom: '0px',
        paddingBottom: '0px',
        paddingLeft: '40px',
      }}>neapolitan.</h1>
      
      <h2 style ={{
        fontSize: '40px',
        marginBottom: '0px',
        paddingBottom: '0px',
        paddingLeft: '40px',
        }}>
      <span className="arrow" style={{ color: '#F26419'}}>&gt;</span> simplify your asset-based financing</h2>
      {isAuthenticated && user ? (
        <>
          <h2 style ={{
        fontSize: '24px',
        marginBottom: '0px',
        paddingBottom: '0px',
        paddingLeft: '40px',
        marginTop: '7ch'}}>
            Click on <LogoutButton /> to safely log out.{" "}
          </h2>
        </>
      ) : (
        <h2 style ={{
        fontSize: '24px',
        marginBottom: '0px',
        paddingBottom: '0px',
        paddingLeft: '40px',
        marginTop: '7ch'}}>
          Please <LoginButton /> to continue{" "}
        </h2>
      )}
      <br></br>
    </div>
  );
};

export default Home;
