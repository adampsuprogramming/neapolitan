import { render, screen } from "@testing-library/react";
import { useAuth0 } from "@auth0/auth0-react";
import { BrowserRouter } from "react-router-dom";
import TopNav from "./TopNav";

jest.mock(`@auth0/auth0-react`);

describe('TopNav', () => {
    it('shows login link if user IS NOT authenticated with Auth0', () => {
        useAuth0.mockReturnValue({
            isAuthenticated: false,
            isLoading: false,
        });

        render(
        <BrowserRouter><TopNav /></BrowserRouter>);
    })

    it('shows log out link if user IS authenticated with Auth0', () => {
        useAuth0.mockReturnValue({
            isAuthenticated: true,
            isLoading: false,
            user: {name: 'Test Test'}
        });

        render(
        <BrowserRouter><TopNav /></BrowserRouter>);

        expect(screen.getByText(/log out/i)).toBeInTheDocument();
        expect(screen.getByText(/Test Test/i)).toBeInTheDocument();   
    })

});