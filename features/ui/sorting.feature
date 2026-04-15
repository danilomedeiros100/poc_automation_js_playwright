@ui
Feature: Ordenação de produtos
  Como usuário logado
  Quero ordenar os produtos por diferentes critérios
  Para encontrar mais facilmente o que procuro

  Background:
    Given que estou logado no sistema

  @critical
  Scenario: Dropdown de ordenação está disponível
    Then o dropdown de ordenação deve estar visível

  @regression
  Scenario: Ordenação padrão é por nome A-Z
    Then a opção de ordenação padrão deve ser "Name (A to Z)"
