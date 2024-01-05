/// <reference types="cypress" />

describe("user can login and signup", () => {
  it("user can sign up and login with the new account", () => {
    cy.request("POST", "http://localhost:3003/api/testing/reset");
    cy.signupByUI();
    cy.contains("Today");
  });

  it("user can login", () => {
    cy.visit("http://localhost:5173/");
    cy.get("input:first").clear();
    cy.get("input:first").type("newUser");

    cy.get("input:last").clear();
    cy.get("input:last").type("pass");

    cy.contains("Log in").click();
    cy.contains("Today");
  });
});
