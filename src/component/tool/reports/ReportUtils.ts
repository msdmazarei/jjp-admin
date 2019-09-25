import { ReportCommentTable } from './report-table-1/ReportTable1';
import {ReportBestSellsChart} from './report-chart-1/ReportChart1';
import {ReportYearSellChart} from './report-chart-2/ReportChart2';
import {ReportlastSellWithTypeTable}  from './report-table-2/ReportTable2';

export type TReport = 'newst_comment' | 'best_sells_chart' | 'last_sell_with_type' | 'year_sell_with_month'


export const reportListMapCmp: {
    [key in TReport]: any;
} = {
    newst_comment: ReportCommentTable,
    best_sells_chart: ReportBestSellsChart,
    last_sell_with_type : ReportlastSellWithTypeTable,
    year_sell_with_month: ReportYearSellChart
}

