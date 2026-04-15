import requests
import allure

@allure.title("Teste: Requisição GET JSONPlaceholder")
def test_api_get():
    url = "https://jsonplaceholder.typicode.com/posts/1"
    response = requests.get(url)
    allure.attach(response.text, name="Resposta JSON", attachment_type=allure.attachment_type.JSON)
    assert response.status_code == 200
    assert response.json()["id"] == 1