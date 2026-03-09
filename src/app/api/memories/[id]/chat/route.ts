import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await context.params
  const { message } = await req.json()
  const memory = await db.memory.findUnique({
    where: { id },
    include: { chatHistory: { orderBy: { createdAt: 'asc' }, take: 20 } }
  })
  if (!memory) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  await db.memoryChat.create({ data: { memoryId: memory.id, role: 'user', content: message } })
  const history = memory.chatHistory.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }))
  history.push({ role: 'user', content: message })
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 500,
    system: `You are a warm companion helping explore a precious memory: "${memory.title}" (${memory.year || 'undated'}). ${memory.description}. Ask gentle questions, keep responses to 2-3 sentences.`,
    messages: history,
  })
  const aiMessage = response.content[0].type === 'text' ? response.content[0].text : ''
  await db.memoryChat.create({ data: { memoryId: memory.id, role: 'assistant', content: aiMessage } })
  return NextResponse.json({ message: aiMessage })
}
