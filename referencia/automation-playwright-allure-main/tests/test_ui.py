from playwright.sync_api import sync_playwright
import allure

@allure.title("Teste: Abertura do Google")
def test_open_google():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("https://www.google.com")
        allure.attach(page.title(), name="Título da Página", attachment_type=allure.attachment_type.TEXT)
        assert "Google" in page.title()
        browser.close()