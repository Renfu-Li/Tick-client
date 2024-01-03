/// <reference types="cypress" />

describe("when logged in", () => {
  beforeEach(() => {
    cy.request("POST", "http://localhost:3003/api/testing/reset");

    cy.signupByAPI();

    cy.loginByAPI();
    cy.visit("http://localhost:5173/home");
  });

  it("user can create a list with task count as 0", () => {
    cy.contains("Lists").click();
    cy.get("#new-list-input").type("magic");
    cy.get("#add-list").click();
    cy.get("ul > li").contains("magic");
    cy.get("ul > li").contains("0");
  });

  describe("when there are 3 lists", () => {
    beforeEach(() => {
      cy.createList("magic");
      cy.createList("health");
      cy.createList("social");
    });

    it("user can create a new task", () => {
      cy.get("#task-input").click().type("go out everyday");
      cy.get("#select-list-button").click();
      cy.get("#list-menu-in-task-form").contains("health").click();
      cy.get("#submit-task-button").click();
      cy.get("ul > li").contains("go out everyday");
      cy.contains("health").parent().parent().contains(1);
    });
  });
});
