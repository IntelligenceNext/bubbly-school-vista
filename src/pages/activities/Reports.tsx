
import React, { useState } from 'react';
import PageTemplate from '@/components/PageTemplate';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LineChart } from '@/components/ui/LineChart';
import { BarChart } from '@/components/ui/BarChart';
import { Calendar, Download, Filter } from 'lucide-react';

const Reports = () => {
  const [yearFilter, setYearFilter] = useState("2025");
  const [activityTypeFilter, setActivityTypeFilter] = useState("all");
  
  // Mock data for participation trend
  const participationTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Student Participation',
        data: [120, 145, 160, 185, 210, 245, 180, 160, 220, 250, 270, 290],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
      }
    ],
  };

  // Mock data for category distribution
  const categoryDistributionData = {
    labels: ['Sports', 'Arts', 'Cultural', 'Academic', 'Clubs', 'Social'],
    datasets: [
      {
        label: 'Activities Count',
        data: [8, 5, 6, 4, 3, 2],
        backgroundColor: [
          '#3b82f6', // Blue
          '#10b981', // Green
          '#f59e0b', // Yellow
          '#ef4444', // Red
          '#8b5cf6', // Purple
          '#ec4899'  // Pink
        ],
      }
    ],
  };

  // Mock data for class participation
  const classParticipationData = {
    labels: ['Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'],
    datasets: [
      {
        label: 'Students Participating',
        data: [45, 65, 85, 70, 55],
        backgroundColor: '#10b981',
      },
      {
        label: 'Total Students',
        data: [60, 75, 90, 85, 65],
        backgroundColor: '#d1d5db',
      }
    ],
  };

  // Mock data for activity results
  const activityResultsData = {
    labels: ['Annual Sports Day', 'Chess Tournament', 'Science Exhibition', 'Dance Competition', 'Debate Club'],
    datasets: [
      {
        label: 'Winners',
        data: [12, 1, 3, 2, 2],
        backgroundColor: '#f59e0b',
      },
      {
        label: 'Runners-up',
        data: [12, 1, 3, 2, 2],
        backgroundColor: '#8b5cf6',
      },
      {
        label: 'Participants',
        data: [96, 30, 59, 44, 20],
        backgroundColor: '#64748b',
      }
    ],
  };

  // Summary stats
  const summaryStats = {
    total: {
      activities: 28,
      participants: 345,
      certificates: 280
    },
    categories: {
      sports: {
        activities: 8,
        participants: 120
      },
      arts: {
        activities: 5,
        participants: 40
      },
      cultural: {
        activities: 6,
        participants: 65
      },
      academic: {
        activities: 4,
        participants: 85
      },
      clubs: {
        activities: 3,
        participants: 24
      },
      social: {
        activities: 2,
        participants: 35
      }
    }
  };

  const handleDownloadReport = () => {
    // This would handle downloading the report
    console.log('Download report');
  };

  // Filter summary stats based on activity type
  const getFilteredStats = () => {
    if (activityTypeFilter === 'all') {
      return summaryStats.total;
    } else {
      const categoryKey = activityTypeFilter.toLowerCase() as keyof typeof summaryStats.categories;
      const categoryStats = summaryStats.categories[categoryKey];
      // We don't have certificate counts by category in our mock data, so we'll just use participants
      return {
        activities: categoryStats.activities,
        participants: categoryStats.participants,
        certificates: Math.round(categoryStats.participants * 0.8) // Estimate based on total ratio
      };
    }
  };

  const filteredStats = getFilteredStats();

  // Create the props in the format expected by the components
  const participationTrendChartProps = {
    index: 'labels',
    categories: participationTrendData.labels,
    colors: ['#3b82f6'],
    data: participationTrendData.datasets[0].data,
  };

  const categoryDistributionProps = {
    index: 'labels',
    categories: categoryDistributionData.labels,
    colors: [
      '#3b82f6', // Blue
      '#10b981', // Green
      '#f59e0b', // Yellow
      '#ef4444', // Red
      '#8b5cf6', // Purple
      '#ec4899'  // Pink
    ],
    data: categoryDistributionData.datasets[0].data,
  };

  const classParticipationProps = {
    index: 'labels',
    categories: classParticipationData.labels,
    colors: ['#10b981', '#d1d5db'],
    data: [
      classParticipationData.datasets[0].data,
      classParticipationData.datasets[1].data,
    ],
  };

  const activityResultsProps = {
    index: 'labels',
    categories: activityResultsData.labels,
    colors: ['#f59e0b', '#8b5cf6', '#64748b'],
    data: [
      activityResultsData.datasets[0].data,
      activityResultsData.datasets[1].data,
      activityResultsData.datasets[2].data,
    ],
  };

  return (
    <PageTemplate title="Activities Management" subtitle="Analyze activity performance and participation">
      <PageHeader 
        title="Activity Reports" 
        description="Visualize participation trends and activity outcomes"
        actions={[
          <Button key="download" variant="outline" onClick={handleDownloadReport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        ]}
      />

      <div className="mt-6 space-y-6">
        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Period:</span>
              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Activity Type:</span>
              <Select value={activityTypeFilter} onValueChange={setActivityTypeFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="arts">Arts</SelectItem>
                  <SelectItem value="cultural">Cultural</SelectItem>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="clubs">Clubs</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{filteredStats.activities}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{filteredStats.participants}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Certificates Issued</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{filteredStats.certificates}</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Participation Trend</CardTitle>
              <CardDescription>Monthly student participation in activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <LineChart {...participationTrendChartProps} />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Activity Distribution</CardTitle>
              <CardDescription>Activities by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <BarChart {...categoryDistributionProps} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Class Participation</CardTitle>
              <CardDescription>Student involvement by grade level</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <BarChart {...classParticipationProps} />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Activity Results</CardTitle>
              <CardDescription>Outcome distribution for major events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <BarChart {...activityResultsProps} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTemplate>
  );
};

export default Reports;
