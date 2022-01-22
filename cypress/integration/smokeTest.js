describe('Elroy', () => {
  beforeEach(() => {
    cy.viewport('iphone-5');
  });

  it('runs a high level smoke test', () => {
    cy.visit('/');
    cy.wait(1000);

    cy.get('.center-button').contains('Settings');
  });
});
