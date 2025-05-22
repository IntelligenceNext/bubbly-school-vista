
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
  const participationTrendData = [120, 145, 160, 185, 210, 245, 180, 160, 220, 250, 270, 290];
  const participationLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Mock data for category distribution
  const categoryDistributionData = [8, 5, 6, 4, 3, 2];
  const categoryLabels = ['Sports', 'Arts', 'Cultural', 'Academic', 'Clubs', 'Social'];
  const categoryColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  // Mock data for class participation
  const classParticipationLabels = ['Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];
  const classParticipationData = [
    [45, 65, 85, 70, 55], // Participating students
    [60, 75, 90, 85, 65]  // Total students
  ];
  const classParticipationColors = ['#10b981', '#d1d5db'];

  // Mock data for activity results
  const activityResultsLabels = ['Annual Sports Day', 'Chess Tournament', 'Science Exhibition', 'Dance Competition', 'Debate Club'];
  const activityResultsData = [
    [12, 1, 3, 2, 2],  // Winners
    [12, 1, 3, 2, 2],  // Runners-up
    [96, 30, 59, 44, 20]  // Participants
  ];
  const activityResultsColors = ['#f59e0b', '#8b5cf6', '#64748b'];

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
    index: 'name',
    categories: ['Student Participation'],
    colors: ['59, 130, 246'],
    data: participationLabels.map((label, i) => ({
      name: label,
      'Student Participation': participationTrendData[i]
    }))
  };

  const categoryDistributionProps = {
    index: 'name',
    categories: ['Activities Count'],
    colors: categoryColors.map(color => {
      // Convert hex to rgb format as expected by the component
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return `${r}, ${g}, ${b}`;
    }),
    data: categoryLabels.map((label, i) => ({
      name: label,
      'Activities Count': categoryDistributionData[i]
    }))
  };

  const classParticipationProps = {
    index: 'name',
    categories: ['Students Participating', 'Total Students'],
    colors: classParticipationColors.map(color => {
      // Convert hex to rgb format if needed
      if (color.startsWith('#')) {
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        return `${r}, ${g}, ${b}`;
      }
      return color;
    }),
    data: classParticipationLabels.map((label, i) => ({
      name: label,
      'Students Participating': classParticipationData[0][i],
      'Total Students': classParticipationData[1][i]
    }))
  };

  const activityResultsProps = {
    index: 'name',
    categories: ['Winners', 'Runners-up', 'Participants'],
    colors: activityResultsColors.map(color => {
      // Convert hex to rgb format if needed
      if (color.startsWith('#')) {
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        return `${r}, ${g}, ${b}`;
      }
      return color;
    }),
    data: activityResultsLabels.map((label, i) => ({
      name: label,
      'Winners': activityResultsData[0][i],
      'Runners-up': activityResultsData[1][i],
      'Participants': activityResultsData[2][i]
    }))
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
