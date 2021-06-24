import { getByText, render } from '@testing-library/react';
import { ActiveLink } from '.';

 // toda vez que esse modulo for importado no componente, o jest irá retornar esse mock no lugar
jest.mock("next/router", () => {
  return {
    useRouter() {
      return {
        asPath: '/'
      }
    }
  }
});

describe('ActiveLink component', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <ActiveLink href="/" activeClassName="active" >
        <a>Home</a>
      </ActiveLink>
    ); // renderiza um componente de forma virtual, para conseguirmos ver como é seu output

    expect(getByText("Home")).toBeInTheDocument();
  });

  it('adds active class if the link is currently active', () => {
    const { getByText } = render(
      <ActiveLink href="/" activeClassName="active" >
        <a>Home</a>
      </ActiveLink>
    );

    expect(getByText("Home")).toHaveClass("active");
  });
})
