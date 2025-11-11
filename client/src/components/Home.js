import Profile from "./Profile";
import LoginButton from "./LoginButton";
import LogoutButton
 from "./LogoutButton";
const Home = () => {
  return (
    <div className="home">
      <h1>Welcome to Neapolitan Debt Management Software</h1>
            <LoginButton />
      <LogoutButton />
      <Profile />
    </div>
  );
};

export default Home;
