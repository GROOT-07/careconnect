import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function enhanceMemory(memory: {
  title: string
  year?: string | number
  category?: string
  description: string
  clientName: string
}): Promise<string> {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 500,
    messages: [
      {
        role: 'user',
        content: `You are a compassionate storyteller helping an elderly person revisit cherished memories. 
        
Given this memory fragment for ${memory.clientName}, write a warm, vivid, second-person narrative expansion (3-4 sentences) that brings the memory to life with sensory detail. Use "you" to address them directly. Keep it gentle, joyful, and grounded in the details provided. Do not invent facts not implied by the description.

Memory title: "${memory.title}"
Year: ${memory.year || 'unknown'}
Category: ${memory.category || 'general'}
Description: ${memory.description}

Write only the expanded narrative, nothing else.`,
      },
    ],
  })

  const content = message.content[0]
  if (content.type === 'text') return content.text
  return memory.description
}

export async function generateMemoryConversation(
  memory: { title: string; description: string; aiEnhanced?: string | null },
  userMessage: string,
  conversationHistory: { role: 'user' | 'assistant'; content: string }[]
): Promise<string> {
  const systemPrompt = `You are a warm, gentle companion helping an elderly person explore and discuss a cherished memory. 
  
The memory being discussed:
Title: "${memory.title}"
Description: ${memory.aiEnhanced || memory.description}

Your role:
- Be warm, patient, and encouraging
- Ask gentle follow-up questions to help them recall more details
- Validate and celebrate the memory with them
- Keep responses concise (2-3 sentences max)
- Use simple, clear language
- Never invent facts — only work with what they share`

  const messages = [
    ...conversationHistory,
    { role: 'user' as const, content: userMessage },
  ]

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 300,
    system: systemPrompt,
    messages,
  })

  const content = response.content[0]
  if (content.type === 'text') return content.text
  return "That sounds like a beautiful memory. Can you tell me more?"
}

export async function getDailyActivity(clientName: string, recentMemories: string[]): Promise<{
  type: string
  title: string
  description: string
  prompt: string
}> {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 300,
    messages: [
      {
        role: 'user',
        content: `Generate a gentle cognitive activity for ${clientName}, an elderly person in memory care.
        
Their recent memories involve: ${recentMemories.join(', ')}.

Return a JSON object with:
- type: one of "puzzle", "story", "music", "reflection"
- title: short activity title
- description: one sentence description
- prompt: an engaging opening question or prompt for the activity

Return only valid JSON, no markdown.`,
      },
    ],
  })

  const content = message.content[0]
  if (content.type === 'text') {
    try {
      return JSON.parse(content.text)
    } catch {
      return {
        type: 'reflection',
        title: 'Memory Reflection',
        description: 'A gentle moment to revisit a favourite memory.',
        prompt: 'What is a place that always made you feel at home?',
      }
    }
  }
  return {
    type: 'reflection',
    title: 'Daily Reflection',
    description: 'Take a moment to reflect on something that brings you joy.',
    prompt: 'What is something that made you smile recently?',
  }
}
