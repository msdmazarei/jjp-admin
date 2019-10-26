import { ReportCommentTable } from './report-table-1/ReportTable1';
import { ReportBestSellsChart } from './report-chart-1/ReportChart1';
import { ReportlastSellWithTypeTable } from './report-table-2/ReportTable2';
import { ReportYearSellChart } from './report-chart-2/ReportChart2';
import { ReportPublisherSellsCompare } from './report-chart-3/ReportChart3';
import { ReportStoreCustomerPerformance } from './report-chart-4/ReportChart4';

export type TReport = 'newst_comment' | 'best_sells_chart' | 'last_sell_with_type' |
    'year_sell_with_month' | 'Compear_publisher_sells' | 'store_customer_performance'

export type TReportName = 'ten_Recent_Comments' | 'The_best_selling_and_least_selling_of_recent_weeks_and_months' |
    'fifteen_books_have_recently_been_sold_by_type' | 'Monthly_sale_seasonal_and_yearly' | 'Compare_publishers_sales_by_time_period' |
    'User_to_customer_conversion_process_chart';

export const reportListMapCmp: { [key in TReport]: any;} = {
    newst_comment: ReportCommentTable,
    best_sells_chart: ReportBestSellsChart,
    last_sell_with_type: ReportlastSellWithTypeTable,
    year_sell_with_month: ReportYearSellChart,
    Compear_publisher_sells: ReportPublisherSellsCompare,
    store_customer_performance: ReportStoreCustomerPerformance,
}

