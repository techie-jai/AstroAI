// Utility functions for parsing chat responses

export interface ParsedResponse {
  shortAnswer: string
  detailedAnswer: string
  content: string
}

export function parseChatResponse(responseData: any): ParsedResponse {
  let shortAnswer = ''
  let detailedAnswer = ''
  let content = ''

  try {
    // Check if response is a JSON string that needs parsing
    if (typeof responseData.response === 'string' && responseData.response.trim().startsWith('{')) {
      const parsedResponse = JSON.parse(responseData.response)
      shortAnswer = parsedResponse.short_answer || responseData.response
      detailedAnswer = parsedResponse.detailed_answer || ''
      content = shortAnswer
    } else {
      // Use the structured response from backend
      shortAnswer = responseData.short_answer || responseData.response || 'Unable to generate response'
      detailedAnswer = responseData.detailed_answer || ''
      content = responseData.response || shortAnswer
    }
  } catch (error) {
    console.error('[ResponseParser] Error parsing response:', error)
    // Fallback to single response
    shortAnswer = responseData.response || 'Unable to generate response'
    detailedAnswer = ''
    content = shortAnswer
  }

  return { shortAnswer, detailedAnswer, content }
}

// Test function to validate parsing
export function testResponseParsing(): void {
  console.log('[ResponseParser] Testing response parsing...')
  
  // Test case 1: JSON string response
  const jsonResponse = {
    response: JSON.stringify({
      short_answer: "Short answer test",
      detailed_answer: "Detailed answer test"
    })
  }
  
  const parsed1 = parseChatResponse(jsonResponse)
  console.log('[ResponseParser] Test 1 - JSON string:', {
    shortAnswer: parsed1.shortAnswer,
    detailedAnswer: parsed1.detailedAnswer,
    hasDetailed: !!parsed1.detailedAnswer
  })
  
  // Test case 2: Structured response
  const structuredResponse = {
    response: "Fallback response",
    short_answer: "Structured short answer",
    detailed_answer: "Structured detailed answer"
  }
  
  const parsed2 = parseChatResponse(structuredResponse)
  console.log('[ResponseParser] Test 2 - Structured:', {
    shortAnswer: parsed2.shortAnswer,
    detailedAnswer: parsed2.detailedAnswer,
    hasDetailed: !!parsed2.detailedAnswer
  })
  
  // Test case 3: Single response (backward compatibility)
  const singleResponse = {
    response: "Single response only"
  }
  
  const parsed3 = parseChatResponse(singleResponse)
  console.log('[ResponseParser] Test 3 - Single:', {
    shortAnswer: parsed3.shortAnswer,
    detailedAnswer: parsed3.detailedAnswer,
    hasDetailed: !!parsed3.detailedAnswer
  })
}
