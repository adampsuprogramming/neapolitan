import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();


  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    isAuthenticated && (
      <div style={{ marginLeft: 40 }}>
        <h1>User Profile</h1>
        <br></br>
        <img src={user.picture} alt={user.name} />
        <br></br>
        <br></br>
        <table>
          <tr>
            <td style={{ paddingRight: 20, fontWeight: 700 }}>First Name:</td>
            <td>{user.given_name}</td>
          </tr>
          <tr>
            <td style={{ paddingRight: 20, fontWeight: 700 }}>Last Name:</td>
            <td>{user.family_name}</td>
          </tr>
          <tr>
            <td style={{ paddingRight: 20, fontWeight: 700 }}>Nickname:</td>
            <td>{user.nickname}</td>
          </tr>
          <tr>
            <td style={{ paddingRight: 20, fontWeight: 700 }}>Email:</td>
            <td>{user.email}</td>
          </tr>
        </table>
      </div>
    )
  );
};

export default Profile;
