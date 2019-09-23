import { ReportCommentTable } from './report-table-1/ReportTable1';
import {ReportBestSellsChart} from './report-chart-1/ReportChart1'

export type TReport = 'newst_comment' | 'best_sells_chart'


export const reportListMapCmp: {
    [key in TReport]: any;
} = {
    newst_comment: ReportCommentTable,
    best_sells_chart: ReportBestSellsChart
}

