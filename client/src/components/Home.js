import Profile from "./Profile";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import { useAuth0 } from "@auth0/auth0-react";

const Home = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  return (
    <div className="home">
      <h1>Welcome to Neapolitan Debt Management Software</h1>
      {isAuthenticated && user ? (
          <>
          

            <h3>Please click on <LogoutButton /> if you wish to log out of the system. </h3>
          </>
        ) : (
          <h3>Please click on <LoginButton /> to log into Neapolitan or sign up for access </h3>
        )}
      <br></br>

    </div>
  );
};

export default Home;
