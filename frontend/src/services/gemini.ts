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
