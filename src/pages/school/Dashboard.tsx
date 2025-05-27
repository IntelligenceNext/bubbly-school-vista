
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import PageTemplate from '@/components/PageTemplate';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  BookOpen, 
  School, 
  Calendar, 
  UserCheck, 
  FileText, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  GraduationCap,
  Building2,
  CreditCard,
  BarChart3
} from 'lucide-react';
import { getSchools, getClasses, getSessions } from '@/services/schoolManagementService';
import { Skeleton } from '@/components/ui/skeleton';

const Dashboard = () => {
  // Fetch data for statistics
  const { data: schools, isLoading: isLoadingSchools } = useQuery({
    queryKey: ['schools'],
    queryFn: async () => {
      const result = await getSchools({ pageSize: 100 });
      return result.data;
    },
  });

  const { data: classes, isLoading: isLoadingClasses } = useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      const result = await getClasses({ pageSize: 100 });
      return result.data;
    },
  });

  const { data: sessions, isLoading: isLoadingSessions } = useQuery({
    queryKey: ['sessions'],
    queryFn: async () => {
      const result = await getSessions({ pageSize: 100 });
      return result.data;
    },
  });

  // Mock data for demonstration (in a real app, these would come from API calls)
  const dashboardStats = {
    totalClasses: classes?.length || 13,
    totalSections: classes?.length ? classes.length * 2 : 14, // Assuming 2 sections per class
    totalStudents: 6,
    studentsActive: 6,
    inactiveStudents: 0,
    promotedStudents: 0,
    transferredToOtherSchool: 0,
    transferredToThisSchool: 0,
    totalInquiries: 82,
    inquiriesActive: 81,
    totalInvoices: 5,
    paidInvoices: 0,
    unpaidInvoices: 5,
    partiallyPaidInvoices: 0,
    totalPayments: 0,
    paymentReceived: 2,
    amountPending: "₹15,402.60",
    expense: 0,
    income: 0,
    examsWithPublishedAdmitCards: 2,
    examsWithPublishedResults: 2,
    totalAdmins: 2,
    totalRoles: 3,
    totalStaff: 8,
    staffActive: 8,
    totalBooks: 0,
    totalLibraryCards: 0,
    totalBooksIssued: 0,
    totalBooksReturnPending: 0,
    totalGirls: 3,
    totalBoys: 3,
    examsWithPublishedTimetables: 2
  };

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color = 'blue',
    subtitle,
    isLoading = false 
  }: {
    title: string;
    value: string | number;
    icon: any;
    color?: 'blue' | 'green' | 'orange' | 'red' | 'purple' | 'yellow';
    subtitle?: string;
    isLoading?: boolean;
  }) => {
    const colorClasses = {
      blue: 'border-l-blue-500 bg-blue-50',
      green: 'border-l-green-500 bg-green-50',
      orange: 'border-l-orange-500 bg-orange-50',
      red: 'border-l-red-500 bg-red-50',
      purple: 'border-l-purple-500 bg-purple-50',
      yellow: 'border-l-yellow-500 bg-yellow-50'
    };

    const iconColors = {
      blue: 'text-blue-600',
      green: 'text-green-600',
      orange: 'text-orange-600',
      red: 'text-red-600',
      purple: 'text-purple-600',
      yellow: 'text-yellow-600'
    };

    return (
      <Card className={`border-l-4 ${colorClasses[color]} hover:shadow-md transition-shadow`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-bold text-gray-900">
                  {isLoading ? <Skeleton className="h-8 w-16" /> : value}
                </h3>
                <Icon className={`h-6 w-6 ${iconColors[color]}`} />
              </div>
              <p className="text-sm font-medium text-gray-700">{title}</p>
              {subtitle && (
                <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const currentSession = sessions?.find(s => s.is_current) || { name: '2025-2026' };

  return (
    <PageTemplate 
      title="School Dashboard" 
      subtitle={`Current Session: ${currentSession.name}`}
    >
      <div className="space-y-6">
        {/* Header with Action Buttons */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Baptist Higher Primary / High School</h1>
            <p className="text-gray-600">2025-2026</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Users className="h-4 w-4 mr-2" />
              Assign Classes
            </Button>
            <Button variant="outline" size="sm">
              <UserCheck className="h-4 w-4 mr-2" />
              Assign Admins
            </Button>
          </div>
        </div>

        {/* Main Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Row 1 */}
          <StatCard
            title="Total Classes"
            value={dashboardStats.totalClasses}
            icon={BookOpen}
            color="blue"
            subtitle={`Session: ${currentSession.name}`}
            isLoading={isLoadingClasses}
          />
          <StatCard
            title="Total Sections"
            value={dashboardStats.totalSections}
            icon={Building2}
            color="green"
            subtitle={`Session: ${currentSession.name}`}
            isLoading={isLoadingClasses}
          />
          <StatCard
            title="Total Students"
            value={dashboardStats.totalStudents}
            icon={Users}
            color="orange"
            subtitle={`Session: ${currentSession.name}`}
          />
          <StatCard
            title="Students Active"
            value={dashboardStats.studentsActive}
            icon={UserCheck}
            color="red"
            subtitle={`Session: ${currentSession.name}`}
          />

          {/* Row 2 */}
          <StatCard
            title="Inactive Students"
            value={dashboardStats.inactiveStudents}
            icon={Users}
            color="blue"
            subtitle={`Session: ${currentSession.name}`}
          />
          <StatCard
            title="Promoted Students"
            value={dashboardStats.promotedStudents}
            icon={TrendingUp}
            color="green"
            subtitle={`Session: ${currentSession.name}`}
          />
          <StatCard
            title="Total Inquiries"
            value={dashboardStats.totalInquiries}
            icon={FileText}
            color="orange"
            subtitle={`Session: ${currentSession.name}`}
          />
          <StatCard
            title="Inquiries Active"
            value={dashboardStats.inquiriesActive}
            icon={CheckCircle}
            color="red"
            subtitle={`Session: ${currentSession.name}`}
          />

          {/* Row 3 */}
          <StatCard
            title="Transferred to Other School"
            value={dashboardStats.transferredToOtherSchool}
            icon={School}
            color="blue"
            subtitle={`Session: ${currentSession.name}`}
          />
          <StatCard
            title="Transferred to this School"
            value={dashboardStats.transferredToThisSchool}
            icon={School}
            color="green"
            subtitle={`Session: ${currentSession.name}`}
          />
          <StatCard
            title="Total Invoices"
            value={dashboardStats.totalInvoices}
            icon={FileText}
            color="orange"
            subtitle={`Session: ${currentSession.name}`}
          />
          <StatCard
            title="Paid Invoices"
            value={dashboardStats.paidInvoices}
            icon={CheckCircle}
            color="red"
            subtitle={`Session: ${currentSession.name}`}
          />

          {/* Row 4 */}
          <StatCard
            title="Unpaid Invoices"
            value={dashboardStats.unpaidInvoices}
            icon={AlertCircle}
            color="blue"
            subtitle={`Session: ${currentSession.name}`}
          />
          <StatCard
            title="Partially Paid Invoices"
            value={dashboardStats.partiallyPaidInvoices}
            icon={Clock}
            color="green"
            subtitle={`Session: ${currentSession.name}`}
          />
          <StatCard
            title="Total Payments"
            value={dashboardStats.totalPayments}
            icon={CreditCard}
            color="orange"
            subtitle={`Session: ${currentSession.name}`}
          />
          <StatCard
            title="Payment Received"
            value={dashboardStats.paymentReceived}
            icon={DollarSign}
            color="red"
            subtitle={`Session: ${currentSession.name}`}
          />

          {/* Row 5 */}
          <StatCard
            title="Amount Pending"
            value={dashboardStats.amountPending}
            icon={Clock}
            color="blue"
            subtitle={`Session: ${currentSession.name}`}
          />
          <StatCard
            title="Expense"
            value={`₹${dashboardStats.expense}`}
            icon={TrendingDown}
            color="green"
            subtitle={`Session: ${currentSession.name}`}
          />
          <StatCard
            title="Income"
            value={`₹${dashboardStats.income}`}
            icon={TrendingUp}
            color="orange"
            subtitle={`Session: ${currentSession.name}`}
          />
          <StatCard
            title="Exams with Published Timetables"
            value={dashboardStats.examsWithPublishedTimetables}
            icon={Calendar}
            color="red"
            subtitle={`Session: ${currentSession.name}`}
          />

          {/* Row 6 */}
          <StatCard
            title="Exams with Published Admit Cards"
            value={dashboardStats.examsWithPublishedAdmitCards}
            icon={FileText}
            color="blue"
            subtitle={`Session: ${currentSession.name}`}
          />
          <StatCard
            title="Exams with Published Results"
            value={dashboardStats.examsWithPublishedResults}
            icon={BarChart3}
            color="green"
            subtitle={`Session: ${currentSession.name}`}
          />
          <StatCard
            title="Total Admins"
            value={dashboardStats.totalAdmins}
            icon={UserCheck}
            color="orange"
            subtitle={`Session: ${currentSession.name}`}
          />
          <StatCard
            title="Total Roles"
            value={dashboardStats.totalRoles}
            icon={Users}
            color="red"
            subtitle={`Session: ${currentSession.name}`}
          />

          {/* Row 7 */}
          <StatCard
            title="Total Staff"
            value={dashboardStats.totalStaff}
            icon={Users}
            color="blue"
            subtitle={`Session: ${currentSession.name}`}
          />
          <StatCard
            title="Staff Active"
            value={dashboardStats.staffActive}
            icon={UserCheck}
            color="green"
            subtitle={`Session: ${currentSession.name}`}
          />
          <StatCard
            title="Total Books"
            value={dashboardStats.totalBooks}
            icon={BookOpen}
            color="orange"
            subtitle={`Session: ${currentSession.name}`}
          />
          <StatCard
            title="Total Library Cards"
            value={dashboardStats.totalLibraryCards}
            icon={CreditCard}
            color="red"
            subtitle={`Session: ${currentSession.name}`}
          />

          {/* Row 8 */}
          <StatCard
            title="Total Books Issued"
            value={dashboardStats.totalBooksIssued}
            icon={BookOpen}
            color="blue"
            subtitle={`Session: ${currentSession.name}`}
          />
          <StatCard
            title="Total Books Return Pending"
            value={dashboardStats.totalBooksReturnPending}
            icon={Clock}
            color="green"
            subtitle={`Session: ${currentSession.name}`}
          />
          <StatCard
            title="Total Girls"
            value={dashboardStats.totalGirls}
            icon={Users}
            color="orange"
            subtitle={`Session: ${currentSession.name}`}
          />
          <StatCard
            title="Total Boys"
            value={dashboardStats.totalBoys}
            icon={Users}
            color="red"
            subtitle={`Session: ${currentSession.name}`}
          />
        </div>

        {/* Recent Activities Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Last 10 Active Inquiries */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Last 10 Active Inquiries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-blue-500 text-white">
                      <th className="text-left p-2 rounded-l">Class</th>
                      <th className="text-left p-2">Name</th>
                      <th className="text-left p-2">Phone</th>
                      <th className="text-left p-2">Email</th>
                      <th className="text-left p-2">Message</th>
                      <th className="text-left p-2 rounded-r">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-2">
                        <Badge variant="outline">4thSTD</Badge>
                      </td>
                      <td className="p-2">Apoorva</td>
                      <td className="p-2">9890770589</td>
                      <td className="p-2">-</td>
                      <td className="p-2">Fee concession</td>
                      <td className="p-2">27-05-2025</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2">
                        <Badge variant="outline">1stSTD</Badge>
                      </td>
                      <td className="p-2">Pratiksha</td>
                      <td className="p-2">9890770589</td>
                      <td className="p-2">-</td>
                      <td className="p-2">Fee concession</td>
                      <td className="p-2">27-05-2025</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2">
                        <Badge variant="outline">Nursery</Badge>
                      </td>
                      <td className="p-2">Prithviraj</td>
                      <td className="p-2">9890770589</td>
                      <td className="p-2">-</td>
                      <td className="p-2">Fee concession</td>
                      <td className="p-2">27-05-2025</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="flex justify-center mt-4">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">Previous</Button>
                  <Button variant="default" size="sm">1</Button>
                  <Button variant="outline" size="sm">2</Button>
                  <Button variant="outline" size="sm">Next</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Last 15 Admissions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Last 15 Admissions - Session: 2025-2026</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-blue-500 text-white">
                      <th className="text-left p-2 rounded-l">Student Name</th>
                      <th className="text-left p-2">Enrollment Number</th>
                      <th className="text-left p-2">Class</th>
                      <th className="text-left p-2">Section</th>
                      <th className="text-left p-2 rounded-r">Admission Number</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-2">Khushi</td>
                      <td className="p-2">BHPH5000000126</td>
                      <td className="p-2">5thSTD</td>
                      <td className="p-2">A</td>
                      <td className="p-2">05/25-26</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2">SIDRA NAAZ</td>
                      <td className="p-2">BHPH5000000125</td>
                      <td className="p-2">UKG</td>
                      <td className="p-2">A</td>
                      <td className="p-2">04/25-26</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2">ABDUR RAFE QASSAB</td>
                      <td className="p-2">BHPH5000000124</td>
                      <td className="p-2">LKG</td>
                      <td className="p-2">A</td>
                      <td className="p-2">03/25-26</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="flex justify-center mt-4">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">Previous</Button>
                  <Button variant="default" size="sm">1</Button>
                  <Button variant="outline" size="sm">2</Button>
                  <Button variant="outline" size="sm">Next</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTemplate>
  );
};

export default Dashboard;
