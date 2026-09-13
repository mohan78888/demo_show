export type ChatMessage = {
  role: 'user' | 'model';
  text: string;
};

export const chatWithAgent = async (history: ChatMessage[], newMessage: string): Promise<string> => {
  try {
    const response = await fetch(`/api/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ history, newMessage })
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMsg = `Server error ${response.status}`;
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.error) errorMsg = errorData.error;
      } catch (e) {
        if (errorText) errorMsg += `: ${errorText.substring(0, 50)}`;
      }
      throw new Error(errorMsg);
    }

    const data = await response.json();
    return data.text;
  } catch (error: any) {
    console.error('Chat request failed:', error);
    return "AI Agent connection error: " + (error.message || error.toString());
  }
};

export const chatWithAgentStream = async (
  history: ChatMessage[],
  newMessage: string,
  onChunk: (delta: string, accumulated: string) => void
): Promise<string> => {
  let accumulated = '';
  try {
    const response = await fetch(`/api/ai/chat-stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ history, newMessage }),
    });

    if (!response.ok || !response.body) {
      const fallbackText = await chatWithAgent(history, newMessage);
      onChunk(fallbackText, fallbackText);
      return fallbackText;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data:')) continue;
        const dataStr = trimmed.replace(/^data:\s*/, '');
        if (dataStr === '[DONE]') break;

        try {
          const parsed = JSON.parse(dataStr);
          if (parsed.text) {
            accumulated += parsed.text;
            onChunk(parsed.text, accumulated);
          } else if (parsed.error) {
            throw new Error(parsed.error);
          }
        } catch {
          // ignore chunk parse issues
        }
      }
    }

    if (!accumulated) {
      const fallbackText = await chatWithAgent(history, newMessage);
      onChunk(fallbackText, fallbackText);
      return fallbackText;
    }

    return accumulated;
  } catch (error: any) {
    console.warn('Streaming failed, falling back:', error);
    if (accumulated) return accumulated;
    const fallbackText = await chatWithAgent(history, newMessage);
    onChunk(fallbackText, fallbackText);
    return fallbackText;
  }
};

