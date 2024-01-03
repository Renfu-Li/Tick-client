/// <reference types="cypress" />

describe("when logged in", () => {
  beforeEach(() => {
    cy.request("POST", "http://localhost:3003/api/testing/reset");

    cy.signupByAPI();

    cy.loginByAPI();
    cy.visit("http://localhost:5173/home");
  });

  it("user can create a list", () => {
    cy.contains("Lists").click();
    cy.get("#new-list-input").type("magic");
    cy.get("#add-list").click();
    cy.get("ul > li").contains("magic");
  });
});
