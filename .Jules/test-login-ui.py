from playwright.sync_api import sync_playwright
import time
import os

def run():
    output_dir = "/home/jules/verification/screenshots/"
    os.makedirs(output_dir, exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=['--no-sandbox', '--disable-setuid-sandbox'])
        page = browser.new_page()
        page.goto("file:///app/login.html")

        # Test keyboard navigation and focus
        # Focus the first tab
        page.keyboard.press("Tab")
        # Ensure focus hits the first tab
        page.locator("#btn-login").focus() # Force focus just to be safe if first tab press hits document

        # Verify focus is visible
        page.screenshot(path=os.path.join(output_dir, "login-focus.png"))

        # Press right arrow to navigate to the next tab
        page.keyboard.press("ArrowRight")
        page.wait_for_timeout(500)

        # Verify focus moved to Sign Up tab
        page.screenshot(path=os.path.join(output_dir, "signup-focus.png"))

        browser.close()

if __name__ == "__main__":
    run()
