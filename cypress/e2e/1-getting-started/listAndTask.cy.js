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
    cy.get('[data-cy="new-list-input"]').type("magic");

    cy.get('[data-cy="add-list-button"]').click();

    cy.get("ul > li").contains("magic");
    cy.get("ul > li").contains("0");
  });

  describe("when there are 3 lists", () => {
    beforeEach(() => {
      cy.createList("magic");
      cy.createList("health");
      cy.createList("social");
    });

    it("user can create a new task with default date", () => {
      cy.get('[data-cy="task-input"]').click().type("go out everyday");
      cy.get('[data-cy="select-list-button"]').click();
      cy.get('[data-cy="list-menu-in-task-form"]').contains("health").click();
      cy.get('[data-cy="submit-task-button"]').click();
      cy.get("ul > li").contains("go out everyday");
      cy.contains("health").parent().parent().contains(1);
    });

    it("user can create a new task with slef-chosen date", () => {
      cy.get('[data-cy="task-input"]').type("add E2E testing");

      cy.get('[data-cy="calendar-button"]').click();
      cy.get('[data-cy="date-input-in-task-form"]')
        .should("be.visible")
        .type("2024-12-25");

      cy.get('[data-cy="select-list-button"]').click();
      cy.get('[data-cy="list-menu-in-task-form"]').contains("magic").click();
      cy.get('[data-cy="submit-task-button"]').click();

      cy.get('[data-cy="listName-in-Lists"]').contains("magic").click();
      cy.get('[data-cy="name-of-task-items"]')
        .should("be.visible")
        .contains("add E2E testing");
      cy.contains("magic").parent().parent().contains(1);
    });
    // failed because we can't see it in "Today". we should first click "magic" list
  });
});
