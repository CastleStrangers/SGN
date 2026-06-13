import asyncio
import os
import sys
from google.antigravity import Agent, LocalAgentConfig
from google.antigravity.types import McpStdioServer
from google.antigravity.hooks import policy

async def main():
    # Make sure API key is available
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("❌ Error: Please set your GEMINI_API_KEY first!")
        sys.exit(1)

    print("🤖 Starting the Antigravity Agent with MCP server config...")
    
    # Define the MCP server configuration
    # Note: Replace "my-mcp-server" with your actual MCP package/command
    mcp_server = McpStdioServer(
        name="my_server", 
        command="npx", 
        args=["my-mcp-server"]
    )
    
    # We pass the MCP servers to the config
    config = LocalAgentConfig(
        api_key=api_key,
        vertex=False,
        model="gemini-2.5-flash",
        mcp_servers=[mcp_server],
        # When using write tools or MCP servers, a safety policy must be defined.
        # Here we allow all to run MCP tools without confirmation prompts.
        policies=[policy.allow_all()]
    )
    
    async with Agent(config) as agent:
        print("💬 Chatting with agent (instructing it to use MCP)...")
        response = await agent.chat("Use the MCP tools to help me.")
        
        print("\n✨ Agent Response:")
        print("-" * 40)
        print(await response.text())
        print("-" * 40)

if __name__ == "__main__":
    asyncio.run(main())
