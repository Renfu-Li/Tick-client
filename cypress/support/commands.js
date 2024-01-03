// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("signupByUI", () => {
  cy.visit("http://localhost:5173/");
  cy.get("button:last").click();
  cy.get("input:first").clear();
  cy.get("input:first").type("newUser");
  cy.get("input:last").clear();
  cy.get("input:last").type("pass");
  cy.contains("Sign up").click();
});

Cypress.Commands.add("signupByAPI", () => {
  cy.request("POST", "http://localhost:3003/api/user/signup", {
    username: "newUser",
    password: "pass",
  });
});

Cypress.Commands.add("loginByAPI", () => {
  cy.request("POST", "http://localhost:3003/api/user/login", {
    username: "newUser",
    password: "pass",
  }).then((response) => {
    localStorage.setItem("token", response.body.token);
  });
});
