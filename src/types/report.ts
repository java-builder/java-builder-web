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

export interface OverviewStatsResponse {
    totalUsers: number;
    totalCourses: number;
    monthlyRevenue: number;
    newEnrollments: number;
}
