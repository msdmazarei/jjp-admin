import { ReportCommentTable } from './report-table-1/ReportTable1';

export type TReport = 'newst_comment';

export const reportListMapCmp: {
    [key in TReport]: any;
} = {
    newst_comment: ReportCommentTable
}
