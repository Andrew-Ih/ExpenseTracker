# AI Financial Assistant

## Overview
The AI Financial Assistant is a chat-based interface that allows users to ask questions about their financial data in natural language. It provides insights about spending patterns, budget analysis, and financial recommendations.

## Architecture

### Components Structure
```
aiComponents/
├── AIChatContainer.tsx      # Main orchestrator component
├── AIChatHeader.tsx         # Header with title and actions
├── AIChatMessages.tsx       # Messages display container
├── AIChatMessage.tsx        # Individual message component
├── AIChatInput.tsx          # Input field with send button
├── AIChatSuggestions.tsx    # Suggested questions display
├── AILoadingIndicator.tsx   # Loading animation
└── index.ts                 # Component exports
```

### Key Features
- **Real-time Chat Interface**: Modern chat UI with message bubbles
- **Smart Suggestions**: Pre-defined question categories for easy interaction
- **Message History**: Persistent chat history using localStorage
- **Loading States**: Animated loading indicators during AI processing
- **Error Handling**: Graceful error handling with user-friendly messages
- **Responsive Design**: Works on all screen sizes
- **Accessibility**: Keyboard navigation and screen reader support

### State Management
- Uses custom `useAIChat` hook for state management
- Implements optimistic updates for better UX
- Handles request cancellation for better performance
- Persistent storage with localStorage

### Service Layer
- `aiService.ts`: Handles API communication
- Integrates with existing services (transaction, budget, user)
- Provides fallback responses during development
- Handles authentication and error scenarios

## Usage

### Basic Implementation
```tsx
import AIChatContainer from '../components/aiComponents/AIChatContainer';

export default function AIAssistantPage() {
  return (
    <Box sx={{ height: '100vh' }}>
      <AIChatContainer />
    </Box>
  );
}
```

### Custom Hook Usage
```tsx
import { useAIChat } from '../hooks/useAIChat';

function MyComponent() {
  const { messages, isLoading, sendMessage, clearMessages } = useAIChat();
  
  const handleSend = async (message: string) => {
    await sendMessage(message);
  };
  
  return (
    // Your component JSX
  );
}
```

## API Integration

### Backend Requirements
The AI assistant expects the following backend endpoints:

#### POST /api/ai/chat
```typescript
interface AIChatRequest {
  message: string;
  userId: string;
  context?: {
    transactions?: Transaction[];
    budgets?: Budget[];
    userProfile?: UserProfile;
  };
}

interface AIChatResponse {
  message: string;
  metadata?: {
    type: 'financial_analysis' | 'budget_insight' | 'spending_pattern' | 'general';
    confidence: number;
    dataPoints: number;
    processingTime: number;
  };
  suggestions?: string[];
}
```

### Data Context
The AI service automatically fetches and provides:
- User profile information
- Recent transactions (last 3 months)
- Current month budgets
- Financial summary calculations

## Security Considerations

### Data Isolation
- All requests include user authentication
- User can only access their own financial data
- No cross-user data access possible

### Input Validation
- Message content sanitization
- Rate limiting (to be implemented)
- Content filtering for sensitive queries

### Privacy
- Chat history stored locally only
- No sensitive data logged
- Secure API communication

## Future Enhancements

### Planned Features
- **Voice Input**: Speech-to-text functionality
- **File Upload**: Receipt image analysis
- **Advanced Analytics**: Predictive insights
- **Export Chat**: Save conversations as PDF
- **Multi-language Support**: Internationalization

### AI Model Improvements
- **Context Awareness**: Better conversation flow
- **Personalization**: User-specific recommendations
- **Learning**: Improve responses based on user feedback
- **Integration**: Connect with external financial APIs

## Development Notes

### Environment Variables
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Dependencies
- `uuid`: For generating unique message IDs
- `@mui/material`: UI components
- `@mui/icons-material`: Icons

### Testing
- Unit tests for hooks and services
- Integration tests for API communication
- E2E tests for user interactions

## Troubleshooting

### Common Issues
1. **Messages not loading**: Check localStorage permissions
2. **API errors**: Verify backend connectivity and authentication
3. **Performance issues**: Check for memory leaks in message history
4. **Styling issues**: Ensure Material-UI theme is properly configured

### Debug Mode
Enable debug logging by setting:
```typescript
localStorage.setItem('ai_debug', 'true');
```

## Contributing
When adding new features:
1. Follow the existing component structure
2. Add proper TypeScript types
3. Include error handling
4. Update documentation
5. Add tests for new functionality 