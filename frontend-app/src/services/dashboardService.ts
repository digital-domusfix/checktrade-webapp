export interface DashboardStats {
  leadsAwaitingQuote: number;
  quotesSent: number;
  jobsInProgress: number;
  completedJobs: number;
}

export interface LeadSummary {
  id: string;
  title: string;
  location?: string;
  budget?: string;
  description?: string;
}

export interface DashboardData {
  stats: DashboardStats;
  leads: LeadSummary[];
}

const getDashboard = async (): Promise<DashboardData> => {
  // This would normally fetch data from the API
  return Promise.resolve({
    stats: {
      leadsAwaitingQuote: 2,
      quotesSent: 5,
      jobsInProgress: 1,
      completedJobs: 12,
    },
    leads: [
      {
        id: '1',
        title: 'Bathroom Renovation',
        location: 'Halifax',
        budget: '$5k',
        description: 'Update fixtures and tiling',
      },
      {
        id: '2',
        title: 'Deck Repair',
        location: 'Dartmouth',
        budget: '$2k',
        description: 'Replace rotten boards',
      },
    ],
  });
};

export default { getDashboard };
