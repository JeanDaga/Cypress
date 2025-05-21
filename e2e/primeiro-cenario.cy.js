describe('template spec', () => {
  it('passes', () => {
    cy.visit('https://google.com')

    cy.get('textArea[name="q"]')
      .type('Cypress{enter}');
  })
})