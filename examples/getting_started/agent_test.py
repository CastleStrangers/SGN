import asyncio
import os
import sys
from google.antigravity import Agent, LocalAgentConfig

async def main():
    # Make sure we have the API key in the environment
    if not os.environ.get("GEMINI_API_KEY"):
        print("❌ Error: Please set your GEMINI_API_KEY first!")
        sys.exit(1)

    print("🤖 Starting the Antigravity Agent...")
    config = LocalAgentConfig(
        system_instructions="You are an expert assistant for codebase navigation.",
        api_key=os.environ["GEMINI_API_KEY"],
    )
    
    async with Agent(config) as agent:
        print("💬 Sending message to agent...")
        response = await agent.chat("What files are in the current directory?")
        
        print("\n✨ Agent Response:")
        print("-" * 40)
        print(await response.text())
        print("-" * 40)

if __name__ == "__main__":
    asyncio.run(main())
