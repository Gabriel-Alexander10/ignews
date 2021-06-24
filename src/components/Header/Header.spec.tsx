import { render, screen } from '@testing-library/react';
import { Header } from '.';

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

jest.mock('next-auth/client', () => {
  return {
    useSession() {
      return [null, false];
    }
  }
})

describe('Header component', () => {
  it('renders correctly', () => {
    render(
      <Header />
    ); // renderiza um componente de forma virtual, para conseguirmos ver como é seu output

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Posts")).toBeInTheDocument();
  });
});