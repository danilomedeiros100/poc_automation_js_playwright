@ui
Feature: Produtos
  Como usuário logado
  Quero visualizar e interagir com os produtos
  Para escolher o que desejo comprar

  Background:
    Given que estou logado no sistema

  @sanity @smoke
  Scenario: Visualizar lista de produtos após login
    Then devo ver a lista de produtos
    And a quantidade de produtos deve ser maior que zero

  @sanity
  Scenario: Título da página de inventário está correto
    Then o título da página de inventário deve ser "Products"

  @critical
  Scenario: Adicionar produto ao carrinho
    When adiciono o primeiro produto ao carrinho
    Then o contador do carrinho deve exibir "1"

  @regression
  Scenario: Falha intencional - demonstração de screenshot e vídeo em falha
    Then o título da página de inventário deve ser "TITULO ERRADO INTENCIONAL"
