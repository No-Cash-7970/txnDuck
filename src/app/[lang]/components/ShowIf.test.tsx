import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import ShowIf from "./ShowIf";

describe('ShowIf Component', () => {

  it('renders children if given condition is true', () => {
    render(<ShowIf cond={true}>Hello!</ShowIf>);
    expect(screen.getByText('Hello!')).toBeInTheDocument();
  });

  it('does not render children if given condition is false', () => {
    render(<ShowIf cond={false}>Hello!</ShowIf>);
    expect(screen.queryByText('Hello!')).not.toBeInTheDocument();
  });

  it('renders nothing if there is no content', () => {
    const {container} = render(<ShowIf cond={true}></ShowIf>);
    expect(container.innerHTML).toBeFalsy();
  });

});
