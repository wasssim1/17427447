describe("Comment App E2E Tests", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("adds a comment, replies, and deletes recursively", () => {
    // Add a parent comment
    cy.get('input[placeholder="Add a comment..."]').type(
      "This is a parent comment"
    );
    cy.contains("Post").click();

    // The comment should appear in the list
    cy.contains("This is a parent comment").should("exist");

    // Click Reply on the parent comment
    cy.contains("Reply").click();

    // Add a reply
    cy.get('input[placeholder="Write a reply..."]').type(
      "This is a child comment"
    );
    cy.contains("Post").click();

    // The child comment should appear nested
    cy.contains("This is a child comment").should("exist");

    // Delete the parent comment, which should recursively remove the child as well
    cy.contains("Delete").first().click();

    // Verify that neither the parent nor the child comment exists
    cy.contains("This is a parent comment").should("not.exist");
    cy.contains("This is a child comment").should("not.exist");
  });
});
