'use client';

import { Box, Typography, Paper, Stack, Chip } from '@mui/material';
import { TrendingUp, Analytics, Savings, Receipt } from '@mui/icons-material';

interface AIChatSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
}

const suggestionCategories = [
  {
    title: 'Spending Analysis',
    icon: <TrendingUp />,
    color: 'primary',
    suggestions: [
      'What am I spending the most on?',
      'Which month did I spend the most?',
      'What was my most expensive purchase?',
      'How much did I spend on food this month?'
    ]
  },
  {
    title: 'Budget Insights',
    icon: <Analytics />,
    color: 'secondary',
    suggestions: [
      'Am I on track to reach my budget goals?',
      'What are my top 3 spending categories?',
      'How much can I save if I reduce entertainment by 20%?',
      'Which days of the week do I spend the most?'
    ]
  },
  {
    title: 'Savings & Goals',
    icon: <Savings />,
    color: 'success',
    suggestions: [
      'What\'s my average daily spending?',
      'How does my spending compare to last month?',
      'Am I saving enough for my goals?',
      'What should I cut down on to save more?'
    ]
  },
  {
    title: 'Transaction Insights',
    icon: <Receipt />,
    color: 'info',
    suggestions: [
      'Show me my recent large transactions',
      'What\'s my spending pattern this year?',
      'Which categories are over budget?',
      'How much did I save this month?'
    ]
  }
];

export default function AIChatSuggestions({ onSuggestionClick }: AIChatSuggestionsProps) {
  return (
    <Box sx={{ 
      p: 2,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      overflow: 'auto'
    }}>
      {/* Welcome Message */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" color="text.primary" sx={{ mb: 1 }}>
          Welcome to your AI Financial Assistant! 🤖
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          I can help you analyze your spending, track budgets, and provide financial insights. 
          Try asking me one of these questions or type your own!
        </Typography>
      </Box>

      {/* Suggestions Grid */}
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        spacing={3}
        sx={{ mb: 4 }}
      >
        {suggestionCategories.map((category, index) => (
          <Paper
            key={index}
            sx={{
              p: 2,
              flex: 1,
              bgcolor: 'background.paper',
              border: 1,
              borderColor: 'divider',
              borderRadius: 2,
              transition: 'all 0.2s ease',
              '&:hover': {
                boxShadow: 3,
                transform: 'translateY(-2px)'
              }
            }}
          >
            {/* Category Header */}
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                borderRadius: 1,
                bgcolor: `${category.color}.main`,
                color: 'white'
              }}>
                {category.icon}
              </Box>
              <Typography variant="h6" fontWeight="bold" color="text.primary">
                {category.title}
              </Typography>
            </Stack>

            {/* Suggestions */}
            <Stack spacing={1}>
              {category.suggestions.map((suggestion, suggestionIndex) => (
                <Chip
                  key={suggestionIndex}
                  label={suggestion}
                  onClick={() => onSuggestionClick(suggestion)}
                  sx={{
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    height: 'auto',
                    minHeight: 40,
                    p: 1,
                    bgcolor: 'background.default',
                    border: 1,
                    borderColor: 'divider',
                    '& .MuiChip-label': {
                      whiteSpace: 'normal',
                      lineHeight: 1.4,
                      color: 'text.primary'
                    },
                    '&:hover': {
                      bgcolor: `${category.color}.main`,
                      color: 'white',
                      borderColor: `${category.color}.main`,
                      '& .MuiChip-label': {
                        color: 'white'
                      }                      
                    }
                  }}
                />
              ))}
            </Stack>
          </Paper>
        ))}
      </Stack>

      {/* Footer */}
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="body2" color="text.secondary">
          💡 Tip: You can ask me anything about your finances in natural language!
        </Typography>
      </Box>
    </Box>
  );
} 