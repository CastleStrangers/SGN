import os
import sys

def main():
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key or api_key == "your_api_key_here":
        print("❌ Error: GEMINI_API_KEY environment variable is not set correctly.")
        print("Please set it using the following command in PowerShell:")
        print('$env:GEMINI_API_KEY="your_actual_api_key"')
        sys.exit(1)
        
    try:
        # Import the library to verify it's installed correctly
        import google.antigravity
        print("✅ Successfully imported google.antigravity!")
        
        # We can use the GenAI client to make a quick test call
        from google import genai
        print("✅ Successfully imported google.genai!")
        
        print("\n⏳ Sending a test message to Gemini...")
        client = genai.Client() # Automatically uses GEMINI_API_KEY from environment
        
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents='Say exactly: "Hello World! The setup is complete and working correctly."'
        )
        
        print("\n✨ Response from Gemini:")
        print("-" * 40)
        print(response.text.strip())
        print("-" * 40)
        
    except ImportError as e:
        print(f"❌ Error importing modules: {e}")
    except Exception as e:
        print(f"❌ An error occurred during the API call: {e}")
        
if __name__ == "__main__":
    main()
