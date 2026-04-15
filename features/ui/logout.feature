@ui
Feature: Logout
  Como usuário logado
  Quero encerrar minha sessão
  Para garantir a segurança da minha conta

  Background:
    Given que estou logado no sistema

  @regression
  Scenario: Logout com sucesso retorna à tela de login
    When realizo o logout pelo menu lateral
    Then devo ser redirecionado à página de login
