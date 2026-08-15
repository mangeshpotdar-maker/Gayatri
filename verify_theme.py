import os
from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="/home/jules/verification/videos",
            viewport={"width": 1280, "height": 800}
        )
        page = context.new_page()

        # 1. Load Homepage
        page.goto("http://localhost:3000")
        page.wait_for_timeout(1000)
        page.screenshot(path="/home/jules/verification/screenshots/homepage.png")

        # 2. Go to Shop
        page.click("text=Explore Collection")
        page.wait_for_timeout(1000)
        page.screenshot(path="/home/jules/verification/screenshots/shop.png")

        # 3. Open Product Detail
        page.click("text=Golden Horizon Textured Canvas Painting")
        page.wait_for_timeout(1000)
        page.screenshot(path="/home/jules/verification/screenshots/product.png")

        # 4. Add to cart & checkout
        page.click("text=Add to Cart")
        page.wait_for_timeout(1000)
        page.click("text=Proceed to Checkout")
        page.wait_for_timeout(1000)
        page.screenshot(path="/home/jules/verification/screenshots/checkout_light.png")

        context.close()
        browser.close()

if __name__ == "__main__":
    run()
