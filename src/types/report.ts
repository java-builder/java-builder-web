export interface ChartData {
    label: string;
    value: number;
}

export interface CourseRevenue {
    id: string;
    name: string;
    owners: number;
    revenue: number;
}

export interface ReportStatsResponse {
    totalRevenue: number;
    totalUsers: number;
    totalCourses: number;
    totalEnrollments: number;
    revenueChart: ChartData[];
    userChart: ChartData[];
    courseRevenues: CourseRevenue[];
}

export enum TransactionType {
    PAYIN = "PAYIN",
    PAYOUT = "PAYOUT",
    SUBSCRIPTION = "SUBSCRIPTION"
}

export interface RecentActivityResponse {
    transactionType: TransactionType;
    userName: string;
    userAvatarUrl?: string;
    description: string;
    courseTitle?: string;
    subscriptionPlanName?: string;
    price: number;
    createdAt: string;
    timeAgo: string;
}

export interface OverviewStatsResponse {
    totalUsers: number;
    totalCourses: number;
    monthlyRevenue: number;
    newEnrollments: number;
    recentActivities: RecentActivityResponse[];
}

export interface CourseOverviewResponse {
    totalCourses: number;
    totalStudents: number;
    totalRevenue: number;
}
