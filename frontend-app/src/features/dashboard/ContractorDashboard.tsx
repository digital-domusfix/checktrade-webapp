import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { useAuthStore } from '../../store/useAuthStore';
import dashboardService, { DashboardData } from '../../services/dashboardService';

export default function ContractorDashboard() {
  const profile = useAuthStore((s) => s.profile);
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    dashboardService
      .getDashboard()
      .then(setData)
      .catch(() => setError(true));
  }, []);

  if (error) {
    return (
      <div className="p-4 text-center text-red-600">
        Unable to load dashboard. Please try again.
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-4 text-center">Loading...</div>
    );
  }

  const firstName = profile?.fullName?.split(' ')[0] || 'there';
  const { stats, leads } = data;

  return (
    <div className="mx-auto max-w-4xl space-y-4 p-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
      {!profile?.isActive && (
        <div className="rounded border border-primary bg-white p-3 text-sm shadow-sm">
          Your profile is still under review
        </div>
      )}
      <h1 className="text-2xl font-bold">Welcome back, {firstName}!</h1>

      <section className="rounded border bg-white p-4 shadow-sm md:col-span-2">
        <h2 className="mb-4 text-lg font-semibold">Quote &amp; Job Overview</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 text-center">
          <Link
            to="/jobs?status=awaiting"
            className="focus:outline-none focus:ring rounded"
            aria-label="Leads Awaiting Quote"
          >
            <div className="text-2xl font-bold" data-testid="awaiting">
              {stats.leadsAwaitingQuote}
            </div>
            <div className="text-sm">Leads Awaiting Quote</div>
          </Link>
          <Link
            to="/quotes?status=sent"
            className="focus:outline-none focus:ring rounded"
            aria-label="Quotes Sent"
          >
            <div className="text-2xl font-bold">{stats.quotesSent}</div>
            <div className="text-sm">Quotes Sent</div>
          </Link>
          <Link
            to="/jobs?status=inprogress"
            className="focus:outline-none focus:ring rounded"
            aria-label="Jobs in Progress"
          >
            <div className="text-2xl font-bold">{stats.jobsInProgress}</div>
            <div className="text-sm">Jobs in Progress</div>
          </Link>
          <Link
            to="/jobs?status=completed"
            className="focus:outline-none focus:ring rounded"
            aria-label="Completed Jobs"
          >
            <div className="text-2xl font-bold">{stats.completedJobs}</div>
            <div className="text-sm">Completed Jobs</div>
          </Link>
        </div>
      </section>

      <section className="rounded border bg-white p-4 shadow-sm md:col-span-1">
        <h2 className="mb-2 text-lg font-semibold">New Job Leads In Your Area</h2>
        {leads.length > 0 ? (
          <ul className="space-y-3">
            {leads.slice(0, 5).map((lead) => (
              <li key={lead.id} className="flex items-center justify-between">
                <Link
                  to={`/leads/${lead.id}`}
                  className="flex-1 focus:outline-none focus:ring rounded"
                >
                  <div className="font-medium">{lead.title}</div>
                  <div className="text-sm text-gray-500">
                    {lead.location}
                    {lead.budget ? ` • ${lead.budget}` : ''}
                  </div>
                  {lead.description && (
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {lead.description}
                    </p>
                  )}
                </Link>
                <Button
                  variant="outline"
                  className="ml-2 text-sm"
                  onClick={() => navigate(`/quote/new?leadId=${lead.id}`)}
                >
                  Quote Now
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500" data-testid="no-leads">
            No new leads right now – check back soon.
          </p>
        )}
      </section>

      <section className="rounded border bg-white p-4 shadow-sm">
        <h2 className="mb-2 text-lg font-semibold">Quick Actions</h2>
        <ul className="space-y-2">
          <li>
            <Link to="/profile-setup" className="text-primary hover:underline">
              Edit Profile
            </Link>
          </li>
          <li>
            <Link to="/availability" className="text-primary hover:underline">
              Set Availability
            </Link>
          </li>
          <li>
            <Link to="/quotes" className="text-primary hover:underline">
              View Quotes
            </Link>
          </li>
          <li>
            <Link to="/quotes/new" className="text-primary hover:underline">
              + Add a Manual Quote
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
