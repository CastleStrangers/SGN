import asyncio
import os
import sys
from google.antigravity import Agent, LocalAgentConfig, CapabilitiesConfig
from google.antigravity.utils.interactive import run_interactive_loop

async def main():
    # Make sure API key is available
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("❌ Error: Please set your GEMINI_API_KEY first!")
        sys.exit(1)

    print("🤖 Starting the Antigravity Agent in Interactive Mode...")
    
    config = LocalAgentConfig(
        api_key=api_key,
        vertex=False,
        model="gemini-2.5-flash",
        capabilities=CapabilitiesConfig(),
    )
    
    async with Agent(config) as agent:
        await run_interactive_loop(agent)

if __name__ == "__main__":
    asyncio.run(main())
