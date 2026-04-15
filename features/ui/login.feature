@ui
Feature: Login
  Como usuário do sistema
  Quero realizar login na aplicação
  Para acessar o catálogo de produtos

  Background:
    Given que estou na página de login

  @sanity @smoke
  Scenario: Login com sucesso com credenciais válidas
    When preencho as credenciais de acesso válidas
    Then devo ser redirecionado ao inventário de produtos

  @regression
  Scenario Outline: Login com credenciais inválidas
    When faço login com usuário "<usuario>" e senha "<senha>"
    Then devo ver mensagem de erro contendo "<mensagem>"

    Examples:
      | usuario        | senha         | mensagem                                          |
      | invalid_user   | wrong_pass    | Username and password do not match                |
      | locked_out_user | secret_sauce | Sorry, this user has been locked out              |
