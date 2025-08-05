'use client';

import { Box, Paper, Typography, Stack } from '@mui/material';
import { TrendingUp, TrendingDown, Savings } from '@mui/icons-material';
import { formatCurrency } from '@/utils/formatCurrency';

interface DashboardStatsData {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  savingsRate: number;
}

interface DashboardStatsProps {
  stats: DashboardStatsData | null;
}

const DashboardStats = ({ stats }: DashboardStatsProps) => {
  if (!stats) {
    return null;
  }

  const statCards = [
    {
      title: 'Total Income',
      value: formatCurrency(stats.totalIncome),
      icon: <TrendingUp />,
      color: 'success.main',
      bgColor: 'success.light',
      iconBgColor: 'success.main'
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(stats.totalExpenses),
      icon: <TrendingDown />,
      color: 'error.main',
      bgColor: 'error.light',
      iconBgColor: 'error.main'
    },
    {
      title: 'Net Income',
      value: formatCurrency(stats.netIncome),
      icon: stats.netIncome >= 0 ? <TrendingUp /> : <TrendingDown />,
      color: stats.netIncome >= 0 ? 'success.main' : 'error.main',
      bgColor: stats.netIncome >= 0 ? 'success.light' : 'error.light',
      iconBgColor: stats.netIncome >= 0 ? 'success.main' : 'error.main'
    },
    {
      title: 'Savings Rate',
      value: `${stats.savingsRate.toFixed(1)}%`,
      icon: <Savings />,
      color: 'primary.main',
      bgColor: 'primary.light',
      iconBgColor: 'primary.main'
    }
  ];

  return (
    <Box sx={{ mb: 3 }}>
      <Stack 
        direction="row" 
        spacing={3} 
        sx={{ 
          width: '100%'
        }}
      >
        {statCards.map((card, index) => (
          <Paper 
            key={index}
            sx={{ 
              p: 3, 
              flex: 1,
              minHeight: 120,
              background: `linear-gradient(135deg, ${card.bgColor}15 0%, ${card.bgColor}05 100%)`,
              border: `1px solid ${card.bgColor}30`,
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 3
              }
            }}
          >
            <Stack spacing={2} sx={{ height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography 
                  variant="h6" 
                  color="text.secondary"
                  sx={{ fontWeight: 500 }}
                >
                  {card.title}
                </Typography>
                <Box 
                  sx={{ 
                    p: 1, 
                    borderRadius: 1, 
                    bgcolor: `${card.iconBgColor}20`,
                    color: card.iconBgColor
                  }}
                >
                  {card.icon}
                </Box>
              </Box>
              
              <Typography 
                variant="h4" 
                color={card.color}
                sx={{ 
                  fontWeight: 700,
                  fontSize: { xs: '1.5rem', md: '2rem' }
                }}
              >
                {card.value}
              </Typography>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
};

export default DashboardStats; 