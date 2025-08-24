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
      {/* Desktop Layout - Single Row */}
      <Box sx={{ 
        display: { xs: 'none', md: 'flex' },
        gap: 3,
        width: '100%'
      }}>
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
                  sx={{ 
                    fontWeight: 700,
                    fontSize: '1.125rem'
                  }}
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
                  fontSize: '2rem'
                }}
              >
                {card.value}
              </Typography>
            </Stack>
          </Paper>
        ))}
      </Box>

      {/* Mobile Layout - 2x2 Grid */}
      <Box sx={{ 
        display: { xs: 'flex', md: 'none' },
        flexDirection: 'column',
        gap: 2,
        width: '100%'
      }}>
        {/* First row - Total Income and Total Expenses */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'row',
          gap: 2
        }}>
          {/* Total Income */}
          <Paper 
            sx={{ 
              p: 2, 
              flex: 1,
              minHeight: 100,
              background: `linear-gradient(135deg, ${statCards[0].bgColor}15 0%, ${statCards[0].bgColor}05 100%)`,
              border: `1px solid ${statCards[0].bgColor}30`,
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
                  sx={{ 
                    fontWeight: 700,
                    fontSize: '1rem'
                  }}
                >
                  {statCards[0].title}
                </Typography>
                <Box 
                  sx={{ 
                    p: 1, 
                    borderRadius: 1, 
                    bgcolor: `${statCards[0].iconBgColor}20`,
                    color: statCards[0].iconBgColor
                  }}
                >
                  {statCards[0].icon}
                </Box>
              </Box>
              
              <Typography 
                variant="h4" 
                color={statCards[0].color}
                sx={{ 
                  fontWeight: 700,
                  fontSize: '1.25rem'
                }}
              >
                {statCards[0].value}
              </Typography>
            </Stack>
          </Paper>

          {/* Total Expenses */}
          <Paper 
            sx={{ 
              p: 2, 
              flex: 1,
              minHeight: 100,
              background: `linear-gradient(135deg, ${statCards[1].bgColor}15 0%, ${statCards[1].bgColor}05 100%)`,
              border: `1px solid ${statCards[1].bgColor}30`,
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
                  sx={{ 
                    fontWeight: 700,
                    fontSize: '1rem'
                  }}
                >
                  {statCards[1].title}
                </Typography>
                <Box 
                  sx={{ 
                    p: 1, 
                    borderRadius: 1, 
                    bgcolor: `${statCards[1].iconBgColor}20`,
                    color: statCards[1].iconBgColor
                  }}
                >
                  {statCards[1].icon}
                </Box>
              </Box>
              
              <Typography 
                variant="h4" 
                color={statCards[1].color}
                sx={{ 
                  fontWeight: 700,
                  fontSize: '1.25rem'
                }}
              >
                {statCards[1].value}
              </Typography>
            </Stack>
          </Paper>
        </Box>

        {/* Second row - Net Income and Savings Rate */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'row',
          gap: 2
        }}>
          {/* Net Income */}
          <Paper 
            sx={{ 
              p: 2, 
              flex: 1,
              minHeight: 100,
              background: `linear-gradient(135deg, ${statCards[2].bgColor}15 0%, ${statCards[2].bgColor}05 100%)`,
              border: `1px solid ${statCards[2].bgColor}30`,
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
                  sx={{ 
                    fontWeight: 700,
                    fontSize: '1rem'
                  }}
                >
                  {statCards[2].title}
                </Typography>
                <Box 
                  sx={{ 
                    p: 1, 
                    borderRadius: 1, 
                    bgcolor: `${statCards[2].iconBgColor}20`,
                    color: statCards[2].iconBgColor
                  }}
                >
                  {statCards[2].icon}
                </Box>
              </Box>
              
              <Typography 
                variant="h4" 
                color={statCards[2].color}
                sx={{ 
                  fontWeight: 700,
                  fontSize: '1.25rem'
                }}
              >
                {statCards[2].value}
              </Typography>
            </Stack>
          </Paper>

          {/* Savings Rate */}
          <Paper 
            sx={{ 
              p: 2, 
              flex: 1,
              minHeight: 100,
              background: `linear-gradient(135deg, ${statCards[3].bgColor}15 0%, ${statCards[3].bgColor}05 100%)`,
              border: `1px solid ${statCards[3].bgColor}30`,
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
                  sx={{ 
                    fontWeight: 700,
                    fontSize: '1rem'
                  }}
                >
                  {statCards[3].title}
                </Typography>
                <Box 
                  sx={{ 
                    p: 1, 
                    borderRadius: 1, 
                    bgcolor: `${statCards[3].iconBgColor}20`,
                    color: statCards[3].iconBgColor
                  }}
                >
                  {statCards[3].icon}
                </Box>
              </Box>
              
              <Typography 
                variant="h4" 
                color={statCards[3].color}
                sx={{ 
                  fontWeight: 700,
                  fontSize: '1.25rem'
                }}
              >
                {statCards[3].value}
              </Typography>
            </Stack>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardStats; 