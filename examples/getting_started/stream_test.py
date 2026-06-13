import asyncio
import sys
import os
from google.antigravity import Agent, LocalAgentConfig

async def main():
    # Make sure API key is available
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("❌ Error: Please set your GEMINI_API_KEY first!")
        sys.exit(1)

    print("🤖 Starting the Antigravity Agent (Streaming Mode)...")
    
    # We pass the api_key and explicitly set vertex=False and model to match your setup
    config = LocalAgentConfig(
        api_key=api_key,
        vertex=False,
        model="gemini-2.5-flash"
    )
    
    async with Agent(config) as agent:
        print("💬 Requesting a poem about space...\n")
        print("✨ Agent Response:")
        print("-" * 40)
        
        # Returns instantly — does not block
        response = await agent.chat("Write a short poem about space.")
        
        # Streams the response token by token
        async for token in response:
            sys.stdout.write(token)
            sys.stdout.flush()
            
        print("\n" + "-" * 40)

if __name__ == "__main__":
    asyncio.run(main())
