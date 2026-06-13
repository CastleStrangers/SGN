import asyncio
import os
import sys
from google.antigravity import Agent, LocalAgentConfig
from google.antigravity.hooks import policy

# 1. Define a custom Python tool that the agent can call
def get_current_weather(location: str) -> str:
    """Gets the current weather for a location.
    
    Args:
        location: The city and state, e.g. San Francisco, CA
    """
    return f"The weather in {location} is currently sunny and 22°C."

async def stream_thoughts(response):
    print("🧠 [Thought Stream Started]")
    async for thought in response.thoughts:
        sys.stdout.write(f"\033[90m{thought}\033[0m")  # Gray color for thoughts
        sys.stdout.flush()
    print("\n🧠 [Thought Stream Finished]\n")

async def stream_tool_calls(response):
    print("⚙️ [Tool Call Stream Started]")
    async for call in response.tool_calls:
        print(f"\n⚙️ Agent called tool: \033[93m{call.name}\033[0m with args: {call.args}\n")
    print("⚙️ [Tool Call Stream Finished]\n")

async def stream_text(response):
    print("💬 [Text Stream Started]")
    async for text in response:
        sys.stdout.write(text)
        sys.stdout.flush()
    print("\n💬 [Text Stream Finished]\n")

async def main():
    # Make sure API key is available
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("❌ Error: Please set your GEMINI_API_KEY first!")
        sys.exit(1)

    print("🤖 Starting the Antigravity Agent (Advanced Streaming Mode)...")
    
    # We pass the api_key, our custom tool, and allow all tools to avoid prompt block
    config = LocalAgentConfig(
        api_key=api_key,
        vertex=False,
        model="gemini-2.5-flash",
        tools=[get_current_weather],
        policies=[policy.allow_all()]
    )
    
    async with Agent(config) as agent:
        # Ask a query that requires calling our custom tool
        print("💬 Sending query: 'What's the weather like in Tokyo?'\n")
        response = await agent.chat("What's the weather like in Tokyo?")
        
        # We consume all streams concurrently using asyncio.gather.
        # Since thoughts, tool_calls, and text return independent cursors over a shared buffer,
        # they can safely be consumed concurrently!
        await asyncio.gather(
            stream_thoughts(response),
            stream_tool_calls(response),
            stream_text(response)
        )

if __name__ == "__main__":
    asyncio.run(main())
