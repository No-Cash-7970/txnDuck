import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Home from "./page";

describe("Home Page", () => {
	it("should render without crashing", () => {
		render(<Home />);

		const title = screen.getByText(/Hello!/);

		expect(title).toBeInTheDocument();
	});
});
