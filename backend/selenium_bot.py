# selenium_bot.py

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

class SeleniumBot:
    def _init_(self, headless=True):
        options = Options()
        if headless:
            options.add_argument("--headless")
        options.add_argument("--disable-gpu")
        options.add_argument("--no-sandbox")
        # Initialize the WebDriver and assign to self.driver
        self.driver = webdriver.Chrome(options=options)

    def open_site(self, url):
        self.driver.get(url)

    def extract_text(self, tag_name, limit=10):
        elements = self.driver.find_elements(By.TAG_NAME, tag_name)
        texts = [el.text for el in elements if el.text.strip()]
        return texts[:limit]

    def close(self):
        # Quit the driver
        self.driver.quit()